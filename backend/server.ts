import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import authRouter from "./routes/auth";
import {MailSender} from "./ulits/mail"
dotenv.config();

const app: express.Express = express();
app.set("trust proxy", 1);

app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;

  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

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
  const start = Date.now();

  res.on("finish", () => {
    console.log(
      `[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now() - start}ms)`,
    );
  });

  next();
});

app.use("/api", authRouter);

async function connectDatabase(): Promise<void> {
  let uri: string | undefined = process.env.MONGODB_URI;

  if (!uri) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("MONGODB_URI must be set in production.");
    }

    console.log(
      "MONGODB_URI not set, starting in-memory MongoDB for development...",
    );

    const mongod = await MongoMemoryServer.create({
      binary: {
        version: "7.0.5",
      },
    });

    uri = mongod.getUri();

    console.log("In-memory MongoDB started at", uri);
  }

  await mongoose.connect(uri);

  console.log("Connected to MongoDB");
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

export const mailService = new MailSender()

// Render supplies the port through PORT. Keep 3000 solely for local runs.
const PORT = Number(process.env.PORT ?? 5000);


const HOST = "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  console.error(`Unable to listen on ${HOST}:${PORT}:`, error);
  process.exit(1);
});

export default app;
