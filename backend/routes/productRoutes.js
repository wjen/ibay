// adds try catch for routes
import express, { Router } from 'express';
import {
  getProducts,
  getProductById,
} from '../controllers/productControllers.js';
const router = express.Router();

router.route('/').get(getProducts);

router.route('/:id').get(getProductById);

export default router;
