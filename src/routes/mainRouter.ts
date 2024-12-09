import { Router } from "express";
import Controller from "../controllers/globalController";
import GlobalVerifyToken from "../services/VerifyToken";
import multer from 'multer';
import config from '../images/config';


const upload = multer(config);

const mainRouter = Router();

mainRouter.post("/register", Controller.register);
mainRouter.post("/login", Controller.login);
mainRouter.post("/category", GlobalVerifyToken.veryfyToken, Controller.registerCategory);
mainRouter.get('/category', GlobalVerifyToken.veryfyToken, Controller.getCategories)
mainRouter.post("/products", GlobalVerifyToken.veryfyToken, Controller.registerProduct);
mainRouter.get("/products", GlobalVerifyToken.veryfyToken, Controller.getProducts);
mainRouter.get("/category_filter/:category_id", GlobalVerifyToken.veryfyToken, Controller.getProductByCategoryId);
mainRouter.post("/order", GlobalVerifyToken.veryfyToken, Controller.makeOrder);
mainRouter.get("/order", GlobalVerifyToken.veryfyToken, Controller.getOrders);
mainRouter.delete("/order", GlobalVerifyToken.veryfyToken, Controller.deleteOrder);
mainRouter.post("/add_item", GlobalVerifyToken.veryfyToken, Controller.Item);
mainRouter.delete("/delete/:id", GlobalVerifyToken.veryfyToken, Controller.DeleteItem);
mainRouter.put("/update/:id", GlobalVerifyToken.veryfyToken, Controller.UpdateDraft);
mainRouter.get("/order_list", GlobalVerifyToken.veryfyToken, Controller.OrderDetails);
mainRouter.get("/details_table/:order_id", GlobalVerifyToken.veryfyToken, Controller.ListOrders);
mainRouter.put("/finish/:order_id", GlobalVerifyToken.veryfyToken, Controller.finishOrder);

export default mainRouter;