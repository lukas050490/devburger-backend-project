import * as Yup from 'yup';
import Order from '../models/Schemas/Order';
import Product from '../models/Product';
import Category from '../models/Categories';


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
        const productIndex = product.findIndex((item) => item.id === product.id);
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
       };

       return response.status(201).json(order);
    }

    
    
    
}
    export default new OrderController();