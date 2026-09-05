import express, { Request, Response } from "express";
import Order from "../../model/order";
import { Review } from "../../model/review";
import { requireAuth } from "../../middleware/auth";

const admindashboardRouter: express.Router = express.Router();

admindashboardRouter.get(
  "/admin-dashboard-kpis",
  async (_req: Request, res: Response) => {
    try {
      const totalUnassignedOrders = await Order.countDocuments({
        $or: [
          { assignTo: { $exists: false } },
          { assignTo: null },
          { assignTo: "" },
          { assignTo: "owner" },
          { assignTo: "unassigned" },
        ],
      });
      const totalpendingOrders = await Order.countDocuments({
        $or: [{ status: "pending" }, { status: "processing" }],
      });
      const totalRevenue = await Order.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]).then((result) => (result[0]?.total ?? 0));

      return res.status(200).json({
        success: true,
        totalUnassignedOrders,
        totalpendingOrders,
        totalPendingOrders: totalpendingOrders,
        totalRevenue,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch unassigned orders",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);





admindashboardRouter.get(
    "/admin-dashboard-latest-reviews",
    async (req: Request, res: Response) => {
        try {
            const reviews = await Review.find({
                comment: { $exists: true, $ne: "" },
            })
                .sort({ createdAt: -1 })
                .limit(5)
                .select(
                    "userId userName productId productName orderId rating comment verifiedPurchase createdAt"
                )
                .lean();

            return res.status(200).json({
                success: true,
                reviews,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch latest reviews",
            });
        }
    }
);

  admindashboardRouter.get(
    "/admin-reviews",
    async (_req: Request, res: Response) => {
      try {
        const reviews = await Review.find({
          comment: { $exists: true, $ne: "" },
        })
          .sort({ createdAt: -1 })
          .select(
            "userId userName productId productName orderId rating comment verifiedPurchase createdAt"
          )
          .lean();

        return res.status(200).json({
          success: true,
          reviews,
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to fetch reviews",
        });
      }
    }
  );

  admindashboardRouter.delete(
    "/admin-reviews/:id",
    requireAuth,
    async (req: Request, res: Response) => {
      try {
        const review = await Review.findByIdAndDelete(req.params.id);
        if (!review) {
          return res.status(404).json({
            success: false,
            message: "Review not found",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Review deleted successfully",
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: "Failed to delete review",
        });
      }
    }
  );

export default admindashboardRouter;