import { useEffect } from "react"
import Header from "../../../components/Header"
import { fetchCartProduct, deleteCartProduct, updateProductQuantity} from "./addToCartSlice"
import { useDispatch, useSelector } from "react-redux"

const CartManagementPage = () => {
    const dispatch = useDispatch()
    const { cart } = useSelector(state => {
        return state.cart
    })

    useEffect(() => {
        dispatch(fetchCartProduct())
    })

    return (
        <>
            <Header />
            <main style={{backgroundColor: "#eaf1ea", minHeight:"100vh"}}>
            <div className="container py-5">
                <div className="row">
                    <div className="row col-md-7 bg-white pt-4">
                        {
                            cart?.map((item, idx) => (
                                <>
                                    <div className="col-md-5 pb-3">
                                        <img style={{ width: '165px', height: "165px", objectFit: 'contain' }} src={item.productImageUrl} className="img-fluid" />
                                    </div>
                                    <div className="col-md-7">
                                    <h6 id='ixTEMNXAME' style={{fontSize: 15}}>{item.modelName} {item.modelSubContent}</h6>
                                    <p style={{fontSize: 13}}><span className='text-bold rounded text-white' style={{padding: '0.2rem 0.5rem 0.2rem 0.5rem', backgroundColor: '#388e3c'}}>{item.rating} ★</span></p>
                                    <p>
                                        <span style={{fontSize: 25, fontWeight: 600, color: 'black'}}>₹{(item.mrp - (item.mrp * (item.discount / 100))).toFixed(0).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")}</span>
                                        <s className="px-2" style={{color: 'black'}}>₹{(item.mrp).toFixed(0).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")}</s>
                                        <span className='text-success' style={{fontWeight: 500}}>{item.discount}% off</span>
                                    </p>
                                    <p>
                                        <button className="btn btn-secondary btn-sm" onClick={() => dispatch(updateProductQuantity({cartId: item._id, quantity: item.quantity - 1}))}>-</button>
                                        <span className="px-2 py-1 mx-2 bg-light rounded">{item.quantity}</span>
                                        <button className="btn btn-secondary btn-sm" onClick={() => dispatch(updateProductQuantity({cartId: item._id, quantity: item.quantity + 1}))}>+</button>
                                    </p>
                                    </div>
                                    {
                                        idx >= 0 ? <hr style={{color: "gray"}} className="mt-2" /> : ""
                                    }
                                </>
                            ))
                        }
                    </div>
                    <div className="col-md-4">
                        <div className="ms-2 bg-white">
                            <p className="pt-2 ps-3" style={{fontWeight: "bold", color: '#878787'}}>PRICE DETAILS</p>
                            <hr />
                        </div>
                    </div>
                </div>
            </div>
            </main>
        </>
    )
}

export default CartManagementPage;