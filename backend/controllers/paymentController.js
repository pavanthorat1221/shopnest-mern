const Razorpay = require('razorpay');
const crypto = require('crypto');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty.' });
    }
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ message: 'Razorpay is not configured on the server.' });
    }

    let totalAmount = 0;
    for (const item of items) {
      const quantity = Number(item.qty);
      if (!item.productId || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ message: 'Your cart contains an invalid item.' });
      }
      const product = await Product.findById(item.productId);
      if (!product || product.stock < quantity) {
        return res.status(400).json({ message: 'A product in your cart is unavailable in the requested quantity.' });
      }
      totalAmount += product.price * quantity;
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    
    const options = {
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `shopnest_${Date.now()}`,
      notes: { userId: req.user._id.toString() }
    };
    
    const order = await instance.orders.create(options);
    if (!order) return res.status(500).json({ message: 'Unable to create a Razorpay order.' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.error?.description || error.message || 'Unable to initialize payment.' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Incomplete payment verification data.' });
    }
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: 'Unable to verify payment.' });
  }
};

module.exports = { createOrder, verifyPayment };
