const Product = require('../models/Product');
const Review = require('../models/Review');

const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load reviews.' });
  }
};

const createProductReview = async (req, res) => {
  try {
    const rating = Number(req.body.rating);
    const comment = req.body.comment?.trim();
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: 'Product not found.' });
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !comment) {
      return res.status(400).json({ message: 'Provide a rating from 1 to 5 and a review comment.' });
    }

    const existingReview = await Review.findOne({ productId: product._id, userId: req.user._id });
    if (existingReview) return res.status(409).json({ message: 'You have already reviewed this product.' });

    const review = await Review.create({
      productId: product._id,
      userId: req.user._id,
      name: req.user.name,
      rating,
      comment
    });

    const summary = await Review.aggregate([
      { $match: { productId: product._id } },
      { $group: { _id: '$productId', averageRating: { $avg: '$rating' }, reviewCount: { $sum: 1 } } }
    ]);
    product.ratings = Number(summary[0].averageRating.toFixed(1));
    product.numReviews = summary[0].reviewCount;
    await product.save();

    res.status(201).json({ review, ratings: product.ratings, numReviews: product.numReviews });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'You have already reviewed this product.' });
    res.status(500).json({ message: 'Unable to submit your review.' });
  }
};

module.exports = { getProductReviews, createProductReview };
