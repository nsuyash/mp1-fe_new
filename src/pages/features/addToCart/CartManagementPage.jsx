import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { fetchCartProduct, deleteCartProduct, updateProductQuantity } from "./addToCartSlice";
import { useDispatch, useSelector } from "react-redux";
import SelectCategoryTab from "../../../components/SelectCategoryTab";
import emptyCart from "../../../Images/emptyCart.svg";
import { Link } from "react-router-dom";
import { Toast } from "bootstrap";

const CartManagementPage = () => {
    const dispatch = useDispatch();
    const { cart } = useSelector(state => state.cart);
    
    useEffect(() => {
        dispatch(fetchCartProduct());
    }, [dispatch]);   

    const [cartStatus, setCartStatus] = useState("");
    const [updatedItem, setUpdatedItem] = useState(null); 

    const quantity = Array.isArray(cart) ? cart.reduce((acc, curr) => acc + curr.quantity, 0) : 0;
    const price = Array.isArray(cart) ? cart.reduce((acc, curr) => acc + curr.mrp * curr.quantity, 0) : 0;
    const discountPrice = Array.isArray(cart)
  ? cart.reduce((acc, curr) => acc + (curr.mrp - (curr.mrp * (1 - curr.discount / 100))) * curr.quantity, 0)
  : 0;

    const totalAmount = price >= 500 ? price - discountPrice : price - discountPrice + 100;

    useEffect(() => {
        const toastElement = document.getElementById("liveToast");
        if (toastElement) {
            new Toast(toastElement);
        }
    }, []);

    const showToast = (item, status) => {
        setUpdatedItem({ ...item, status });
        const toastElement = document.getElementById("liveToast");
        if (toastElement) {
            const toast = new Toast(toastElement);
            setTimeout(() => {
                toast.show();
            }, 100);
        }
    };

    return (
        <>
            <Header />
            <SelectCategoryTab />
            <main style={{ backgroundColor: "#eaf1ea", minHeight: "100vh" }}>
                <div className="px-5 py-5">
                    {cart && cart.length > 0 ? (
                        <div className="row mx-5">
                            <div className="row col-md-8 bg-white pt-4">
                                {cart.map((item, idx) => (
                                    <div key={item._id} className="row w-100">
                                        <div className="col-md-4 pb-3">
                                            <img
                                                style={{ width: '165px', height: "165px", objectFit: 'contain' }}
                                                src={item.productImageUrl}
                                                className="img-fluid"
                                                alt="Product"
                                            />
                                        </div>
                                        <div className="col-md-8">
                                            <h6 style={{ fontSize: 15 }}>{item.modelName} {item.modelSubContent}</h6>
                                            <p style={{ fontSize: 13 }}>
                                                <span className='text-bold rounded text-white' 
                                                    style={{ padding: '0.2rem 0.5rem', backgroundColor: '#388e3c' }}>
                                                    {item.rating} ★
                                                </span>
                                            </p>
                                            <p>
                                                <span style={{ fontSize: 25, fontWeight: 600, color: 'black' }}>
                                                    ₹{(item.mrp - (item.mrp * (item.discount / 100))).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                </span>
                                                <s className="px-2" style={{ color: 'black' }}>
                                                    ₹{(item.mrp).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                </s>
                                                <span className='text-success' style={{ fontWeight: 500 }}>{item.discount}% off</span>
                                            </p>
                                            <p>
                                                <button className="btn btn-secondary btn-sm"
                                                    onClick={() => {
                                                        if (item.quantity <= 1) {
                                                            dispatch(deleteCartProduct(item._id));
                                                            setCartStatus("removed");
                                                            showToast(item, "removed");
                                                        } else {
                                                            dispatch(updateProductQuantity({ cartId: item._id, quantity: item.quantity - 1 }));
                                                            setCartStatus("decrease");
                                                            showToast(item, "decrease");
                                                        }
                                                    }}>-</button>
                                                <span className="px-2 py-1 mx-2 bg-light rounded">{item.quantity}</span>
                                                <button className="btn btn-secondary btn-sm"
                                                    onClick={() => {
                                                        dispatch(updateProductQuantity({ cartId: item._id, quantity: item.quantity + 1 }));
                                                        setCartStatus("increase");
                                                        showToast(item, "increase");
                                                    }}>+</button>
                                            </p>
                                        </div>
                                        {idx >= 0 && <hr style={{ color: "gray" }} className="mt-2" />}
                                    </div>
                                ))}
                                <div className="pt-2 pb-4">
                                    <div>
                                        <Link to="/checkout/init?cartView=true"><p className="btn btn-success btn-opacity-50 float-end fs-5 px-5 py-2">Place Order</p></Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="ms-3 bg-white">
                                    <p className="pt-3 ps-4" style={{ fontWeight: "bold", color: '#878787' }}>PRICE DETAILS</p>
                                    <hr />
                                    <div className="col mx-4">
                                        <p className="h6 pb-3">Price ({quantity} item) <span className="float-end">₹{price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                                        <p className="h6 pb-3">Discount <span className="float-end text-success">- ₹{discountPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                                        <p className="h6 pb-2">Delivery Charges {price >= 500 ? <span className="float-end"><s>₹100</s><span className="text-success"> Free</span></span> : <span className="float-end">₹100</span>}</p>
                                        <hr className="dotted-line" />
                                        <p className="h5">Total Amount<span className="float-end">₹{totalAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                                        <hr className="dotted-line" />
                                        <p className="text-success h6 pb-4">You will save ₹{(price > 500 ? discountPrice - 100 : discountPrice).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} on this order</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white" style={{ minHeight: "60vh" }}>
                            <div className="py-4 text-center">
                                <img src={emptyCart} className="img-fluid w-25" alt="Empty Cart" />
                                <p className="pt-3"><span className="fs-5">Your cart is empty!</span><br /><span><small>Add items to it now.</small></span></p>
                                <Link to="/"><p className="btn btn-success px-5">Shop Now</p></Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            {updatedItem && (
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-body row">
                            <div className="col-md-11">
                                {cartStatus === "increase" ? `✅ You've increased '${updatedItem.modelName}' quantity to '${updatedItem.quantity + 1}'` 
                                : cartStatus === "decrease" ? `✅ You've decreased '${updatedItem.modelName}' quantity to '${updatedItem.quantity - 1}'` 
                                : `Successfully removed '${updatedItem.modelName}' from your cart`}
                            </div>
                            <button type="button" className="btn-close float-end" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CartManagementPage;
