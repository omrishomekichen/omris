import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getAuthToken, JWT_SECRET } from "../config/security";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = getAuthToken(
    req.headers.cookie,
    req.headers.authorization,
  );

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token missing",
    });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}