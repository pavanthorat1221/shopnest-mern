import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: localStorage.getItem('wishlistItems') ? JSON.parse(localStorage.getItem('wishlistItems')) : [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      if (!state.items.some((item) => item.productId === action.payload.productId)) {
        state.items.push(action.payload);
        localStorage.setItem('wishlistItems', JSON.stringify(state.items));
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.productId !== action.payload);
      localStorage.setItem('wishlistItems', JSON.stringify(state.items));
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
