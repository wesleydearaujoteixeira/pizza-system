import { ItemType, Order, Product, Session, User } from "../types/TypesUser";
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

    public static async categoriesServices( name: string ): Promise<any> {

        const categories = await prismaClient.category.create({
            data: {
                name,
            },
            select: {
                category_id: true,
                name: true,
            }
        });

        return categories;




    }

    public static async getCategoriesServices(): Promise<any> {

        const categories = await prismaClient.category.findMany();
        return categories;

    }

    public static async getAllProducts(): Promise<any> {


        const products = await prismaClient.product.findMany({
            select: {
                category_id: true,
                name: true,
                price: true,
                description: true,
                banner: true,
            }
        });

        return products;


    }


    public static async registerProducts( {name, price, description, banner, category_id}: Product): Promise<any> {

        const products = await prismaClient.product.create({
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

    }

    public static async getProductsByCategory(category_id: string): Promise<any>{


        try {
            
            const categoryByProduct = await prismaClient.product.findMany({
                where: {
                    category_id
                },
              
            });

            return categoryByProduct;


        } catch (error) {
            
        }
    

    }

    public static async getOrder( {table, name}: Order): Promise<any> {
            
        const order = await prismaClient.order.create({
            
            data:{
                    table,
                    name,
                },
              
            });

        return order;

    }

    public static async deleteOrderId(order_id: string): Promise<any> {


        const orderExist = await prismaClient.order.findFirst({
            where: {
                order_id
            }
        });

        if(!orderExist) {
            return;
        }
        
       const orderDelete = await prismaClient.order.delete({
         where: {
                order_id: order_id
             }
       });

        return orderDelete;
    }

    public static async getOrdersAll(): Promise<any> {
        
        const orders = await prismaClient.order.findMany();

        return orders;
    }

    public static async addItem({order_id, product_id, amount}: ItemType): Promise<any> {

        const Item = await prismaClient.item.create({
            
            data:{
                    order_id_item: order_id,
                    product_item: product_id,
                    amount,
                },
              
            });

        return Item;
        

    }


    public static async deleteItemService (item_id: string): Promise<any> {

    const itemExist = await prismaClient.item.findFirst({
        where: {
                id: item_id
            }
    });

    if(!itemExist) {
        return;
    }


    const deleteItem = await prismaClient.item.delete({
         where: {
                id: item_id
             }
       });

       return deleteItem;

    }


public static async updateDraft(id: string): Promise<any> {

    const updateDraft = await prismaClient.order.update({
        
        where: {
                order_id: id
            },

        data: {
            draft: true
        }
    });

    return updateDraft;


}

public static async orderDetailsServices (): Promise<any> {

    const orderList = await prismaClient.order.findMany({
        where: {
            draft: true,
            status: false
        },

        orderBy: {
            created_at: 'desc'
        }
    });

    return orderList;

}

public static async listOrders (order_id: string): Promise<any> {


    const orderDetails = await prismaClient.item.findMany({
        where: {
            order_id_item: order_id
        },

        include: {
            product: true,
            order: true
        }
    });

    return orderDetails;

}

public static async finishOrderServices (order_id: string): Promise<any> {
    const updateDraft = await prismaClient.order.update({
        
        where: {
                order_id,
            },

        data: {
            status: true
        }
    
    });

    return updateDraft;
}


    

}