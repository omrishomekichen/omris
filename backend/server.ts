import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import authRouter from "./routes/auth";
import { MailSender } from "./ulits/mail";
import menuRouter from "./routes/menu";
import orderRouter from "./routes/order";
import reviewRouter from "./routes/review";
import admindashboardRouter from "./routes/admin/dashboard";
import adminorderRouter from "./routes/admin/orders";
import adminmenuRouter from "./routes/admin/menu";
import adminnotificationRouter from "./routes/admin/notification";


dotenv.config();

const app: express.Express = express();
app.set("trust proxy", 1);

// Allow all origins (CORS enabled for all sites)
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With",
  );

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startedAt;
    console.log(`[HTTP] ${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms`);
  });

  next();
});


app.use("/api", authRouter);
app.use("/api", menuRouter);
app.use("/api", orderRouter);
app.use("/api", reviewRouter);
app.use("/api", admindashboardRouter);
app.use("/api", adminorderRouter);
app.use("/api", adminmenuRouter);
app.use("/api", adminnotificationRouter);
async function connectDatabase(): Promise<void> {
  let uri: string | undefined = process.env.MONGODB_URI;

  if (!uri) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MONGODB_URI must be set in production.");
    }

    const mongod = await MongoMemoryServer.create({
      binary: {
        version: "7.0.5",
      },
    });

    uri = mongod.getUri();
  }

  await mongoose.connect(uri);
}

connectDatabase().catch((err: unknown) => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
  });
});

export const mailService = new MailSender();

const PORT = Number(process.env.PORT ?? 5000);

const HOST = "0.0.0.0";

const server = app.listen(PORT, HOST, () => {});

server.on("error", (error: NodeJS.ErrnoException) => {
  console.error(`Unable to listen on ${HOST}:${PORT}:`, error);
  process.exit(1);
});

export default app;
