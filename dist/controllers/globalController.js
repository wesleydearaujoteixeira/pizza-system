"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceUser_1 = __importDefault(require("../services/ServiceUser"));
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
class Controller {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                if (!name || !email || !password) {
                    return res.status(400).json({
                        message: "Todos os campos são obrigatórios."
                    });
                }
                const user = yield ServiceUser_1.default.registering({ name, email, password });
                if (user) {
                    return res.status(201).json({ message: "User registered successfully!", user });
                }
                else {
                    return res.status(400).json({ message: "email já existe." });
                }
            }
            catch (error) {
                return res.status(500).json({ message: " Falha no sistema! " });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    return res.status(400).json({
                        message: "Email e senha são obrigatórios!"
                    });
                }
                const user = yield ServiceUser_1.default.session({ email, password });
                return res.status(200).json({ message: "User logged in successfully!", user });
            }
            catch (error) {
                return res.status(500).json({ message: "Falha no sistema! " });
            }
        });
    }
    static registerCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                if (!name) {
                    return res.status(404).json({ message: "É preciso informar o nome da categoria!" });
                }
                const category = yield ServiceUser_1.default.categoriesServices(name);
                return res.status(201).json({ message: "categoria criada!", category });
            }
            catch (error) {
                return res.status(500).json({ message: "Falha na requisição! " });
            }
        });
    }
    static getCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield ServiceUser_1.default.getCategoriesServices();
                return res.status(200).json({ message: "aqui está todas as categorias!", category });
            }
            catch (error) {
                return res.status(500).json({ message: "Falha na requisição! " });
            }
        });
    }
    // Ensure this matches your file upload library
    static registerProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, price, description, category_id } = req.body;
            // Validate required fields
            if (!name || !price || !description || !category_id) {
                return res.status(400).json({ message: "Todos os campos são obrigatórios." });
            }
            // Validate if a file is uploaded
            if (!req.files || Object.keys(req.files).length === 0) {
                return res.status(400).json({ message: "Imagem é obrigatória." });
            }
            else {
                const file = req.files['banner'];
                let banner = '';
                const resultFile = yield new Promise((resolve, reject) => {
                    cloudinary_1.v2.uploader.upload_stream({ folder: "products" }, (err, result) => {
                        if (err) {
                            console.error("Error while uploading file:", err);
                            reject(err);
                            return;
                        }
                        resolve(result);
                    }).end(file.data);
                }).catch((error) => {
                    return res.status(404).json(`Failed to upload file to Cloudinary: ${error.message}`);
                });
                banner = resultFile.url;
                const product = yield ServiceUser_1.default.registerProducts({ name, price, description, banner, category_id });
                return res.status(201).json({ message: "Product registered successfully!", product });
            }
        });
    }
    static getProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield ServiceUser_1.default.getAllProducts();
                if (products.length > 0) {
                    return res.status(200).json({ message: "Todos os produtos!", products });
                }
            }
            catch (error) {
                return res.status(500).json({ message: "Falha na requisição de pegar todos os produtos! " });
            }
        });
    }
    static getProductByCategoryId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { category_id } = req.params;
                if (!category_id) {
                    return res.status(404).json({ message: "É preciso informar a categoria!" });
                }
                const categoryFilter = yield ServiceUser_1.default.getProductsByCategory(category_id);
                if (!categoryFilter) {
                    return res.status(404).json({ message: " essa categoria não existe! " });
                }
                return res.status(200).json({ message: " Aqui está as categorias filtradas por seção! ", categoryFilter });
            }
            catch (error) {
                return res.status(500).json({ message: "Falha na requisição! " });
            }
        });
    }
    static makeOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { table, name } = req.body;
                if (!table) {
                    return res.status(401).json({ message: "É preciso informar a mesa!" });
                }
                const order = yield ServiceUser_1.default.getOrder({ table, name });
                return res.status(200).json({
                    message: "Pedido feito com sucesso!",
                    order
                });
            }
            catch (error) {
                return res.status(500).json({ message: "Falha na requisição de orders! ", error });
            }
        });
    }
    static deleteOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order_id = req.query.order_id;
                const deletedOrder = yield ServiceUser_1.default.deleteOrderId(order_id);
                return res.status(200).json({ message: "Pedido deletado com sucesso!", deletedOrder });
            }
            catch (error) {
                return res.status(500).json({ message: "Falha na requisição de deletar o pedido! ", error });
            }
        });
    }
    static getOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield ServiceUser_1.default.getOrdersAll();
                return res.status(200).json({ message: "Todos os pedidos!", orders });
            }
            catch (error) {
                return res.status(500).json({ message: "Falha na requisição de listagem de pedidos! ", error });
            }
        });
    }
    static Item(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { order_id, product_id, amount } = req.body;
                if (!order_id || !product_id) {
                    return res.status(401).json({ message: "É preciso informar o id do pedido e do produto!" });
                }
                const item = yield ServiceUser_1.default.addItem({ order_id, product_id, amount });
                if (item) {
                    return res.status(201).json({ message: "Item adicionado ao pedido com sucesso!", item });
                }
            }
            catch (err) {
                return res.status(500).json({ message: "Falha na requisição de adicionar item ao pedido! ", err });
            }
        });
    }
    static DeleteItem(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleteItem = yield ServiceUser_1.default.deleteItemService(id);
                return res.status(200).json({ message: "item deleted", deleteItem });
            }
            catch (error) {
                return res.status(500).json({ message: "message", error });
            }
        });
    }
    static UpdateDraft(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updateDraft = yield ServiceUser_1.default.updateDraft(id);
                if (updateDraft) {
                    return res.status(200).json({ message: "rascunho atualizado com sucesso! ", updateDraft });
                    '';
                }
            }
            catch (error) {
                return res.status(500).json({ message: "erro na requisição de drafts", error });
            }
        });
    }
    static OrderDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield ServiceUser_1.default.orderDetailsServices();
                if (orders) {
                    return res.status(200).json({ message: "Detalhes dos pedidos!", orders });
                }
            }
            catch (error) {
                return res.status(500).json({ message: "Falha na requisição de detalhes dos pedidos! ", error });
            }
        });
    }
    static ListOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { order_id } = req.params;
                const orders = yield ServiceUser_1.default.listOrders(order_id);
                if (orders) {
                    return res.status(200).json({ message: "Pedidos específicos!", orders });
                }
            }
            catch (error) {
                return res.status(500).json({ message: "Falha na requisição de listar pedidos específicos! ", error });
            }
        });
    }
    static finishOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { order_id } = req.params;
                const order = yield ServiceUser_1.default.finishOrderServices(order_id);
                return res.status(200).json({
                    message: "Pedido finalizado com sucesso!", order
                });
            }
            catch (error) {
                return res.status(500).json({ message: "Falha na requisição de finalizar pedido! ", error });
            }
        });
    }
}
exports.default = Controller;
