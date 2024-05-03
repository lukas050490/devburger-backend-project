import { Router } from'express';
import multer from 'multer';
import multerConfig from './config/multer';
import authMiddleware from './middlewares/auth';


import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import categoryController from './app/controllers/categoryController';


const routes = new Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session',SessionController.store);

routes.use(authMiddleware);

routes.post('/products',upload.single('file'),ProductController.store);
routes.get('/products', ProductController.index);

routes.post('/categories',categoryController.store);
routes.get('/categories', categoryController.index);

export default routes;