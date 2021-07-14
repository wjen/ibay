import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

//@desc Create new order
//@route POST /api/orders
//@access Private
export const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  console.log('tax', taxPrice);
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

//@desc Get an order
//@route GET /api/orders/:id
//@access Private
export const getOrderById = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const order = await Order.findById(id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error(`No order with id: ${id}`);
  }
  res.json(order);
});
