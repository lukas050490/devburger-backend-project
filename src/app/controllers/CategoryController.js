import * as Yup from 'yup';
import category from '../models/Categories';

class CategoryController {
    async store(request, response) {
        const schema = Yup.object({
            name: Yup.string().required(),
        });
        
       try{
        schema.validateSync(request.body, {abortEarly:false});
       }catch(err){
        return response.status(400).json({error: err.error});
       }

       const {name} = request.body;

       const categoryExists = await CategoryController.findOne({
        where:{
            name,
        }
       });

       if(categoryExists){
        return response.status(400).json({error:'Category already exists.'})
       }

       const {id} = await category.create({
        name,
       });

       return response.status(201).json({id, name});
    }

    async index(request, response){
        const categories = await category.findAll();

        return response.json(categories);
    }
}
    export default new CategoryController();