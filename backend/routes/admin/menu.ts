import express, { Request, Response } from "express";
import Menu from "../../model/menu";


const adminmenuRouter: express.Router = express.Router();


adminmenuRouter.get("/menu-items", async (_req: Request, res: Response) => {
    try {
        const menuItems = await Menu.find({}).sort({ createdAt: -1 });  
        return res.status(200).json({
            success: true,
            menuItems,
        });
    } catch (error) {
        console.error("Error fetching menu items:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch menu items",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});

export default adminmenuRouter;