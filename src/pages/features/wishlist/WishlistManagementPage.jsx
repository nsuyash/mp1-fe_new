import SelectCategoryTab from "../../../components/SelectCategoryTab"
import Header from "../../../components/Header"
import { fetchWishlist, deleteWishlist } from './wishlistSlice'
import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from "react-router-dom"
import emptyWishlist from "../../../Images/emptyWishlist.svg"
import { Toast } from "bootstrap";
import {postCartProduct} from '../addToCart/addToCartSlice'

const WishlistManagementPage = () => {
    const dispatch = useDispatch();
    const wishlist = useSelector(state => {
        return state.wishlist
    })

    useEffect(() => {
        dispatch(fetchWishlist())
        const interval = setInterval(() => {
            dispatch(fetchWishlist());
        }, 1000);

        return () => clearInterval(interval);
    }, [dispatch])

    const handleDeleteWishlist = (wishlistId) => {
        dispatch(deleteWishlist(wishlistId))
    }

    useEffect(() => {
        const toastElement = document.getElementById("liveToast");
        if (toastElement) {
            new Toast(toastElement);
        }
    }, []);

    const showToast = () => {
        const toastElement = document.getElementById("liveToast");
        const toast = new Toast(toastElement);
        toast.show();
    };

    return (
        <>
            <Header />
            <SelectCategoryTab />
            <main style={{backgroundColor: "#eaf1ea", minHeight: "100vh"}}>
                <section className="container py-4">
                    <div className="row g-3">
                        <div className="col-12 col-md-4">
                            <div className="bg-white border border-white ps-3 pt-2 pb-1">
                                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg" className="d-inline-block" style={{position: 'relative', bottom: "13px"}} />
                                <p className="d-inline-block ps-3">
                                    <span>Hello,</span><br />
                                    <span className="h5">Suyash Nandurkar</span>
                                </p>
                            </div>
                        </div>
                        <div className="col-12 col-md-8 bg-white border pt-3">
                            <h5 className="ps-3">My Wishlist ({wishlist.wishlist.length})</h5>
                            <hr style={{color: "gray"}} />
                            <div>
                                {
                                    wishlist.wishlist.length <= 0 ? (
                                        <div className="bg-white" style={{minHeight: "60vh"}}>
                                            <div className="py-4 text-center">
                                                <img src={emptyWishlist} className="img-fluid w-25" />
                                                <p className="pt-3"><span className="fs-5">Your wishlist is empty!</span><br /><span><small>Add items to it now.</small></span></p>
                                                <NavLink to="/"><p className="btn btn-success px-5">Wishlist Now</p></NavLink>
                                            </div>
                                        </div>
                                    ) : wishlist.wishlist?.map((item, idx) => (
                                        <div className="mb-3 row" key={idx}>
                                            <div className="col-md-3">
                                                <NavLink to={`/productDetails/${item.collectionType}/${item._id}`} style={{textDecoration: 'none'}}>        
                                                <img style={{ width: '165px', height: "165px", objectFit: 'contain' }} src={item.productImageUrl}  />
                                                </NavLink>
                                            </div>
                                            <div className="col-md-6">
                                                <NavLink to={`/productDetails/${item.collectionType}/${item._id}`} style={{textDecoration: 'none'}}>  
                                                    <h6 id='ixTEMNXAME' style={{fontSize: 15}}>{item.modelName} {item.modelSubContent}</h6>
                                                    <p style={{fontSize: 13}}><span className='text-bold rounded text-white' style={{padding: '0.2rem 0.5rem 0.2rem 0.5rem', backgroundColor: '#388e3c'}}>{item.rating} ★</span></p>
                                                </NavLink>
                                                <button className="btn btn-dark" onClick={() => {dispatch(postCartProduct(item)); handleDeleteWishlist(item._id); showToast()}}>Move to Cart</button>
                                            </div>
                                            <div className="col-md-3">
                                                <i className="bi bi-trash-fill wishlist-del-icon" onClick={() => {handleDeleteWishlist(item._id); showToast()}}></i>
                                                <div className="toast-container position-fixed bottom-0 e   nd-0 p-3">
                                                    <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                                                        <div className="toast-body">
                                                            ✅ Item removed from wishlist!
                                                            <button type="button" className="btn-close float-end" data-bs-dismiss="toast" aria-label="Close"></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))  
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

export default WishlistManagementPage