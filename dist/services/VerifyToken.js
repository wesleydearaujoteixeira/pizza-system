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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const prisma_1 = __importDefault(require("../prisma"));
dotenv_1.default.config();
class GlobalVerifyToken {
    static veryfyToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authHeaders = req.headers['authorization'];
            if (!authHeaders) {
                return res.status(401).json({ error: "Token não fornecido ou inválido" });
            }
            const token = authHeaders.split(' ')[1];
            jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY, (err, decoded) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return res.status(401).json({ status: "Token inválido" });
                }
                const user = yield prisma_1.default.user.findFirst({
                    where: {
                        email: decoded.email,
                    }
                });
                if (!user) {
                    return res.status(401).json({ status: "Usuário não encontrado" });
                }
                req.email = user.email;
                next();
            }));
        });
    }
}
exports.default = GlobalVerifyToken;
