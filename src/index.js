import React from 'react';
import ReactDOM from 'react-dom/client';

import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import ProductsListing from './pages/ProductsListing'
import ProductDetails from './pages/ProductDetails'
import WishlistManagementPage from './pages/features/wishlist/WishlistManagementPage'
import store from "./pages/app/store.js"

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />
	},
	{
		path: 'collection/:collectionName',
		element: <ProductsListing />
	},
	{
		path: '/productDetails/:collectionName/:productId',
		element: <ProductDetails />
	},
	{
		path: '/wishlist',
		element: <WishlistManagementPage />
	},
	{
		path: '*', 
		element: <div>Page Not Found</div>,
	}
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
	<Provider store={store}>
    	<RouterProvider router={router} />
	</Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
