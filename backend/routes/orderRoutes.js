import express, { Router } from 'express';
const router = express.Router();
import { addOrderItems, getOrderById } from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems);
// :routes go last to avoid route conflict
router.route('/:id').get(protect, getOrderById);
export default router;
