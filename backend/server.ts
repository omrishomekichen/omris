import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import authRouter from "./routes/auth";
import { MailSender } from "./ulits/mail";
import menuRouter from "./routes/menu";
import orderRouter from "./routes/order";
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

app.use("/api", authRouter);
app.use("/api", menuRouter);
app.use("/api", orderRouter);

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

connectDatabase().catch(() => {
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

const server = app.listen(PORT, HOST);

server.on("error", () => {
  process.exit(1);
});

export default app;
