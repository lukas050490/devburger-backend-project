import { Router } from'express';
import multer from 'multer';
import multerConfig from './config/multer';
import authMiddleware from './middlewares/auth';


import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import categoryController from './app/controllers/categoryController';
import OrderController from './app/controllers/OrderController';


const routes = new Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session',SessionController.store);

routes.use(authMiddleware);

routes.post('/products',upload.single('file'),ProductController.store);
routes.get('/products', ProductController.index);
routes.put('/products/:id',upload.single('file'),ProductController.update);

routes.post('/categories',upload.single('file'),categoryController.store);
routes.get('/categories', categoryController.index);
routes.put('/categories/:id',upload.single('file'),categoryController.update); 

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);

export default routes;