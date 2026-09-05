import express, { Request, Response, Router } from "express";
import Review from "../model/review";
import Order from "../model/order";
import { User } from "../model/user";
import { getAuthToken, JWT_SECRET } from "../config/security";
import jwt from "jsonwebtoken";

const reviewRouter: Router = express.Router();

const getUserIdFromToken = (req: Request): string | null => {
  try {
    const token = getAuthToken(
      req.headers.cookie,
      req.headers.authorization,
    );
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId?: string;
      id?: string;
    };
    return decoded.userId || decoded.id || null;
  } catch {
    return null;
  }
};

// POST /api/reviews - Submit a review for an order item
reviewRouter.post("/reviews", async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req);
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required to leave a review.",
      });
    }

    const { orderId, productName, productId, rating, comment } = req.body || {};

    if (!orderId || !productName || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Order ID, product name, rating, and comment are required.",
      });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5 stars.",
      });
    }

    // Safely query Order without triggering Mongoose ObjectId CastError
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(String(orderId));
    const orderQuery = isObjectId
      ? { $or: [{ _id: orderId }, { orderId: orderId }] }
      : { orderId: orderId };

    let order = await Order.findOne({ ...orderQuery, userId });

    // Fallback: If not found by userId match, search by orderId directly
    if (!order) {
      order = await Order.findOne(orderQuery);
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    // Fetch user profile for display name
    const user = await User.findById(userId);
    const userName = user
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Customer"
      : "Verified Customer";

    const pid = productId || productName.toLowerCase().replace(/\s+/g, "-");
    const targetOrderId = String(order.orderId || order._id);

    // Upsert review (user can update their review for a product in an order)
    const existingReview = await Review.findOne({
      userId,
      orderId: targetOrderId,
      productName: productName.trim(),
    });

    let review;
    if (existingReview) {
      existingReview.rating = numericRating;
      existingReview.comment = comment.trim();
      review = await existingReview.save();
    } else {
      review = await Review.create({
        userId,
        userName,
        productId: pid,
        productName: productName.trim(),
        orderId: targetOrderId,
        rating: numericRating,
        comment: comment.trim(),
        verifiedPurchase: true,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Thank you! Your review has been published.",
      review,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error?.message || "Failed to submit review. Please try again.",
    });
  }
});

// GET /api/reviews/recent - Fetch top 10 recent real reviews for Dashboard carousel
reviewRouter.get("/reviews/recent", async (_req: Request, res: Response) => {
  try {
    const dbReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return res.status(200).json({
      success: true,
      reviews: dbReviews || [],
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      reviews: [],
    });
  }
});

// GET /api/reviews/order/:orderId - Fetch reviews written for a specific order
reviewRouter.get("/reviews/order/:orderId", async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req);
    const { orderId } = req.params;

    if (!userId || !orderId) {
      return res.status(200).json({ success: true, reviews: [] });
    }

    const reviews = await Review.find({
      $or: [{ orderId }, { userId }],
    }).lean();

    return res.status(200).json({
      success: true,
      reviews: reviews.filter((r) => String(r.orderId) === String(orderId)),
    });
  } catch (error) {
    return res.status(200).json({ success: true, reviews: [] });
  }
});

// GET /api/reviews/product/:productId - Fetch real reviews for a specific product
reviewRouter.get("/reviews/product/:productId", async (req: Request, res: Response) => {
  try {
    const rawId = req.params.productId;
    const productId = Array.isArray(rawId) ? rawId[0] : (rawId as string);

    const dbReviews = await Review.find({
      $or: [
        { productId: productId },
        { productName: new RegExp(productId.replace(/-/g, " "), "i") },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    const totalReviews = dbReviews.length;
    const avgRating =
      totalReviews > 0
        ? dbReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    return res.status(200).json({
      success: true,
      reviews: dbReviews,
      averageRating: totalReviews > 0 ? Math.round(avgRating * 10) / 10 : 0,
      totalReviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product reviews.",
    });
  }
});

export default reviewRouter;
