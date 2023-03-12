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
    try {
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
      console.log('All item : ', items);
      const filter = items.filter((item) => item !== null);

      const updatedCart = await CartModel.findByIdAndUpdate(
        user.cartId,
        {
          cartItems: filter,
          totalPrice,
        },
        { new: true },
      );
      res.status(200).json(updatedCart);
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

CartController.post('/add', async (req, res) => {
  try {
    const { bookId, qty } = req.body;
    const token = req.headers['authorization'];
    if (!token) {
      return res.sendStatus(401); // Unauthorized
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const userId = decoded.id;
      const user = await UserModel.findById(userId);
      const book = await BookModel.findById(bookId);
      if (!book || !user) {
        console.log(book, user);
        return res.status(500).json({ message: 'Book error' });
      }
      const cartId = user.cartId;
      const currentCart = await CartModel.findById(cartId);
      const i = currentCart.cartItems.findIndex((item) => item.bookId.toString() === bookId);
      if (i > -1) {
        currentCart.cartItems[i].qty += qty;
        currentCart.totalPrice += book.price * qty;
      } else {
        currentCart.cartItems.push({
          bookImage: book.image,
          bookName: book.title,
          bookId: book._id,
          qty: qty,
          price: book.price,
        });
        currentCart.totalPrice += book.price * qty;
      }
      const updatedCart = await currentCart.save();
      res.status(200).json(updatedCart);
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: 'Unauthorized' });
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

CartController.get('/view', async (req, res) => {
  try {
    console.log('API view cart --------');
    const token = req.headers['authorization'];

    if (!token) {
      return res.sendStatus(401); // Unauthorized
    }
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const userId = decoded.id;
      const user = await UserModel.findById(userId);
      if (!user) return res.status(401).json('unauthoerize');
      const ccc = await CartModel.findById(user.cartId);
      res.status(200).json(ccc);
    } catch (err) {
      console.error(err);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default CartController;
