import axios from "axios";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { postWishlist, deleteWishlist } from "./features/wishlist/wishlistSlice"
import { useDispatch, useSelector } from "react-redux"
import notFound from "../Images/notFound.svg"
import ScrollToTop from "../components/ScrollToTop";


const ProductSearch = () => {
  const mySecret = process.env.REACT_APP_DATA_URL;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false)
  const location = useLocation()

  const dispatch = useDispatch();
  const { wishlist } = useSelector(state => {
    return state.wishlist
  })

  const handleAddWishlistProduct = (wishlistProduct) => {
    dispatch(postWishlist(wishlistProduct)).unwrap()
  }

  useEffect(() => {
    setLoading(true)
    const fetchProducts = async () => {
      try {
        const searchParams = new URLSearchParams(location.search)
        const searchQuery = searchParams.get("search") || "";
        const query = searchQuery ? `?search=${searchQuery}` : ""; 
        const response = await axios.get(`${mySecret}/product/list${query}`);
        setProducts(response.data);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts(); 
  }, [location.search, mySecret]);

  return (
    <div>
      <ScrollToTop />
      <Header />
      <div className="container">
        {
          !loading ? (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {products.length > 0 ? (
                products.map((item, index) => (
                  <div className='row pb-2' id='itemxlist' key={index}>
                      <hr style={{ color: "gray" }} />
                      <div className='col-md-3 ps-4'>
                      <NavLink to={`/productDetails/${item.collectionType}/${item._id}`} style={{ textDecoration: 'none' }} >
                          <img style={{ width: '180px', maxHeight: '250px', objectFit: 'cover', objectPosition: 'top' }} className='img-fluid' src={item.productImageUrl} alt={index} />
                      </NavLink>
                      </div>
                      <div className='col-md-5'>
                      <NavLink to={`/productDetails/${item.collectionType}/${item._id}`} style={{ textDecoration: 'none' }} >
                          <div className='ps-3' style={{ width: "20rem" }}>
                          <h6 id='ixTEMNXAME' style={{ fontSize: 15 }}>{item.modelName} {item.modelSubContent}</h6>
                          <p style={{ fontSize: 13 }}><span className='text-bold rounded text-white' style={{ padding: '0.2rem 0.5rem 0.2rem 0.5rem', backgroundColor: '#388e3c' }}>{item.rating} ★</span></p>
                          </div>
                          <ul style={{ fontSize: 14, width: "20rem" }}>
                          {item.highlights.map((content, index) => (
                              <li key={index} style={{ color: 'lightgray', paddingTop: '0.3rem' }}><span className='text-dark'>{content}</span></li>
                          ))}
                          </ul>
                      </NavLink>
                      </div>
                      <div className='col-md-4'>
                      <p>
                          <span style={{ fontSize: 24, fontWeight: 600, lineHeight: 1, color: 'black' }}>₹{(item.mrp - (item.mrp * (item.discount / 100))).toFixed(0).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")}</span><br />
                          <s style={{ color: 'black' }}>₹{(item.mrp).toFixed(0).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")}</s> <span className='text-success' style={{ fontWeight: 500 }}>{item.discount}% off</span><br /><br />
                          <span className='bg-success text-light py-1 px-2'>Saved upto ₹{(item.mrp * (item.discount / 100)).toFixed(0).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")}</span>
                          <sup style={{ top: '-4.5rem', right: '-3rem', color: `${wishlist.some(wish => wish._id === item._id ? true : false) && wishlist.length >= 0 ? 'red' : 'lightgray'}`, cursor: 'pointer' }} onClick={() => wishlist.some((wish) => wish._id === item._id)
                          ? dispatch(deleteWishlist(item._id)).unwrap()
                          : handleAddWishlistProduct(item)}><i className="bi bi-heart-fill fs-5" ></i></sup>
                      </p>
                      </div>
                  </div>
                ))
              ) : (
                <div className="bg-white mt-5" style={{minHeight: "60vh"}}>
                  <div className="py-4 text-center">
                      <img src={notFound} alt="wishlist empty" className="img-fluid w-25" />
                      <p className="pt-3"><span className="fs-5">Search result not found!</span></p>
                  </div>
                </div>
              )}
            </div>
          ) : 
          <div className='d-flex justify-content-center align-items-center bg-opacity-25 bg-white' style={{ height: '500px' }}>
            <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
            </div>
        </div>
        }
      </div>
    </div>
  );
};

export default ProductSearch;
