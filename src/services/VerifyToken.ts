import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

import  dotenv from 'dotenv';
import prismaClient from "../prisma";
import { ExtendRequest } from "../types/TypesUser";

dotenv.config();

export default class GlobalVerifyToken {


    public static async veryfyToken(req: ExtendRequest, res: Response, next: NextFunction): Promise<any> {


        const authHeaders = req.headers['authorization'];

        if(!authHeaders) {
            return res.status(401).json({ error: "Token não fornecido ou inválido"});
        }

        const token = authHeaders.split(' ')[1];

        jwt.verify(
            token, 
            process.env.SECRET_KEY as string,

        async (err: any, decoded: any) => {
            if(err) {
                return res.status(401).json({ status: "Token inválido"});
            }

            const user = await prismaClient.user.findFirst({
                where: {
                    email: decoded.email,
                }
            });

            if(!user) {
                return res.status(401).json({ status: "Usuário não encontrado"});
            }

            req.email = user.email

            next();
        }
        
    );



    }


}
