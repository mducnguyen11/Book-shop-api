import express from 'express';
import UserModel from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import br from 'bcryptjs';
import CartModel from '../models/CartModel.js';
import getUserIdFromReq from '../helper/getUserIdFromReq.js';

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

AuthController.post('/register', async (req, res) => {
  console.log('Register api');
  try {
    console.log('Register api', req.body);
    const { name, username, phoneNumber, password, dateOfBirth, address } = req.body;
    // Kiểm tra xem username hoặc số điện thoại đã tồn tại chưa
    const existingUser = await UserModel.findOne({ $or: [{ username }, { phoneNumber }] });
    if (existingUser) {
      throw new Error('Username hoặc số điện thoại đã tồn tại');
    }

    // Hash mật khẩu trước khi lưu vào cơ sở dữ liệu
    const hashedPassword = br.hashSync(password);
    console.log('hashedPassword', hashedPassword);

    const cart = new CartModel();
    await cart.save();
    // Tạo người dùng mới

    const dateParts = dateOfBirth.split('/');
    const outputDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    const user = new UserModel({
      name,
      username,
      phoneNumber,
      password: hashedPassword,
      dateOfBirth: new Date(outputDate),
      address,
      cartId: cart._id,
    });

    await user.save();
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.SECRET_KEY,
    );
    // Trả về thông tin người dùng mới tạo thành công
    res.status(201).json({
      id: user._id,
      name: user.name,
      username: user.username,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      cartId: user.cartId,
      orders: user.orders,
      token,
    });
  } catch (error) {
    // Trả về lỗi nếu có
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
});

AuthController.post('/update', async (req, res) => {
  try {
    const userId = await getUserIdFromReq(req);
    if (!userId) {
      return res.status(401).json({ message: 'Token fail;' });
    }
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user information
    user.name = req.body.name || user.name;
    user.dateOfBirth = req.body.dateOfBirth || user.dateOfBirth;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.address = req.body.address || user.address;

    const updatedUser = await user.save();

    res.json({
      id: user._id,
      name: user.name,
      username: user.username,
      phoneNumber: user.phoneNumber,
      dateOfBirth: user.dateOfBirth,
      address: user.address,
      cartId: user.cartId,
      orders: user.orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default AuthController;
