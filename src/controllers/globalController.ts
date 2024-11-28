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

    public static async getProducts(req: Request, res: Response): Promise<any> {
        
        try {
            
            const products = await ServiceUsers.getAllProducts();

            if(products.length > 0) { 
                return res.status(200).json({ message: "Todos os produtos!", products});
            }


        } catch (error) {
            
            return res.status(500).json({ message: "Falha na requisição de pegar todos os produtos! "});
        }
    }

    public static async getProductByCategoryId(req: Request, res: Response): Promise<any> {
    
    
    try {
            
        const { category_id } = req.params;

        if(!category_id) {
            return res.status(404).json({ message: "É preciso informar a categoria!"});
        }

        const categoryFilter = await ServiceUsers.getProductsByCategory(category_id);


        if(!categoryFilter) {
            return res.status(404).json({ message: " essa categoria não existe! "});
        }


        return res.status(200).json({ message: " Aqui está as categorias filtradas por seção! ", categoryFilter});


        
    }

    catch (error) {
        return res.status(500).json({ message: "Falha na requisição! "});
    }

    }


    public static async makeOrder(req: Request, res: Response): Promise<any> {

        try {

            const {table, name} = req.body;


            if(!table) {
                return res.status(401).json({ message: "É preciso informar a mesa!"});

            }

            const order  = await ServiceUsers.getOrder({table, name});

            return res.status(200).json({
                message: "Pedido feito com sucesso!",
                order
            });

            
        } catch (error) {
            return res.status(500).json({ message: "Falha na requisição de orders! ", error});
            
        }



    }

    public static async deleteOrder(req: Request, res: Response): Promise<any> {

      try {
        
        const order_id  = req.query.order_id as string;

        const deletedOrder = await ServiceUsers.deleteOrderId(order_id);
        
        return res.status(200).json({ message: "Pedido deletado com sucesso!", deletedOrder});
    
        } catch (error) {
        
        return res.status(500).json({ message: "Falha na requisição de deletar o pedido! ", error});
            
  
            
      }

    }

    public static async getOrders (req: Request, res: Response): Promise<any> {

        try {
           
            const orders = await ServiceUsers.getOrdersAll();

            return res.status(200).json({ message: "Todos os pedidos!", orders});

        } catch (error) {
            return res.status(500).json({ message: "Falha na requisição de listagem de pedidos! ", error});
            
        }


    }

    public static async Item (req: Request, res: Response): Promise<any> {
        
        try {
            
        const { order_id, product_id, amount } = req.body;

        if(!order_id || !product_id) {
            return res.status(401).json({ message: "É preciso informar o id do pedido e do produto!"});
        }

        const item = await ServiceUsers.addItem({ order_id, product_id, amount});

        if(item) {
            return res.status(201).json({ message: "Item adicionado ao pedido com sucesso!", item});
        }




    }catch(err) {

        return res.status(500).json({ message: "Falha na requisição de adicionar item ao pedido! ", err});
    }
    
  

    }

    public static async DeleteItem(req: Request, res: Response): Promise<any> {

        try {
            
            const { id } = req.params

            const deleteItem = await ServiceUsers.deleteItemService(id);

            return res.status(200).json({ message: "item deleted", deleteItem});


        } catch (error) {
            return res.status(500).json({ message: "message", error})
        }

    }

    public static async UpdateDraft(req: Request, res: Response): Promise<any> {
        
        try {
            
            const { id } = req.params

            const updateDraft = await ServiceUsers.updateDraft(id);

            if(updateDraft) {
                return res.status(200).json({ message: "rascunho atualizado com sucesso! ", updateDraft});''
            }

        }

        catch (error) {
            return res.status(500).json({ message: "erro na requisição de drafts", error})
        }

    }

    public static async OrderDetails(req: Request, res: Response): Promise<any> {

    try {

        const orders = await ServiceUsers.orderDetailsServices();

        if(orders) {
            return res.status(200).json({ message: "Detalhes dos pedidos!", orders});
        }


        
    } catch (error) {
        
        return res.status(500).json({ message: "Falha na requisição de detalhes dos pedidos! ", error});

    }

    }

    public static async ListOrders(req: Request, res: Response): Promise<any> {
        
        try {
            
            const { order_id } = req.params


            const orders = await ServiceUsers.listOrders(order_id);


            if(orders){

                return res.status(200).json({ message: "Pedidos específicos!", orders});
            }


        }
        catch (error) {
        
        return res.status(500).json({ message: "Falha na requisição de listar pedidos específicos! ", error});
        }


    }

    public static async finishOrder (req: Request, res: Response): Promise<any> {
        
        try {
            
            const { order_id } = req.params

            const order = await ServiceUsers.finishOrderServices(order_id);

            return res.status(200).json({
            message: "Pedido finalizado com sucesso!", order});
            
        }
        catch (error) {
        
        return res.status(500).json({ message: "Falha na requisição de finalizar pedido! ", error});
        }
}

}