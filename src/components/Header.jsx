import {NavLink} from 'react-router-dom'
import near_market_logo from '../Images/near_market_logo.svg'
import { fetchWishlist } from '../pages/features/wishlist/wishlistSlice'
import { fetchCartProduct } from '../pages/features/addToCart/addToCartSlice'
import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'

const Header = () => {

  const dispatch = useDispatch();
    const {wishlist} = useSelector(state => {
        return state.wishlist
    })

    const {cart} = useSelector(state => {
      return state.cart
    })

    useEffect(() => {
        dispatch(fetchWishlist())
    }, [dispatch])

    useEffect(() => {
      dispatch(fetchCartProduct())
    }, [dispatch])

  return (
    <>
      <header className="shadow sticky-top bg-white">
        <nav className="navbar" >
          <div className="container">
            <NavLink className="navbar-brand" to='/'>
              <img src={near_market_logo} alt="Logo" className="d-inline-block align-text-top" style={{width: '100px'}}  />
            </NavLink>
            <div className="border rounded d-inline-block py-2 px-1" style={{backgroundColor: "#eaf1ea"}}>
              <button style={{ backgroundColor: "#eaf1ea", border: "none" }} className=" px-3">
                <i className="bi bi-search"></i>
              </button>
              <input type="search" placeholder="Search for Products, Category & More" className="pe-2" style={{border: "none", width: "400px", height: "20px", outline: "none", backgroundColor: "#eaf1ea"}}/>
            </div>
            <div className='ms-2 d-inline-block'>
              <NavLink to="/wishlist" style={{textDecoration: "none", color: "black"}}>
                <i className="bi bi-heart pe-4" style={{ fontSize: "1.5rem" }}><sup className="rounded-circle px-1 text-light" style={{fontSize: "10px", backgroundColor: "red", top: "-1rem"}}>{wishlist.length}</sup></i>
              </NavLink>
              <NavLink to="/cart" style={{textDecoration: "none", color: "black"}}>
              <i className="bi bi-cart2" style={{ fontSize: "1.7rem" }}><sup className="rounded-circle px-1 text-light" style={{fontSize: "10px", backgroundColor: "red", top: "-1rem"}}>{cart.length}</sup></i>
              </NavLink>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
