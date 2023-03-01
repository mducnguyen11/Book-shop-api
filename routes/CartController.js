import express from 'express';
import BookModel from '../models/BookModel.js';
import CartModel from '../models/CartModel.js';
import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

const CartController = express.Router();

CartController.post('/save', async (req, res) => {
  try {
    const { cartItems } = req.body;
    const token = req.headers['authorization'];
    if (!token) {
      return res.sendStatus(401); // Unauthorized
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.id;
    const user = await UserModel.findById(userId);

    let totalPrice = 0;
    const items = await Promise.all(
      cartItems.map(async ({ bookId, qty }) => {
        const book = await BookModel.findById(bookId);
        if (!book) {
          return null;
        }
        totalPrice += book.price * qty;
        return {
          bookImage: book.image,
          bookName: book.title,
          bookId: book._id,
          qty: qty,
          price: book.price,
        };
      }),
    );
    const filter = items.filter((item) => item !== null);

    if (filter.length == 0) {
      res.status(500).json({ message: 'Book error' });
    } else {
      const updatedCart = await CartModel.findByIdAndUpdate(
        user.cartId,
        {
          cartItems: filter,
          totalPrice,
        },
        { new: true },
      );
      res.status(200).json(updatedCart);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

CartController.post('/clear', async (req, res) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return res.sendStatus(401); // Unauthorized
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.id;
    const user = await UserModel.findById(userId);

    const updatedCart = await CartModel.findByIdAndUpdate(
      user.cartId,
      {
        cartItems: [],
        totalPrice: 0,
      },
      { new: true },
    );
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

CartController.get('/get', async (req, res) => {
  try {
    const token = req.headers['authorization'];
    if (!token) {
      return res.sendStatus(401); // Unauthorized
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.id;
    const user = await UserModel.findById(userId);
    const ccc = await CartModel.findById(user.cartId);
    res.status(200).json(ccc);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default CartController;
