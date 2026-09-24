import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/wishlistSlice';
import { AuthContext } from '../context/AuthContext';
import '../styles/product.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewError, setReviewError] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: '5', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const [productRes, reviewsRes] = await Promise.all([
          fetch(`/api/products/${id}`),
          fetch(`/api/products/${id}/reviews`)
        ]);
        if (!productRes.ok) throw new Error('Product not found');
        setProduct(await productRes.json());
        setReviews(reviewsRes.ok ? await reviewsRes.json() : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        productId: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
        qty: 1
      }));
      alert('Successfully added to your cart!');
    }
  };

  const isWishlisted = product && wishlistItems.some((item) => item.productId === product._id);

  const handleWishlist = () => {
    if (!product) return;
    if (isWishlisted) {
      dispatch(removeFromWishlist(product._id));
      return;
    }
    dispatch(addToWishlist({
      productId: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
    }));
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    if (!user) return;

    setSubmittingReview(true);
    setReviewError('');
    try {
      const response = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify(reviewForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Unable to submit review.');

      setReviews((currentReviews) => [data.review, ...currentReviews]);
      setProduct((currentProduct) => ({ ...currentProduct, ratings: data.ratings, numReviews: data.numReviews }));
      setReviewForm({ rating: '5', comment: '' });
    } catch (error) {
      setReviewError(error.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', margin: '100px', color: '#f97316' }}>Loading Product...</div>;
  if (!product) return <div style={{ textAlign: 'center', margin: '100px', color: '#ef4444' }}>Product Not Found</div>;

  return (
    <div className="product-detail-wrapper" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      
      {/* Breadcrumb Navigation */}
      <div style={{ color: '#a1a1aa', marginBottom: '20px', fontSize: '0.95rem' }}>
        <Link to="/" style={{ color: '#f97316' }}>Home</Link> / <Link to="/shop" style={{ color: '#f97316' }}>Shop</Link> / {product.category} / <span style={{ color: '#fff' }}>{product.name}</span>
      </div>

      <div className="product-detail">
        {/* Left Side: Image */}
        <div className="detail-image-container">
          <img src={product.imageUrl} alt={product.name} className="detail-image" />
        </div>

        {/* Right Side: Information Block */}
        <div className="detail-info">
          
          <h2 style={{ fontSize: '2.8rem', marginBottom: '10px' }}>{product.name}</h2>

          <p className="detail-price" style={{ fontSize: '2.5rem', margin: '15px 0' }}>₹{product.price.toFixed(2)}</p>

          <p className="rating-summary">★ {product.ratings.toFixed(1)} · {product.numReviews} review{product.numReviews === 1 ? '' : 's'}</p>

          {/* Description */}
          <div style={{ marginBottom: '25px' }}>
            <h4 style={{ color: '#fff', marginBottom: '10px' }}>Product Description</h4>
            <p style={{ color: '#a1a1aa', lineHeight: '1.8' }}>{product.description}</p>
          </div>

          {/* Cart & Stock Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={handleAddToCart} className="btn" style={{ flexGrow: '1', padding: '18px', fontSize: '1.2rem' }}>
              Add to Shopping Cart
            </button>
            <button onClick={handleWishlist} className="wishlist-toggle" aria-pressed={isWishlisted}>
              {isWishlisted ? '♥ Saved' : '♡ Save for Later'}
            </button>
          </div>
          
          <p style={{ marginTop: '20px', color: product.stock > 0 ? '#10b981' : '#ef4444', fontWeight: '600' }}>
            {product.stock > 0 ? `● In Stock (${product.stock} units available)` : `● Temporarily Out of Stock`}
          </p>

        </div>
      </div>

      <section className="reviews-section">
        <div>
          <h3>Customer Reviews</h3>
          <p className="rating-summary">★ {product.ratings.toFixed(1)} average from {product.numReviews} review{product.numReviews === 1 ? '' : 's'}</p>
        </div>

        {user ? (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <h4>Write a review</h4>
            <label htmlFor="rating">Rating</label>
            <select id="rating" value={reviewForm.rating} onChange={(event) => setReviewForm({ ...reviewForm, rating: event.target.value })}>
              {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} star{value === 1 ? '' : 's'}</option>)}
            </select>
            <label htmlFor="comment">Your review</label>
            <textarea id="comment" value={reviewForm.comment} maxLength="500" required onChange={(event) => setReviewForm({ ...reviewForm, comment: event.target.value })} placeholder="Share your experience with this product..." />
            {reviewError && <p className="review-error">{reviewError}</p>}
            <button className="btn" type="submit" disabled={submittingReview}>{submittingReview ? 'Submitting...' : 'Submit Review'}</button>
          </form>
        ) : (
          <p className="review-login"><Link to="/login">Log in</Link> to write a review.</p>
        )}

        <div className="review-list">
          {reviews.length === 0 ? <p className="status-message">No reviews yet. Be the first to share feedback.</p> : reviews.map((review) => (
            <article className="review-card" key={review._id}>
              <div className="review-card-header"><strong>{review.name}</strong><span>★ {review.rating}/5</span></div>
              <p>{review.comment}</p>
              <small>{new Date(review.createdAt).toLocaleDateString()}</small>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
