import express, { Request, Response } from "express";
import Order from "../../model/order";

const adminorderRouter: express.Router = express.Router();


adminorderRouter.get("/admin-orders", async (_req: Request, res: Response) => {
    try {
        const orders = await Order.find({})
            .populate("userId", "firstName lastName email phone")
            .sort({ createdAt: -1 });

        const formattedOrders = orders.map((order: any) => {
            const user =
                order.userId && typeof order.userId === "object"
                    ? order.userId
                    : null;

            const customerName =
                order.customerName ||
                (user
                    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
                    "Unknown customer"
                    : "Unknown customer");

            const assigned = Boolean(
                order.assignTo &&
                !["owner", "unassigned", ""].includes(
                    String(order.assignTo).trim()
                )
            );

            const branch =
                order.branch && String(order.branch).trim() !== ""
                    ? order.branch
                    : assigned
                        ? String(order.assignTo)
                        : "Unassigned";

            const shippingAddress =
                typeof order.shippingAddress === "string"
                    ? order.shippingAddress
                    : "";

            const city =
                shippingAddress.split(",")[0]?.trim() || "Bangalore";

            const pincode =
                shippingAddress.match(/\b\d{6}\b/)?.[0] ?? "N/A";

            const orderItems = Array.isArray(order.orderItems)
                ? order.orderItems
                : [];

            // Total quantity of all products
            const items = orderItems.reduce(
                (sum: number, item: any) =>
                    sum + Number(item.quantity ?? 0),
                0
            );

            return {
                id: String(order._id),
                orderNumber: order.orderId,
                createdAt: order.createdAt,

                customerName,
                customerPhone:
                    order.customerPhone || user?.phone || "N/A",

                city,
                pincode,
                branch,

                // Total number of products/quantities
                items,

                // SEND ALL ITEMS
                orderItems: orderItems.map((item: any) => ({
                    id: item._id ? String(item._id) : undefined,
                    name: item.name ?? "",
                    quantity: Number(item.quantity ?? 0),
                    price: Number(item.price ?? 0),
                    total:
                        Number(item.price ?? 0) *
                        Number(item.quantity ?? 0),
                    image: item.image ?? null,
                    productId: item.productId
                        ? String(item.productId)
                        : undefined,
                })),

                totalAmount: Number(order.totalPrice ?? 0),

                status: order.status ?? "pending",
                assigned,
            };
        });

        return res.status(200).json({
            success: true,
            orders: formattedOrders,
        });
    } catch (error) {
        console.error("Error fetching admin orders:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin orders",
        });
    }
});


adminorderRouter.get("/recent-pending-orders", async (req: Request, res: Response) => {
      try {
        const orders = await Order.find({
            status: { $in: ["pending", "payment_verification"] },
        })
            .populate("userId", "firstName lastName email phone")
            .sort({ createdAt: -1 });

        const formattedOrders = orders.map((order: any) => {
            const user =
                order.userId && typeof order.userId === "object"
                    ? order.userId
                    : null;

            const customerName =
                order.customerName ||
                (user
                    ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
                    "Unknown customer"
                    : "Unknown customer");

            const assigned = Boolean(
                order.assignTo &&
                !["owner", "unassigned", ""].includes(
                    String(order.assignTo).trim()
                )
            );

            const branch =
                order.branch && String(order.branch).trim() !== ""
                    ? order.branch
                    : assigned
                        ? String(order.assignTo)
                        : "Unassigned";

            const shippingAddress =
                typeof order.shippingAddress === "string"
                    ? order.shippingAddress
                    : "";

            const city =
                shippingAddress.split(",")[0]?.trim() || "Bangalore";

            const pincode =
                shippingAddress.match(/\b\d{6}\b/)?.[0] ?? "N/A";

            const orderItems = Array.isArray(order.orderItems)
                ? order.orderItems
                : [];

            // Total quantity of all products
            const items = orderItems.reduce(
                (sum: number, item: any) =>
                    sum + Number(item.quantity ?? 0),
                0
            );

            return {
                id: String(order._id),
                orderNumber: order.orderId,
                createdAt: order.createdAt,

                customerName,
                customerPhone:
                    order.customerPhone || user?.phone || "N/A",

                city,
                pincode,
                branch,

                // Total number of products/quantities
                items,

                // SEND ALL ITEMS
                orderItems: orderItems.map((item: any) => ({
                    id: item._id ? String(item._id) : undefined,
                    name: item.name ?? "",
                    quantity: Number(item.quantity ?? 0),
                    price: Number(item.price ?? 0),
                    total:
                        Number(item.price ?? 0) *
                        Number(item.quantity ?? 0),
                    image: item.image ?? null,
                    productId: item.productId
                        ? String(item.productId)
                        : undefined,
                })),

                totalAmount: Number(order.totalPrice ?? 0),

                status: order.status ?? "pending",
                assigned,
            };
        });

        return res.status(200).json({
            success: true,
            orders: formattedOrders,
        });
    } catch (error) {
        console.error("Error fetching admin orders:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin orders",
        });
    }
});
export default adminorderRouter;
