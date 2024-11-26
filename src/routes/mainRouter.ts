import { Router } from "express";
import Controller from "../controllers/globalController";
import GlobalVerifyToken from "../services/VerifyToken";

import multer from 'multer';
import config from '../images/config';

const upload = multer(config);

const mainRouter = Router();

mainRouter.post("/register", Controller.register);
mainRouter.post("/login", GlobalVerifyToken.veryfyToken, Controller.login);
mainRouter.post("/category", GlobalVerifyToken.veryfyToken, Controller.registerCategory);

mainRouter.post("/products", GlobalVerifyToken.veryfyToken, upload.single('banner'), Controller.registerProduct);

export default mainRouter;