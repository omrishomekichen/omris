import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import Order from "../../model/order";
import { BranchUser } from "../../model/branchuser";
import { User } from "../../model/user";
import { requireAuth } from "../../middleware/auth";
import { MailService } from "../../ulits/mail";

const adminorderRouter: express.Router = express.Router();
const mailService = new MailService();

adminorderRouter.get("/admin-team", requireAuth, async (_req, res) => {
    const members = await BranchUser.find({}, "firstName lastName email role branch verified").sort({ firstName: 1 }).lean();
    return res.json({ success: true, members });
});

adminorderRouter.post("/admin-team", requireAuth, async (req, res) => {
    try {
        const { firstName, lastName, email, password, role = "admin", branch = "" } = req.body || {};
        if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password || password.length < 6) {
            return res.status(400).json({ success: false, message: "Name, email and a 6+ character password are required" });
        }
        if (!["admin", "manager", "staff", "StoreOwner"].includes(role)) return res.status(400).json({ success: false, message: "Invalid role" });
        const member = await BranchUser.create({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.toLowerCase().trim(), password: await bcrypt.hash(password, 10), role, branch: String(branch || "").trim(), verified: true, agreeToTerms: true });
        return res.status(201).json({ success: true, member: { ...member.toObject(), password: undefined } });
    } catch (error: any) {
        return res.status(error?.code === 11000 ? 409 : 500).json({ success: false, message: error?.code === 11000 ? "Email already exists" : "Failed to create team member" });
    }
});

adminorderRouter.patch("/admin-team/:id", requireAuth, async (req, res) => {
    const { firstName, lastName, role, branch, verified } = req.body || {};
    const member = await BranchUser.findByIdAndUpdate(req.params.id, { $set: { firstName, lastName, role, branch, verified } }, { new: true, runValidators: true }).select("firstName lastName email role branch verified");
    if (!member) return res.status(404).json({ success: false, message: "Team member not found" });
    return res.json({ success: true, member });
});

adminorderRouter.delete("/admin-team/:id", requireAuth, async (req, res) => {
    try {
        const member = await BranchUser.findByIdAndDelete(req.params.id);
        if (!member) return res.status(404).json({ success: false, message: "Team member not found" });
        return res.json({ success: true, message: "Team member deleted" });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error?.message || "Failed to delete team member" });
    }
});

async function notifyCustomerStatus(order: any, status: string) {
    try {
        const user = order.userId ? await User.findById(order.userId).select("email") : null;
        if (user?.email) {
            await mailService.sendOrderStatusUpdateEmail(
                user.email,
                order.orderId,
                order.customerName,
                status,
            );
        }
    } catch (error) {
        console.error("[Order Mail] Status email error:", error);
    }
}

adminorderRouter.patch("/admin-orders/:id/verify-payment", requireAuth, async (req: Request, res: Response) => {
    try {
        const requestBody = req.body as {
            profile?: {
                id?: unknown;
                role?: unknown;
                branch?: unknown;
            };
        };
        const profile = requestBody?.profile;
        const profileId = typeof profile?.id === "string" ? profile.id.trim() : "";
        const profileRole = typeof profile?.role === "string" ? profile.role : "";
        const profileBranch = typeof profile?.branch === "string" ? profile.branch.trim() : "";

        if (!profileId || !["owner", "admin", "manager", "staff"].includes(profileRole)) {
            return res.status(403).json({ success: false, message: "Valid user profile is required" });
        }

        const orderId = req.params.id;
        if (!orderId) {
            return res.status(400).json({ success: false, message: "Order ID is required" });
        }
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    paymentVerified: true,
                    status: "confirmed",
                    assignTo: profileId,
                    ...(profileBranch ? { branch: profileBranch } : {}),
                },
            },
            { new: true, runValidators: true },
        );

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        void notifyCustomerStatus(order, "confirmed");

        return res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            order,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to verify payment" });
    }
});

adminorderRouter.patch("/admin-orders/:id/status", requireAuth, async (req: Request, res: Response) => {
    try {
        const requestBody = req.body as {
            status?: unknown;
            profile?: { id?: unknown; role?: unknown; branch?: unknown };
        };
        const profile = requestBody?.profile;
        const profileId = typeof profile?.id === "string" ? profile.id.trim() : "";
        const profileRole = typeof profile?.role === "string" ? profile.role : "";
        const profileBranch = typeof profile?.branch === "string" ? profile.branch.trim() : "";
        const status = typeof requestBody?.status === "string" ? requestBody.status : "";
        const allowedStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "rejected"];

        if (!profileId || !["owner", "admin", "manager", "staff"].includes(profileRole)) {
            return res.status(403).json({ success: false, message: "Valid user profile is required" });
        }
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid order status" });
        }

        const existingOrder = await Order.findById(req.params.id);
        if (!existingOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        if (status === "confirmed" && !existingOrder.paymentVerified) {
            return res.status(409).json({
                success: false,
                message: "Verify payment before confirming this order",
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    status,
                    assignTo: profileId,
                    ...(profileBranch ? { branch: profileBranch } : {}),
                },
            },
            { new: true, runValidators: true },
        );

        void notifyCustomerStatus(order, status);
        return res.status(200).json({ success: true, message: "Order status updated", order });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to update order status" });
    }
});

adminorderRouter.delete("/admin-orders/:id", requireAuth, async (req: Request, res: Response) => {
    try {
        const profile = (req.body || {}).profile;
        const profileId = typeof profile?.id === "string" ? profile.id.trim() : "";
        const profileRole = typeof profile?.role === "string" ? profile.role : "";
        if (!profileId || !["owner", "admin", "manager", "staff"].includes(profileRole)) {
            return res.status(403).json({ success: false, message: "Valid user profile is required" });
        }

        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        return res.status(200).json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to delete order" });
    }
});


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
            const paymentScreenshot = order.paymentScreenshot || {};
            const hasPaymentScreenshot = Boolean(
                paymentScreenshot.data &&
                paymentScreenshot.data.length > 0 &&
                paymentScreenshot.contentType !== "image/none"
            );
            const paymentScreenshotUrl = hasPaymentScreenshot
                ? `data:${paymentScreenshot.contentType};base64,${Buffer.from(
                    paymentScreenshot.data
                ).toString("base64")}`
                : undefined;

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
                _id: String(order._id),
                orderNumber: order.orderId,
                createdAt: order.createdAt,

                customerName,
                customerPhone:
                    order.customerPhone || user?.phone || "N/A",
                customerEmail: user?.email || undefined,
                userId: user?._id ? String(user._id) : order.userId,

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
                    variant: item.variant ?? undefined,
                    productId: item.productId
                        ? String(item.productId)
                        : undefined,
                })),

                shippingAddress: order.shippingAddress,
                paymentMethod: order.paymentMethod,
                utrNumber: order.utrNumber ?? "N/A",
                paymentScreenshot: {
                    contentType: paymentScreenshot.contentType ?? "image/none",
                    hasData: hasPaymentScreenshot,
                },
                paymentScreenshotUrl,
                totalAmount: Number(order.totalPrice ?? 0),
                totalPrice: Number(order.totalPrice ?? 0),

                status: order.status ?? "pending",
                paymentVerified: Boolean(order.paymentVerified),
                assignTo: order.assignTo ?? "owner",
                assigned,
            };
        });

        return res.status(200).json({
            success: true,
            orders: formattedOrders,
        });
    } catch (error) {
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
        return res.status(500).json({
            success: false,
            message: "Failed to fetch admin orders",
        });
    }
});
export default adminorderRouter;
