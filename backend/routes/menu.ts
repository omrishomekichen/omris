import express, { Request, Response } from "express";
import { Menu } from "../model/menu";

const menuRouter: express.Router = express.Router();

menuRouter.get("/menu", async (req: Request, res: Response) => {
  try {
    const menu = await Menu.find().sort({ sortOrder: 1 });
    return res.status(200).json(menu);
  } catch (error) {
    console.error("Menu retrieval error:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error" });
  }
});

export default menuRouter;
