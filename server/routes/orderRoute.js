import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getAllOrders, getUserOrders, placeOrderCOD, placeOrderRazorpay, updateOrderStatus } from '../controllers/orderController.js';
import authSeller from '../middlewares/authSeller.js';

const orderRouter = express.Router();

orderRouter.post('/cod', authUser, placeOrderCOD)
orderRouter.get('/user', authUser, getUserOrders)
orderRouter.get('/seller', authSeller, getAllOrders)
// Seller updates order status
orderRouter.patch('/seller/:id/status', authSeller, updateOrderStatus)
orderRouter.post('/razorpay', authUser, placeOrderRazorpay)

export default orderRouter;