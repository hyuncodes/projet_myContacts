import express from "express";
import "dotenv/config";
import router from "./src/routes/index.js";
import {connectDB} from "./config/db.js";
import {errorHandler} from "./src/middlewares/errorHandler.js";
import {authJWT} from "./src/middlewares/authJWT.js";
import {mountSwagger} from "./config/swagger.js";
import * as cookieParser from "cookie-parser";
import cors from "cors";
import {authRouter} from "./src/routes/auth.routes.js";

async function main() {
  const PORT = process.env.PORT || 5000;
  const app = express();

  app.use(cors({origin: "http://localhost:3000", credentials: true}));
  app.use(cookieParser.default());
  app.use(express.json());

  app.get("/health",
      (_req, res) => res.json({status: "ok", service: "mycontacts-api"}));
  mountSwagger(app);

  app.use("/auth", authRouter);
  // const shutdown = async (signal) => {

  //   console.log("${signal} received)

  // }

  app.use((req, res, next) => {
    if (req.path.startsWith("/docs") || req.path === "/health" || req.path.startsWith("/auth/")) {
      return next();
    }
    return authJWT(req, res, next);
  })

  app.use("/", router);

  app.use((req, res) => {
    res.status(404).json({error: {message: "page introuvable"}});
  })
  app.use(errorHandler);

  await connectDB();

  app.listen(PORT, () => {
    console.log(`L'API est prêt sur http://localhost:${PORT}`);
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
