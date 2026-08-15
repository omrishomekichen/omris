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
import { getAuthToken, JWT_SECRET } from "../config/security";

const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL ||
  "omrishomekichen@gmail.com";

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
    const token = getAuthToken(req.headers.cookie);

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
     

      const userId = getUserIdFromToken(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid or missing authentication token",
        });
      }

     

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

     

      const {
        orderItems,
        shippingAddress,
        paymentMethod,
        utrNumber,
        totalPrice,
      } = req.body || {};

     

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

     

      const customerEmail =
        user.email;

      const customerName =
        `${user.firstName || ""} ${user.lastName || ""
          }`.trim() || "Customer";

     
      const customerPhone =
        (user as any).phone ||
        undefined;

     

     

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
      console.error(
        "Place order error:",
        error,
      );

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





orderRouter.post("/user/orders", async (req, res) => {
  try {
    const token = getAuthToken(req.headers.cookie);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required",
      });
    }

    const decoded = jwt.verify(
      token,
      JWT_SECRET
    ) as {
      userId?: string;
      id?: string;
    };

    const userId =
      decoded.userId || decoded.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    const orders = await Order.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(
      "Error fetching user orders:",
      error
    );

    if (
      error instanceof jwt.JsonWebTokenError
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    });
  }
});
export default orderRouter;
