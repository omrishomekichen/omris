import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import { app } from "./api/mail";

dotenv.config();

app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    console.log(
      `[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now() - start}ms)`,
    );
  });

  next();
});

const port = Number(process.env.PORT) || 6000;

app.listen(port, () => {
  console.log(`Mail server listening on http://localhost:${port}`);
});
