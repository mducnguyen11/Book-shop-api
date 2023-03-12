import jwt from 'jsonwebtoken';

const getUserIdFromReq = async (req) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader;
    if (!token) {
      return null; // Unauthorized
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.id;
    return userId;
  } catch (error) {
    return null;
  }
};

export default getUserIdFromReq;
