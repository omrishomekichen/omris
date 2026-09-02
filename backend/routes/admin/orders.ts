import express, { Request, Response } from "express";
import Order from "../../model/order";

const adminorderRouter: express.Router = express.Router();

adminorderRouter.get("/admin-orders", async (_req: Request, res: Response) => {
    try {
        const orders = await Order.find({}).populate("userId", "firstName lastName email phone").sort({ createdAt: -1 });

        const formattedOrders = orders.map((order: any) => {
            const user =
                order.userId && typeof order.userId === "object" ? order.userId : null;
            const customerName =
                order.customerName ||
                (user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Unknown customer" : "Unknown customer");
            const assigned = Boolean(
                order.assignTo &&
                    !["owner", "unassigned", ""].includes(String(order.assignTo).trim()),
            );
            const branch =
                order.branch && String(order.branch).trim() !== ""
                    ? order.branch
                    : assigned
                        ? String(order.assignTo)
                        : "Unassigned";
            const shippingAddress = typeof order.shippingAddress === "string" ? order.shippingAddress : "";
            const city = shippingAddress.split(",")[0]?.trim() || "Bangalore";
            const pincode = shippingAddress.match(/\b\d{6}\b/)?.[0] ?? "N/A";
            const orderItems = Array.isArray(order.orderItems) ? order.orderItems : [];
            const items = orderItems.reduce(
                (sum: number, item: any) => sum + Number(item.quantity ?? 0),
                0,
            );
            const itemName = orderItems[0]?.name ?? "Pickle";

            return {
                id: String(order._id),
                orderNumber: order.orderId,
                customerName,
                customerPhone: order.customerPhone || user?.phone || "N/A",
                city,
                pincode,
                branch,
                items,
                itemName,
                totalAmount: Number(order.totalPrice ?? 0),
                status: order.status ?? "pending",
                assigned,
            };
        });

        return res.status(200).json({ success: true, orders: formattedOrders });
    }
    catch (error) {
        console.error("Error fetching admin orders:", error);
        return res.status(500).json({ success: false, message: "Failed to fetch admin orders" });
    }
});


adminorderRouter.get("/recent-pending-orders", async (req: Request, res: Response) => {
   try {
        const orders = await Order.find({}).populate("userId", "firstName lastName email phone").sort({ createdAt: -1 });

        const formattedOrders = orders.map((order: any) => {
            const user =
                order.userId && typeof order.userId === "object" ? order.userId : null;
            const customerName =
                order.customerName ||
                (user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "Unknown customer" : "Unknown customer");
            const assigned = Boolean(
                order.assignTo &&
                    !["owner", "unassigned", ""].includes(String(order.assignTo).trim()),
            );
            const branch =
                order.branch && String(order.branch).trim() !== ""
                    ? order.branch
                    : assigned
                        ? String(order.assignTo)
                        : "Unassigned";
            const shippingAddress = typeof order.shippingAddress === "string" ? order.shippingAddress : "";
            const city = shippingAddress.split(",")[0]?.trim() || "Bangalore";
            const pincode = shippingAddress.match(/\b\d{6}\b/)?.[0] ?? "N/A";
            const orderItems = Array.isArray(order.orderItems) ? order.orderItems : [];
            const items = orderItems.reduce(
                (sum: number, item: any) => sum + Number(item.quantity ?? 0),
                0,
            );
            const itemName = orderItems[0]?.name ?? "Pickle";

            return {
                orderId: String(order._id),
                orderNumber: order.orderId,
                customerName,
                customerPhone: order.customerPhone || user?.phone || "N/A",
                city,
                pincode,
                branch,
                items,
                itemName,
                totalAmount: Number(order.totalPrice ?? 0),
                status: order.status ?? "pending",
                assigned,
            };
        });

        return res.status(200).json({ success: true, orders: formattedOrders });
  } catch (error) {
    console.error("Error fetching recent pending orders:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
});
export default adminorderRouter;
