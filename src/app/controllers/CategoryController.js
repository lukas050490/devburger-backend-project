import * as Yup from 'yup';
import category from '../models/Categories';
import User from '../models/User';
import Categories from '../models/Categories';


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

       const {admin: isAdmin} = await User.findByPk(request.userId);
       if(!isAdmin){
       return response.status(401).json();
       }

       const {filename: path} = request.file;
       const {name} = request.body;

       const categoryExists = await CategoryController.findOne({
        where:{
            name,
            path,
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

    async update(request, response) {
        const schema = Yup.object({
            name: Yup.string(),
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

       const categoryExists = await Categories.findByPk(id);

       if(!categoryExists){
        return response
        .status(401)
        .json({message: 'Make sure your category ID is correct.'});
        
       }

       let path;
       if(request.file){
        path = request.file.filename;
       }
       
       const {name} = request.body;
       
       if(name){
       const categoryNameExists = await Categories.findOne({
        where:{
            name,
        }
       });

       if(categoryNameExists && categoryNameExists.id !== +id){
        return response.status(400).json({error:'Category already exists.'})
       }
    }

       await Categories.update({
        name,
        path,
       },{
        where:{
            id,
        }
       });

       return response.status(200).json();
    }

    async index(request, response){
        const categories = await category.findAll();

        return response.json(categories);
    }
}
    export default new CategoryController();