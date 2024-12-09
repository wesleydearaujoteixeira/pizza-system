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
const prisma_1 = __importDefault(require("../prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class ServiceUsers {
    static registering(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, email, password }) {
            const userAlreadyExists = yield prisma_1.default.user.findFirst({
                where: {
                    email
                }
            });
            if (userAlreadyExists) {
                return;
            }
            const passwordHash = yield bcrypt_1.default.hash(password, 12);
            const user = yield prisma_1.default.user.create({
                data: {
                    name,
                    email,
                    password: passwordHash
                },
                select: {
                    user_id: true,
                    name: true,
                    email: true,
                }
            });
            const token = jsonwebtoken_1.default.sign({
                id: user.user_id,
                name: user.name,
                email: user.email
            }, process.env.SECRET_KEY);
            const userLogin = {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                token: token
            };
            return userLogin;
        });
    }
    static session(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            const user = yield prisma_1.default.user.findFirst({
                where: {
                    email
                }
            });
            if (!user) {
                return;
            }
            const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!passwordMatch) {
                return;
            }
            const token = jsonwebtoken_1.default.sign({
                id: user.user_id,
                name: user.name,
                email: user.email
            }, process.env.SECRET_KEY);
            const userLogin = {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                token: token
            };
            return userLogin;
        });
    }
    static categoriesServices(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield prisma_1.default.category.create({
                data: {
                    name,
                },
                select: {
                    category_id: true,
                    name: true,
                }
            });
            return categories;
        });
    }
    static getCategoriesServices() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield prisma_1.default.category.findMany();
            return categories;
        });
    }
    static getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield prisma_1.default.product.findMany({
                select: {
                    product_id: true,
                    name: true,
                    price: true,
                    description: true,
                    banner: true,
                }
            });
            return products;
        });
    }
    static registerProducts(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, price, description, banner, category_id }) {
            const products = yield prisma_1.default.product.create({
                data: {
                    name,
                    price,
                    description,
                    banner,
                    category_id,
                },
                select: {
                    category_id: true,
                    name: true,
                    price: true,
                    description: true,
                    banner: true,
                }
            });
            return products;
        });
    }
    static getProductsByCategory(category_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryByProduct = yield prisma_1.default.product.findMany({
                    where: {
                        category_id
                    },
                });
                return categoryByProduct;
            }
            catch (error) {
            }
        });
    }
    static getOrder(_a) {
        return __awaiter(this, arguments, void 0, function* ({ table, name }) {
            const order = yield prisma_1.default.order.create({
                data: {
                    table,
                    name,
                },
            });
            return order;
        });
    }
    static deleteOrderId(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderExist = yield prisma_1.default.order.findFirst({
                where: {
                    order_id
                }
            });
            if (!orderExist) {
                return;
            }
            const orderDelete = yield prisma_1.default.order.delete({
                where: {
                    order_id: order_id
                }
            });
            return orderDelete;
        });
    }
    static getOrdersAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield prisma_1.default.order.findMany({
                where: {
                    status: false
                },
                select: {
                    order_id: true,
                    table: true,
                    name: true,
                    status: true,
                }
            });
            return orders;
        });
    }
    static addItem(_a) {
        return __awaiter(this, arguments, void 0, function* ({ order_id, product_id, amount }) {
            const Item = yield prisma_1.default.item.create({
                data: {
                    order_id_item: order_id,
                    product_item: product_id,
                    amount,
                },
            });
            return Item;
        });
    }
    static deleteItemService(item_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemExist = yield prisma_1.default.item.findFirst({
                where: {
                    id: item_id
                }
            });
            if (!itemExist) {
                return;
            }
            const deleteItem = yield prisma_1.default.item.delete({
                where: {
                    id: item_id
                }
            });
            return deleteItem;
        });
    }
    static updateDraft(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateDraft = yield prisma_1.default.order.update({
                where: {
                    order_id: id
                },
                data: {
                    draft: true
                }
            });
            return updateDraft;
        });
    }
    static orderDetailsServices() {
        return __awaiter(this, void 0, void 0, function* () {
            const orderList = yield prisma_1.default.order.findMany({
                where: {
                    draft: true,
                    status: false
                },
                orderBy: {
                    created_at: 'desc'
                }
            });
            return orderList;
        });
    }
    static listOrders(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderDetails = yield prisma_1.default.item.findMany({
                where: {
                    order_id_item: order_id,
                },
                include: {
                    product: true,
                    order: true,
                }
            });
            return orderDetails;
        });
    }
    static finishOrderServices(order_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateDraft = yield prisma_1.default.order.update({
                where: {
                    order_id,
                },
                data: {
                    status: true
                }
            });
            return updateDraft;
        });
    }
}
exports.default = ServiceUsers;
