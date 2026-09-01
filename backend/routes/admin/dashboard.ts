import express, { Request, Response } from "express";
import Order from "../../model/order";

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
      console.error("Error fetching unassigned orders:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch unassigned orders",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
);
export default admindashboardRouter;