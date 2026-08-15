import dotenv from "dotenv";
import { app } from "./api/mail";

dotenv.config();

const port = Number(process.env.PORT) || 6000;

app.listen(port);
