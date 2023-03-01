import express from 'express';
import jwt from 'jsonwebtoken';
import CartModel from '../models/CartModel.js';
import OrderModel from '../models/OrderModel.js';
import UserModel from '../models/UserModel.js';

const OrderController = express.Router();

OrderController.post('/create', async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader;
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  const decoded = jwt.verify(token, process.env.SECRET_KEY);
  const userId = decoded.id;
  const user = await UserModel.findById(userId);
  const cart = await CartModel.findById(user.cartId);
  try {
    if (cart.totalPrice == 0) {
      return res.status(500).json({ message: 'Empty cart' });
    }
    const order = new OrderModel({
      shippingAddress: user.address,
      orderItems: cart.cartItems,
      totalPrice: cart.totalPrice,
      userId: user._id,
    });
    const xx = await order.save();
    await CartModel.findByIdAndUpdate(
      user.cartId,
      {
        cartItems: [],
        totalPrice: 0,
      },
      { new: true },
    );
    res.json(xx);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default OrderController;
