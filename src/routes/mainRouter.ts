import { Router } from "express";
import Controller from "../controllers/globalController";

const mainRouter = Router();

mainRouter.post("/register", Controller.register);
mainRouter.post("/login", Controller.login);

export default mainRouter;