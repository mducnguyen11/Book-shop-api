import mongoose from 'mongoose';
import UserModel from './UserModel.js';

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: 'User',
    },
    orderItems: [
      {
        bookImage: {
          type: String,
          required: true,
        },
        bookName: {
          type: String,
          required: true,
        },
        bookId: { type: mongoose.Schema.Types.ObjectId, require: true, ref: 'Book' },
        qty: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    shippingAddress: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      require: true,
      default: 'delivering',
    },
  },
  {
    timestamps: true,
  },
);

OrderSchema.pre('save', async function (next) {
  if (!this.isNew) {
    return next();
  }

  try {
    const user = await UserModel.findById(this.userId);
    await user.update({
      orders: [...user.orders, this._id],
    });
    next();
  } catch (err) {
    return next(err);
  }
});

const OrderModel = mongoose.model('Order', OrderSchema);
export default OrderModel;
