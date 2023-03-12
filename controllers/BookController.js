import express from 'express';
import BookModel from '../models/BookModel.js';
import getUserFromReq from '../helper/getUserFromReq.js';

const BookController = express.Router();

BookController.post('/create', async (req, res) => {});

BookController.get('/list', async (req, res) => {
  try {
    const books = await BookModel.find({});
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

BookController.get('/search', async (req, res, next) => {
  try {
    const searchValue = req.query.value;
    const books = await BookModel.find({
      $or: [{ title: { $regex: searchValue, $options: 'i' } }, { author: { $regex: searchValue, $options: 'i' } }],
    });
    res.json(books);
  } catch (error) {
    next();
  }
});

BookController.get('/:id', async (req, res, next) => {
  try {
    const book = await BookModel.findById(req.params.id);
    res.json(book);
  } catch (error) {
    next();
  }
});

BookController.post('/comment', async (req, res) => {
  const user = await getUserFromReq(req);
  const { bookId, rating, comment } = req.body;
  if (!user) {
    return res.status(401).json({ message: 'Unahthorize' });
  }

  try {
    const book = await BookModel.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const review = { rating, userId: user._id, userName: user.name, comment };
    book.reviews.push(review);
    book.rating = (book.rating * book.numberOfReviews + rating) / (book.numberOfReviews + 1);
    book.numberOfReviews += 1;
    await book.save();

    res.status(201).json({ message: 'Review added successfully', book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default BookController;
