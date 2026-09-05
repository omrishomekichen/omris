import express, {
  Request,
  Response,
  Router,
} from "express";
import multer, {
  FileFilterCallback,
} from "multer";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import Order from "../model/order";
import { User } from "../model/user";
import MailService from "../ulits/mail";
import { sendPushToAdmins } from "../ulits/push";
import { getAuthToken, JWT_SECRET } from "../config/security";

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ||
  "airapickles@gmail.com";

const mailService = new MailService();

const orderRouter: Router =
  express.Router();



interface JwtPayload {
  userId?: string;
  id?: string;
}

interface PlaceOrderRequest
  extends Request {
  file?: Express.Multer.File;
}



const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    if (
      file.mimetype.startsWith("image/")
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only image files are allowed",
        ),
      );
    }
  },
});



const getUserIdFromToken = (
  req: Request,
): string | null => {
  try {
    const token = getAuthToken(
      req.headers.cookie,
      req.headers.authorization,
    );

    if (!token) {
      return null;
    }

    const decoded =
      jwt.verify(
        token,
        JWT_SECRET,
      ) as JwtPayload;

    const userId =
      decoded.userId ||
      decoded.id;

    if (!userId) {
      return null;
    }

    return userId;
  } catch (error) {
    return null;
  }
};



orderRouter.post(
  "/place-order",
  upload.single("paymentScreenshot"),

  async (
    req: PlaceOrderRequest,
    res: Response,
  ) => {
    try {


      const {
        email,
        customerName: submittedCustomerName,
        customerPhone: submittedCustomerPhone,
        // Keep supporting previous checkout clients during their rollout.
        fullName: legacyFullName,
        phone: legacyPhone,
        orderItems,
        shippingAddress,
        paymentMethod,
        utrNumber,
        totalPrice,
      } = req.body || {};

      const requestedCustomerName = String(
        submittedCustomerName || legacyFullName || "",
      ).trim();
      const requestedCustomerPhone = String(
        submittedCustomerPhone || legacyPhone || "",
      ).trim();

      if (!requestedCustomerName) {
        return res.status(400).json({
          success: false,
          message: "Customer name is required to place an order.",
        });
      }

      let userId = getUserIdFromToken(req);
      let user: any = null;

      if (userId) {
        user = await User.findById(userId);
      }

      if (!user && email) {
        const cleanEmail = String(email).toLowerCase().trim();
        user = await User.findOne({ email: cleanEmail });
        if (!user) {
          const [firstName, ...rest] = requestedCustomerName.split(" ");
          user = new User({
            firstName: firstName || "Customer",
            lastName: rest.join(" ") || "",
            email: cleanEmail,
            password: "guest_order_account",
            agreeToTerms: true,
            verified: true,
          });
          await user.save();
        }
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Please sign in or provide a valid email to place your order.",
        });
      }



      if (
        !orderItems ||
        !shippingAddress ||
        !paymentMethod ||
        totalPrice === undefined ||
        totalPrice === null
      ) {
        return res.status(400).json({
          success: false,
          message:
            "All required order details must be provided",
        });
      }



      let parsedOrderItems: unknown;

      try {
        parsedOrderItems =
          typeof orderItems === "string"
            ? JSON.parse(orderItems)
            : orderItems;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid orderItems format",
        });
      }

      if (
        !Array.isArray(parsedOrderItems) ||
        parsedOrderItems.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "At least one order item is required",
        });
      }



      const isUpi = String(
        paymentMethod,
      )
        .toLowerCase()
        .includes("upi");



      if (
        isUpi &&
        !req.file &&
        !utrNumber
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Payment screenshot or UTR number is required for UPI payments",
        });
      }



      const orderId =
        `ORD-${Date.now()}-${crypto
          .randomBytes(3)
          .toString("hex")
          .toUpperCase()}`;



      const paymentScreenshot = req.file
        ? {
          data: req.file.buffer,
          contentType:
            req.file.mimetype,
        }
        : {
          data: Buffer.from(""),
          contentType: "image/none",
        };



      const order = new Order({
        userId: user._id,

        customerName:
          requestedCustomerName,

        customerPhone:
          requestedCustomerPhone || "N/A",

        orderId,

        orderItems:
          parsedOrderItems,

        shippingAddress,

        paymentMethod,

        paymentScreenshot,

        utrNumber:
          utrNumber || "N/A",

        totalPrice:
          Number(totalPrice),

        status: "pending",
      });


      await order.save();

      void sendPushToAdmins(
        "New order received",
        `${order.customerName} placed an order for ₹${order.totalPrice}`,
        { orderId: order.orderId, type: "new_order" },
      );

      const customerEmail =
        user.email;

      const customerName =
        order.customerName;

      const customerPhone =
        order.customerPhone === "N/A" ? undefined : order.customerPhone;

      const createdAt =
        order.createdAt
          ? order.createdAt.toISOString()
          : new Date().toISOString();

      const screenshotBase64 =
        req.file
          ? `data:${req.file.mimetype};base64,${req.file.buffer.toString(
            "base64",
          )}`
          : undefined;



      void (async () => {


        try {


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

            createdAt,

            Boolean(req.file),

            customerPhone,

            screenshotBase64,
          );


        } catch (mailError) {
          console.error(
            "[Order Mail] Admin email error:",
            mailError,
          );
        }



        if (customerEmail) {
          try {


            await mailService.sendOrderConfirmationEmail(
              customerEmail,

              order.orderId,

              customerName,

              order.totalPrice,

              order.orderItems,

              order.shippingAddress,

              order.paymentMethod,
            );


          } catch (mailError) {
            console.error(
              "[Order Mail] Customer email error:",
              mailError,
            );
          }
        }
      })();



      return res.status(201).json({
        success: true,

        message:
          "Order placed successfully",

        order: {
          orderId:
            order.orderId,

          customerName:
            order.customerName,

          customerPhone:
            order.customerPhone,

          userId:
            order.userId,

          orderItems:
            order.orderItems,

          shippingAddress:
            order.shippingAddress,

          paymentMethod:
            order.paymentMethod,

          utrNumber:
            order.utrNumber,

          totalPrice:
            order.totalPrice,

          status:
            order.status,

          createdAt:
            order.createdAt,
        },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,

        message:
          "Failed to place order",

        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      });
    }
  },
);





orderRouter.post("/user/orders", async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid or missing authentication token",
      });
    }

    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

const handleGetSingleOrder = async (req: Request, res: Response) => {
  try {
    const userId = getUserIdFromToken(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid or missing authentication token",
      });
    }

    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : (rawId as string);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId
      ? { $or: [{ _id: id }, { orderId: id }], userId }
      : { orderId: id, userId };

    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order details",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

orderRouter.get("/user/orders/:id", handleGetSingleOrder);
orderRouter.post("/user/orders/:id", handleGetSingleOrder);

export default orderRouter;
