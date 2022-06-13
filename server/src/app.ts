import path from "path";
import dotenv from "dotenv";
dotenv.config({
  path: path.resolve(".", "src", ".env"),
});

import { clientUrl, sessionSecret, sessionStoreUrl } from "./utils/constants";

import express from "express";
require("express-async-errors");
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const app = express();
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

import session from "express-session";
import connectRedis from "connect-redis";
const RedisStore = connectRedis(session);
import { createClient } from "redis";
const redisClient = createClient({ legacyMode: true, url: sessionStoreUrl });
redisClient.connect().catch(console.error);

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    saveUninitialized: false,
    secret: sessionSecret,
    resave: false,
    name: "imgn_sid",
    cookie: {
      httpOnly: true,
      secure: process.env["NODE_ENV"] === "production",
      sameSite: "lax",
    },
  })
);

app.get("/", (_req, res) => {
  res.send({
    message: "Hello, World!",
  });
});

import router from "./routes/router.routes";
import { error, notFound } from "./controllers/error.controller";

app.use("/api", router);
app.use(notFound);
app.use(error);

export default app;
