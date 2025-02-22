import { configureStore } from '@reduxjs/toolkit';
import wishlistSlice from '../features/wishlist/wishlistSlice';
import addToCartSlice from '../features/addToCart/addToCartSlice';
import buyingAddressSlice from '../features/productBuying/buyingAddress';

const store = configureStore({
  reducer: {
    wishlist: wishlistSlice,
    cart: addToCartSlice,  
    address: buyingAddressSlice  
  },
});

export default store;
    