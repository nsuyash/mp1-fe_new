import { configureStore } from '@reduxjs/toolkit';
import wishlistSlice from '../features/wishlist/wishlistSlice';
import addToCartSlice from '../features/addToCart/addToCartSlice';

const store = configureStore({
  reducer: {
    wishlist: wishlistSlice,
    cart: addToCartSlice,    
  },
});

export default store;
    