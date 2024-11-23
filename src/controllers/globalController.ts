import { Request, Response } from "express";
import ServiceUsers from "../services/ServiceUser";


export default class Controller {

    public static async register(req: Request, res: Response): Promise<any> {
        
        try {
            
        const {name, email, password} = req.body;


        if(!name || !email || !password) {
            return res.status(400).json({
                message: "Todos os campos são obrigatórios."
            });
        }

        const user = await ServiceUsers.registering({name, email, password});

        if(user) {
            return res.status(201).json({ message: "User registered successfully!", user });
        }else {
            return res.status(400).json({ message: "email já existe." });
        }



        } catch (error) {
            return res.status(500).json({ message: " Falha no sistema! "});
        }


    }

    public static async login(req: Request, res: Response): Promise<any> {
        
        try {
            
        const {email, password} = req.body;
        
        if(!email ||!password) {
            return res.status(400).json({
                message: "Email e senha são obrigatórios!"
            });
        }

        const user = await ServiceUsers.session({email, password});

        return res.status(200).json({ message: "User logged in successfully!", user});




    }
        catch (error) {
            return res.status(500).json({ message: "Falha no sistema! "});
        }


}

}