import express, { Router } from 'express';
const router = express.Router();
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
} from '../controllers/orderController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, isAdmin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
// :routes go last to avoid route conflict
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, isAdmin, updateOrderToDelivered);
export default router;
