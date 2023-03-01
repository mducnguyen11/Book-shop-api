import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: 'User',
  },
  userName: {
    type: String,
    require: true,
  },
  comment: {
    type: String,
    required: false,
  },
});

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  publishedDate: {
    type: Date,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  numberOfReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    required: true,
  },
  reviews: [reviewSchema],
});

const BookModel = mongoose.model('Book', bookSchema);

export default BookModel;
