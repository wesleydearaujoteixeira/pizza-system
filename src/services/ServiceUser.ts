import { Session, User } from "../types/TypesUser";
import prismaClient from "../prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default class ServiceUsers {

    public static async registering({name, email, password}: User): Promise<any> {
        
        const userAlreadyExists = await prismaClient.user.findFirst({
            where: {
                email
            }
        });

        if(userAlreadyExists) {
            return;
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await prismaClient.user.create({
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


        const token = jwt.sign({
            id: user.user_id,
            name: user.name,
            email: user.email
        }, process.env.SECRET_KEY as string);

        const userLogin = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            token: token
        }


        return userLogin;




    }

    public static async session({email, password}: Session): Promise<any> {
               
        const user = await prismaClient.user.findFirst({
            where: {
                email
            }
        });

        if(!user) {
            return;
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(!passwordMatch) {
            return;
        }

        const token = jwt.sign({
            id: user.user_id,
            name: user.name,
            email: user.email
        }, process.env.SECRET_KEY as string);

        const userLogin = {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            token: token
        }


        return userLogin;




    }

}