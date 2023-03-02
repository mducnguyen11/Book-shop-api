import express from 'express';
import BookModel from '../models/BookModel.js';

const BookController = express.Router();

BookController.post('/create', async (req, res) => {});

BookController.get('/:id', async (req, res, next) => {
  try {
    const book = await BookModel.findById(req.params.id);
    res.json(book);
  } catch (error) {
    next();
  }
});

BookController.get('/', async (req, res) => {
  try {
    const books = await BookModel.find({});
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default BookController;
