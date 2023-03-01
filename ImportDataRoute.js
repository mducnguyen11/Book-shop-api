import express from 'express';
import UserModel from './models/UserModel.js';
import BookModel from './models/BookModel.js';
import CartModel from './models/CartModel.js';
import UserData from './data/users.js';
import BookData from './data/books.js';

const DataRoute = express.Router();

DataRoute.post('/user', async (req, res) => {
  await UserModel.remove();
  const carts = await CartModel.insertMany(UserData.map(() => ({ items: [], totalPrice: 0 })));

  const usersWithCartId = UserData.map((user, index) => ({
    ...user,
    cartId: carts[index]._id,
  }));
  const cc = await UserModel.insertMany(usersWithCartId);
  res.send(cc);
});

DataRoute.post('/book', async (req, res) => {
  await BookModel.remove();
  const cc = await BookModel.insertMany(BookData);
  res.send(cc);
});

export default DataRoute;
