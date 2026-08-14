import express, { Request, Response, Router } from "express";
import multer, { FileFilterCallback } from "multer";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Order from "../model/order";
import { User } from "../model/user";
import MailService from "../ulits/mail";

const JWT_SECRET = process.env.JWT_SECRET || "omris_secret_jwt_key_2026";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "omrishomekichen@gmail.com";
const mailService = new MailService();
const orderRouter: Router = express.Router();

// Store uploaded image temporarily in memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

interface PlaceOrderRequest extends Request {
  file?: Express.Multer.File;
}

// POST /place-order
orderRouter.post(
  "/place-order",
  upload.single("paymentScreenshot"),
  async (req: PlaceOrderRequest, res: Response) => {
    try {
      const {
        token,
        email,
        orderItems,
        shippingAddress,
        paymentMethod,
        utrNumber,
        totalPrice,
      } = req.body || {};

      // Extract raw token from request body or Authorization header
      const rawToken =
        token || req.headers.authorization?.replace(/^Bearer\s+/i, "");

      let userId: string | undefined;
      let userObj: any = null;

      if (rawToken && rawToken !== "null" && rawToken !== "undefined") {
        try {
          const decoded = jwt.verify(rawToken, JWT_SECRET) as {
            userId?: string;
            id?: string;
          };
          userId = decoded.userId || decoded.id;
        } catch (e) {
          // Check if token is stored on User document
          userObj = await User.findOne({ token: rawToken });
          if (userObj) {
            userId = userObj._id.toString();
          }
        }
      }

      // If token did not resolve userId, attempt to find user by email
      if (!userId && email) {
        userObj = await User.findOne({ email: email.toLowerCase() });
        if (userObj) {
          userId = userObj._id.toString();
        }
      }

      const isUpi =
        paymentMethod && paymentMethod.toLowerCase().includes("upi");

      // Check payment screenshot requirement for UPI
      if (isUpi && !req.file && !utrNumber) {
        return res.status(400).json({
          success: false,
          message:
            "Payment screenshot or UTR number is required for UPI payments",
        });
      }

      // Validate required fields
      if (!orderItems || !shippingAddress || !paymentMethod || !totalPrice) {
        return res.status(400).json({
          success: false,
          message: "All required order details must be provided",
        });
      }

      // Parse orderItems if sent as JSON string
      let parsedOrderItems;
      try {
        parsedOrderItems =
          typeof orderItems === "string" ? JSON.parse(orderItems) : orderItems;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid orderItems format",
        });
      }

      // Generate unique order ID
      const orderId = `ORD-${Date.now()}-${crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase()}`;

      // Build Order payload
      const orderData: any = {
        orderId,
        orderItems: parsedOrderItems,
        shippingAddress,
        paymentMethod,
        totalPrice: Number(totalPrice),
        status: "pending",
      };

      if (userId) {
        orderData.userId = userId;
      }

      if (utrNumber) {
        orderData.utrNumber = utrNumber;
      } else {
        orderData.utrNumber = "N/A";
      }

      if (req.file) {
        orderData.paymentScreenshot = {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        };
      } else {
        orderData.paymentScreenshot = {
          data: Buffer.from(""),
          contentType: "image/none",
        };
      }

      const order = new Order(orderData);
      await order.save();

      // Send admin and customer notification emails asynchronously
      const customerEmail = email || userObj?.email;
      const customerName = userObj
        ? `${userObj.firstName || ""} ${userObj.lastName || ""}`.trim()
        : "Customer";

      const screenshotBase64 = req.file
        ? `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`
        : undefined;

      (async () => {
        try {
          console.log(
            `[Order Mail] Dispatching admin order notification to ${ADMIN_EMAIL}...`,
          );
          await mailService.sendAdminOrderNotificationEmail(
            ADMIN_EMAIL,
            order.orderId,
            customerName,
            customerEmail || "N/A",
            order.totalPrice,
            order.paymentMethod,
            order.utrNumber || "N/A",
            order.shippingAddress,
            order.orderItems,
            order.status,
            (order as any).createdAt,
            Boolean(req.file),
            req.body?.phone || userObj?.phone || undefined,
            screenshotBase64,
          );
        } catch (mailErr) {
          console.error(
            "[Order Mail] Error sending admin order email:",
            mailErr,
          );
        }

        if (customerEmail) {
          try {
            console.log(
              `[Order Mail] Dispatching customer confirmation email to ${customerEmail}...`,
            );
            await mailService.sendOrderConfirmationEmail(
              customerEmail,
              order.orderId,
              customerName,
              order.totalPrice,
              order.orderItems,
              order.shippingAddress,
              order.paymentMethod,
            );
          } catch (mailErr) {
            console.error(
              "[Order Mail] Error sending customer confirmation email:",
              mailErr,
            );
          }
        }
      })();

      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order: {
          orderId: order.orderId,
          userId: order.userId,
          orderItems: order.orderItems,
          shippingAddress: order.shippingAddress,
          paymentMethod: order.paymentMethod,
          utrNumber: order.utrNumber,
          totalPrice: order.totalPrice,
          status: order.status,
          createdAt: (order as any).createdAt,
        },
      });
    } catch (error) {
      console.error("Place order error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to place order",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
  orderRouter.get("/orders", async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }),
);

orderRouter.post("/user/orders", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const orders = await Order.find({ userId: user._id });
    if (!orders) {
      return res.status(404).json({
        success: false,
        message: "Orders not found",
      });
    }
    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default orderRouter;
