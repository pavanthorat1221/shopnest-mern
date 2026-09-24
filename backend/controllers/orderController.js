const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');

const addOrderItems = async (req, res) => {
  try {
    const { items, address, paymentId } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const reservedItems = [];
    const orderItems = [];
    for (const item of items) {
      const quantity = Number(item.qty);
      if (!item.productId || !Number.isInteger(quantity) || quantity < 1) {
        await Promise.all(reservedItems.map((reserved) => Product.findByIdAndUpdate(reserved.productId, { $inc: { stock: reserved.qty } })));
        return res.status(400).json({ message: 'Each order item requires a valid product and quantity.' });
      }

      const product = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );
      if (!product) {
        await Promise.all(reservedItems.map((reserved) => Product.findByIdAndUpdate(reserved.productId, { $inc: { stock: reserved.qty } })));
        return res.status(400).json({ message: 'One or more products are out of stock or have an unavailable quantity.' });
      }
      reservedItems.push({ productId: product._id, qty: quantity });
      orderItems.push({ productId: product._id, qty: quantity, price: product.price });
    }

    const totalAmount = orderItems.reduce((total, item) => total + item.price * item.qty, 0);
    let createdOrder;
    try {
      createdOrder = await new Order({ userId: req.user._id, items: orderItems, totalAmount, address, paymentId }).save();
    } catch (error) {
      await Promise.all(reservedItems.map((reserved) => Product.findByIdAndUpdate(reserved.productId, { $inc: { stock: reserved.qty } })));
      throw error;
    }

    try {
      const message = `
        <h2>Order Confirmation</h2>
        <p>Hello ${req.user.name},</p>
        <p>Your order has been successfully placed! Order ID: <strong>${createdOrder._id}</strong></p>
        <p>Total Amount Paid: $${totalAmount.toFixed(2)}</p>
        <p>It will be shipped to: ${address.street}, ${address.city}</p>
        <p>Thank you for shopping with ShopNest!</p>
      `;

      await sendEmail({
        email: req.user.email,
        subject: 'ShopNest - Order Confirmation',
        message
      });

    } catch (emailError) {
      console.error(`Order confirmation email failed: ${emailError.message}`);
    }
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('userId', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const allowedStatuses = ['Pending', 'Shipped', 'Delivered'];
    const nextStatus = req.body.status;
    if (!allowedStatuses.includes(nextStatus)) {
      return res.status(400).json({ message: 'Invalid order status.' });
    }

    const order = await Order.findById(req.params.id).populate('userId', 'name email');
    if (order) {
      const previousStatus = order.status;
      order.status = nextStatus;
      const updatedOrder = await order.save();

      if (previousStatus !== nextStatus && order.userId?.email) {
        const message = `
          <h2>Order Status Update</h2>
          <p>Hello ${order.userId.name},</p>
          <p>Your ShopNest order <strong>${order._id}</strong> is now <strong>${nextStatus}</strong>.</p>
          <p>Thank you for shopping with ShopNest!</p>
        `;
        await sendEmail({
          email: order.userId.email,
          subject: `ShopNest - Order ${nextStatus}`,
          message
        });
      }
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addOrderItems, getMyOrders, getOrders, updateOrderStatus };
