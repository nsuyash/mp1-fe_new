import SelectCategoryTab from "../../../components/SelectCategoryTab"
import Header from "../../../components/Header"
import { fetchWishlist, deleteWishlist } from './wishlistSlice'
import { useEffect } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from "react-router-dom"

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

    return (
        <>
            <Header />
            <SelectCategoryTab />
            <main style={{backgroundColor: "#eaf1ea", minHeight: "100vh"}}>
                <section className="container py-4">
                    <div className="row">
                        <div className="col-md-4" style={{width: "350px"}}>
                            <div className="bg-white border border-white ps-3 pt-2 pb-1">
                                <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg" className="d-inline-block" style={{position: 'relative', bottom: "13px"}} />
                                <p className="d-inline-block ps-3">
                                    <span>Hello,</span><br />
                                    <span className="h5">Suyash Nandurkar</span>
                                </p>
                            </div>

                        </div>
                        <div className="col-md-8 bg-white border pt-3">
                            <h5 className="ps-3">My Wishlist ({wishlist.wishlist.length})</h5>
                            <hr style={{color: "gray"}} />
                            <div>
                                {
                                    wishlist.wishlist.length <= 0 ? (
                                        <div>
                                            <p className="ps-2">No product in your wishlist.</p>
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
                                            </div>
                                            <div className="col-md-3">
                                                <i className="bi bi-trash-fill wishlist-del-icon" onClick={() => handleDeleteWishlist(item._id)}></i>
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