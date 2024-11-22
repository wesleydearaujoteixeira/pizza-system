import { Request, Response } from "express";


export default class Controller {

    public static async exibir(req: Request, res: Response): Promise<any> {
        return res.status(201).json({ message: "Estou indo dormir " });

    }


}