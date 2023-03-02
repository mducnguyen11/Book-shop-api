import express from 'express';
import UserModel from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

const AuthController = express.Router();

AuthController.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.SECRET_KEY,
    );
    res.json({
      id: user._id,
      name: user.name,
      username: user.username,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      token: token,
      cartId: user.cartId,
      orders: user.orders,
    });
  } else {
    res.status(401);
    next();
  }
});

export default AuthController;
