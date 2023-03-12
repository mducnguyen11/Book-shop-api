import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js';

const getUserFromReq = async (req) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader;
    if (!token) {
      return null; // Unauthorizedr
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.id;
    const user = await UserModel.findById(userId);
    return user;
  } catch (error) {
    return null;
  }
};

export default getUserFromReq;
