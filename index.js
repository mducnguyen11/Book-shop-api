import express from 'express';
import dotenv from 'dotenv';
import conectDatabase from './config/dbconfig.js';
import DataRoute from './ImportDataRoute.js';
import BookRoute from './routes/BookController.js';
import { errorHandler } from './midleware/Error.js';
import AuthRoute from './routes/AuthController.js';
import bodyParser from 'body-parser';
import CartRoute from './routes/CartController.js';
import OrderRoute from './routes/OrderController.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

conectDatabase();

app.use('/import/', DataRoute);
app.use('/book/', BookRoute);
app.use('/auth', AuthRoute);
app.use('/cart', CartRoute);
app.use('/order', OrderRoute);

app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, console.log('Server running !! ', port));
