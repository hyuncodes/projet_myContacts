import { Router } from "express";
import { findUserContacts, createUserContact, updateUserContactById, deleteUserContactById } from "../controllers/contact.controller.js";

export const contactRouter = Router();

contactRouter.get("/", findUserContacts);
contactRouter.post("/new", createUserContact);
contactRouter.patch("/:id", updateUserContactById);
contactRouter.delete("/:id",deleteUserContactById);