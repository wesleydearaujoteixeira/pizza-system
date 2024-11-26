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

    public static async registerCategory(req: Request, res: Response): Promise<any> {


        try {

            const { name } = req.body;


            if(!name) {
                return res.status(404).json({ message: "É preciso informar o nome da categoria!"});
            }

            const category = await ServiceUsers.categoriesServices(name);

            return res.status(201).json({message: "categoria criada!", category});




        } catch (error) {
            return res.status(500).json({ message: "Falha na requisição! "});
            
        }


    }

    public static async getCategories(req: Request, res: Response): Promise<any> {


        try {

           

            const category = await ServiceUsers.getCategoriesServices();

            return res.status(200).json({message: "aqui está todas as categorias!", category});




        } catch (error) {
            return res.status(500).json({ message: "Falha na requisição! "});
            
        }


    }

    public static async registerProduct(req: Request, res: Response): Promise<any> {

        try {
            
            const { name, price, description, category_id } = req.body;
            const imagem = req.file?.filename as string;

            if(!name ||!price ||!description || !category_id) {
                return res.status(400).json({ message: "Todos os campos são obrigatórios."});
            }

            if(!imagem) {
                return res.status(400).json({ message: "Imagem é obrigatória."});
            }

            let banner = imagem;

            const product = await ServiceUsers.registerProducts({name, price, description, banner, category_id});

            return res.status(201).json({ message: "Product registered successfully!", product });



        } catch (error) {
            
        }

    }


}