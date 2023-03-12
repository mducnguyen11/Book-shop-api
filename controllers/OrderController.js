import express from 'express';
import getUserFromReq from '../helper/getUserFromReq.js';
import getUserIdFromReq from '../helper/getUserIdFromReq.js';
import CartModel from '../models/CartModel.js';
import OrderModel from '../models/OrderModel.js';

const OrderController = express.Router();

OrderController.post('/create', async (req, res) => {
  console.log('API create order');
  const user = await getUserFromReq(req);
  console.log('API create order', user);
  if (!user) {
    return res.sendStatus(401);
  }
  const cart = await CartModel.findById(user.cartId);
  try {
    await CartModel.findByIdAndUpdate(
      user.cartId,
      {
        cartItems: [],
        totalPrice: 0,
      },
      { new: true },
    );
    const order = new OrderModel({
      shippingAddress: user.address,
      orderItems: cart.cartItems,
      totalPrice: cart.totalPrice,
      userId: user._id,
    });
    const xx = await order.save();
    res.json(xx);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

OrderController.post('/received', async (req, res) => {
  const user = await getUserFromReq(req);
  if (!user) {
    return res.sendStatus(401);
  }
  const order = req.body.order;
  if (order.userId !== user.id) {
    return res.sendStatus(401);
  }
  try {
    const orderData = await OrderModel.findByIdAndUpdate(
      order._id,
      {
        status: 'done',
      },
      { new: true },
    );
    res.json(orderData);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

OrderController.get('/getall', async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    if (!userId) {
      return res.sendStatus(401);
    }
    const orders = await OrderModel.find({ userId: userId }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

OrderController.get('/getone', async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    if (!userId) {
      return res.sendStatus(401);
    }
    const orderId = req.query.id;
    const orders = await OrderModel.findById(orderId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default OrderController;
