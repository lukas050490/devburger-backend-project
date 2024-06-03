import * as Yup from 'yup';
import Order from '../models/Schemas/Order';
import Product from '../models/Product';
import Category from '../models/Categories';
import User from '../models/User';


class OrderController {
    async store(request, response) {
        const schema = Yup.object({
            products: Yup.array()
            .required()
            .of(
                Yup.object({
                    id: Yup.number().required(),
                    quantity: Yup.number().required(),
                }),
            ),
        });
        
       try{
        schema.validateSync(request.body, {abortEarly:false});
       }catch(err){
        return response.status(400).json({error: err.error});
       }

       
       const {products} = request.body;

       const productsIds = products.map((product) => product.id);

       const findproducts = await Product.findAll({
        where: {
            id: productsIds,
        },
        include: [
            {
                model: Category,
                as: 'category',
                attributes: ['name'],
            },
        ],
       });

       const formattedProducts = findproducts.map((product) => {
        const productIndex = products.findIndex((item) => item.id === product.id);
        const newProduct = {
            id: product.id,
            name: product.name,
            category: product.category.name,
            price: product.price,
            url: product.url,
            quantity: products[productIndex].quantity,
        };
        return newProduct;
       });

       const order = {
        user:{
            id: request.userId,
            name: request.userName,
        },
        products: formattedProducts,
        status: 'Pedido realizado',
       };
       const createOrder = await Order.create(order);

       return response.status(201).json(createOrder);
    } 
    async index( request, response){
        const orders = await Order.find();

        return response.json(orders);

    }     
     async update(request, response){
    const schema = Yup.object({
        status: Yup.string().required()   
    });
    
   try{
    schema.validateSync(request.body, {abortEarly:false});
   }catch(err){
    return response.status(400).json({error: err.error});
   }

   const {admin: isAdmin} = await User.findByPk(request.userId);
   if(!isAdmin){
   return response.status(401).json();
   }

   const {id} = request.params;
   const {status} = request.body;

   try {
   await Order.updateOne({_id:id},{status});
   }catch(err){
    return response.status(400).json({error: err.message});
   }
   return response.json({message: 'Status updated sucessfully'});
}
}
    export default new OrderController();