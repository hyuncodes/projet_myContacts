import { Router } from "express";
import {authRouter} from "./auth.routes.js";
import {contactRouter} from "./contact.routes.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/contacts", contactRouter);

export default router;