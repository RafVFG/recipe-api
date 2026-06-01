import express, { json, Router } from "express";
import cors from "cors";
import { readdirSync } from "fs";
import path from "path";
import "dotenv/config";

import { contentType } from "./config/middleware/content-type";
import process from "./interfaces/server";

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:3000" }));
app.use(json());
app.use(contentType);
app.use("/uploads", express.static(path.resolve(__dirname, "../../uploads")));

const router = Router();
app.use("/api", router);

const routes = readdirSync(`${__dirname}/routes`);
routes.forEach(async (file) => {
    (await import(`./routes/${file}`)).default(router);
})

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`http://${process.env.HOST}:${process.env.PORT}`);
});
