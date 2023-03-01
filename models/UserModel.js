import mongoose from 'mongoose';
import br from 'bcryptjs';
import CartModel from './CartModel.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      default: Date.now,
    },
    address: {
      type: String,
      required: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Cart',
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    const cart = new CartModel();
    await cart.save();
    this.cartId = cart._id;
    this.orders = [];
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.matchPassword = async function (pass) {
  return await br.compare(pass, this.password);
};

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
