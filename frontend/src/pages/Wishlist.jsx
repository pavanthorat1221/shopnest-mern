import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { removeFromWishlist } from '../redux/wishlistSlice';
import '../styles/cart.css';

const Wishlist = () => {
  const items = useSelector((state) => state.wishlist.items);
  const dispatch = useDispatch();

  const moveToCart = (item) => {
    dispatch(addToCart({ ...item, qty: 1 }));
    dispatch(removeFromWishlist(item.productId));
  };

  return (
    <div className="cart-container">
      <h2>Saved for Later</h2>
      {items.length === 0 ? (
        <p>Your wishlist is empty. <Link to="/shop">Discover products</Link></p>
      ) : (
        <div className="cart-items">
          {items.map((item) => (
            <article className="cart-item" key={item.productId}>
              <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h4>{item.name}</h4>
                <p>₹{item.price}</p>
                <Link className="wishlist-link" to={`/product/${item.productId}`}>View product</Link>
                <div className="wishlist-actions">
                  <button className="btn" onClick={() => moveToCart(item)}>Move to Cart</button>
                  <button className="btn-remove" onClick={() => dispatch(removeFromWishlist(item.productId))}>Remove</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
