import { Router } from "express";
import Controller from "../controllers/globalController";

const mainRouter = Router();

mainRouter.get("/", Controller.exibir);

export default mainRouter;