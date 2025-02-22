import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { fetchCartProduct, deleteCartProduct, updateProductQuantity } from "../addToCart/addToCartSlice";
import { fetchAddress, postAddress, updateAddress, deleteAddress  } from "./buyingAddress";
import { useDispatch, useSelector } from "react-redux";
import SelectCategoryTab from "../../../components/SelectCategoryTab";
import { useLocation } from "react-router-dom";
import { Toast } from "bootstrap";

const ProductBuying = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const cartValue = queryParams.get("cartView");
    const productBuyingItem = location.state?.product

    const dispatch = useDispatch();
    const { cart } = useSelector(state => state.cart);
    const [checkoutItems, setCheckoutItem] = useState([])
    const [showAddress, setShowAddress] = useState([])
    const [selectedAddressId, setSelectedAddressId] = useState("")
    const [addNewAddressDetails, setAddNewAddressDetails] = useState(false)
    const [showEditAddress, setShowEditAddress] = useState("")
    const [name, setName] = useState("")
    const [contact, setContact] = useState("")
    const [pincode, setPincode] = useState("")
    const [locality, setLocality] = useState("")
    const [addresses, setAddresses] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [addressesType, setAddressesType] = useState("")

    const {address} = useSelector(state => state.address)

    useEffect(() => {
        dispatch(fetchCartProduct());
    }, [dispatch]);   

    useEffect(() => {
        dispatch(fetchAddress());
    }, [dispatch])

    useEffect(() => {
        setCheckoutItem([])
        if(cartValue === "true"){
            setCheckoutItem(cart)
        } else if(productBuyingItem) {
            setCheckoutItem([{ ...productBuyingItem, quantity: productBuyingItem.quantity || 1 }])
        }
    }, [cart, productBuyingItem, cartValue])

    const [cartStatus, setCartStatus] = useState("");
    const [updatedItem, setUpdatedItem] = useState(null); 

    const quantity = checkoutItems?.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
    const price = checkoutItems?.reduce((acc, curr) => acc + ((curr.mrp || 0) * (curr.quantity || 1)), 0);
    const discountPrice = checkoutItems?.reduce((acc, curr) => acc + ((curr.mrp || 0) - ((curr.mrp || 0) * (1 - (curr.discount || 0) / 100))) * (curr.quantity || 1), 0);
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
            }, 500);
        }
    };

     const handleEditAddressClick = (add) => {
        setShowEditAddress(add._id)
        setName(add.name)
        setContact(add.contactNumber)
        setPincode(add.pincode)
        setLocality(add.locality)
        setAddresses(add.address)
        setCity(add.city)
        setState(add.state)
        setAddressesType(add.addressType)
     }

     const handleUpdateAddress = (Id) => {
        const buyingAddress = {
            name: name,
            contactNumber: contact,
            pincode: pincode,
            locality: locality,
            address: addresses,
            city: city,
            state: state,
            addressType: addressesType
        }

        dispatch(updateAddress({buyingAddress: buyingAddress, addressId: Id}))
        setShowEditAddress("")
        setName("")
        setContact("")
        setPincode("")
        setLocality("")
        setAddresses("")
        setCity("")
        setState("")
        setAddressesType("")
     }

     const handleNewAddressSaveBtn = () => {
        const newAddress = {
            name: name,
            contactNumber: contact,
            pincode: pincode,
            locality: locality,
            address: addresses,
            city: city,
            state: state,
            addressType: addressesType
        }
        dispatch(postAddress(newAddress))
        setShowEditAddress("")
        setName("")
        setContact("")
        setPincode("")
        setLocality("")
        setAddresses("")
        setCity("")
        setState("")
        setAddressesType("")
     }

    return (
        <>
            <Header />
            <SelectCategoryTab />
            <main style={{ backgroundColor: "#eaf1ea", minHeight: "100vh" }}>
                <div className="px-5 py-5">
                    {checkoutItems && checkoutItems.length > 0 && (
                        <div className="row mx-5">
                            <div className="row col-md-8">
                                <div className="bg-white mb-4">
                                    <div className="pt-2 px-5 row">
                                        <div className="col-sm-1 mt-2"><span className="bg-secondary text-success bg-opacity-25 px-2 py-1">1.</span></div>
                                        <div className="col-sm-11"><p><span className="fs-6">LOGIN ✔</span> <br /><span>Suyash Nandurkar +919834143191</span></p></div>
                                    </div>
                                </div>
                                <div className={showAddress.length > 0 ? "bg-white" : "bg-primary bg-opacity-25"}>
                                    <div className="pt-3 pb-1 px-5 row">
                                        <div className="col-sm-1 mt-1"><span className="bg-secondary text-success bg-opacity-25 px-2 py-1">2.</span></div>
                                        <div className="col-sm-9 mt-1"><p><span className="fs-6">DELIVERY ADDRESS {showAddress.length > 0 && "✔"}</span></p></div>
                                        <div className="col-sm-2">
                                            {showAddress.length > 0 && <button className="btn border px-3 text-success" onClick={() => setShowAddress([])}>CHANGE</button>}
                                        </div>
                                    </div>
                                    <div>
                                        {
                                            showAddress && showAddress.length > 0 && (
                                                <div className="ms-5">
                                                    <span className="fs-6"><strong>{showAddress[0].name} <span className="ms-3 px-2 py-1 bg-secondary bg-opacity-25 rounded-1 me-3">{showAddress[0].addressType}</span> {showAddress[0].contactNumber}</strong></span><br />
                                                    <p className="fs-6">{showAddress[0].address}, {showAddress[0].city}, {showAddress[0].locality} {showAddress[0].state} - <strong>{showAddress[0].pincode}</strong></p>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                {
                                    address && address.length > 0 && showAddress.length < 1 && (
                                        <>
                                            { Array.isArray(address) && address.map((add, idx) => (
                                                <div key={add._id} className={selectedAddressId === add._id && !addNewAddressDetails ? "bg-secondary bg-opacity-25 ps-1 pt-4 pb-2" : "bg-white pt-3 ps-1"}>
                                                    {showEditAddress !== add._id ? (
                                                        <div className="row ps-5">
                                                            <div className="col-md-1">
                                                                <input
                                                                    id={`address-${idx}`}
                                                                    type="radio"
                                                                    name="selectAddressToDeliver"
                                                                    checked={selectedAddressId === add._id}
                                                                    value={add._id}
                                                                    onChange={() => {
                                                                        setSelectedAddressId(String(add._id));
                                                                        setAddNewAddressDetails(false);
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="col-md-9">
                                                                <label htmlFor={`address-${idx}`}>
                                                                    <span className="fs-6">
                                                                        <strong>
                                                                            {add.name} 
                                                                            <span className="ms-3 px-2 py-1 bg-secondary bg-opacity-25 rounded-1 me-3">
                                                                                {add.addressType}
                                                                            </span> 
                                                                            {add.contactNumber}
                                                                        </strong>
                                                                    </span>
                                                                    <p className="fs-6 pt-3">
                                                                        {add.address}, {add.city}, {add.locality}, {add.state} {add.pincode}
                                                                    </p>
                                                                </label>
                                                                {selectedAddressId === add._id && (
                                                                    <button className="btn btn-success mb-4" onClick={() => setShowAddress((prevAddresses) => [...prevAddresses, add])}>
                                                                        DELIVER HERE
                                                                    </button>
                                                                )}
                                                            </div>
                                                            {selectedAddressId === add._id && (
                                                                <div className="col-md-2">
                                                                    <p>
                                                                        <span className="hoverBtn text-primary" onClick={() => { handleEditAddressClick(add); setAddNewAddressDetails(false); }}>Edit</span>
                                                                        <span className="hoverBtn text-danger ps-2" onClick={() => { dispatch(deleteAddress(add._id)); setAddNewAddressDetails(false); }}>Delete</span>
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="ms-5">
                                                            <input type="radio" checked={true} className="mt-3" readOnly /> EDIT ADDRESS
                                                            <div className="my-3 row" style={{ width: "600px" }}>
                                                                <div className="col">
                                                                    <input type="text" className="form-control rounded-0" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                                                                </div>
                                                                <div className="col">
                                                                    <input type="text" className="form-control rounded-0" placeholder="10-digit mobile number" value={contact} onChange={(e) => setContact(e.target.value)} required />
                                                                </div>
                                                            </div>
                                                            <div className="my-4 row" style={{ width: "600px" }}>
                                                                <div className="col">
                                                                    <input type="text" className="form-control rounded-0" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
                                                                </div>
                                                                <div className="col">
                                                                    <input type="text" className="form-control rounded-0" placeholder="Locality" value={locality} onChange={(e) => setLocality(e.target.value)} required />
                                                                </div>
                                                            </div>
                                                            <div className="my-4 row" style={{ width: "600px" }}>
                                                                <div className="col">
                                                                    <textarea className="form-control rounded-0" placeholder="Address" value={addresses} onChange={(e) => setAddresses(e.target.value)} required></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="my-4 row" style={{ width: "600px" }}>
                                                                <div className="col">
                                                                    <input type="text" className="form-control rounded-0" placeholder="City/District/Town" value={city} onChange={(e) => setCity(e.target.value)} required />
                                                                </div>
                                                                <div className="col">
                                                                    <input type="text" className="form-control rounded-0" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required />
                                                                </div>
                                                            </div>
                                                            <div className="my-4 row" style={{ width: "600px" }}>
                                                                <label className="pb-2">Address Type</label>
                                                                <div className="col">
                                                                    <label htmlFor="addressTypeSelectHome">
                                                                        <input
                                                                            id="addressTypeSelectHome"
                                                                            type="radio"
                                                                            name="addressType"
                                                                            value="Home"
                                                                            checked={addressesType === "Home"}
                                                                            onChange={() => setAddressesType("Home")}
                                                                        /> Home (All day delivery)
                                                                    </label>
                                                                    <label htmlFor="addressTypeSelectWork" className="ms-4">
                                                                        <input
                                                                            id="addressTypeSelectWork"
                                                                            type="radio"
                                                                            name="addressType"
                                                                            value="Work"
                                                                            checked={addressesType === "Work"}
                                                                            onChange={() => setAddressesType("Work")}
                                                                        /> Work (Delivery between 10 AM - 5 PM)
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <button className="btn btn-success" onClick={() => handleUpdateAddress(add._id)}>SAVE AND DELIVER HERE</button>
                                                                <span className="text-primary ps-3 hoverBtn" onClick={() => setShowEditAddress("")}>CANCEL</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </>
                                    )
                                }
                                {
                                    showAddress.length < 1 && (
                                        <div className="my-3 bg-white">
                                            {
                                                addNewAddressDetails ? (
                                                    <div className="bg-secondary bg-opacity-25 my-4 py-3">
                                                        <div className="ms-5">
                                                            <input type="radio" checked={true} className="mt-3" name="selectAddressToDeliver"/> ADD A NEW ADDRESS
                                                            <div className="my-3 row" style={{width: "600px"}}>
                                                                <div className="col">
                                                                    <input type="text" className="form-control rounded-0" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                                                                </div>
                                                                <div className="col">
                                                                    <input type="text" className="form-control rounded-0" placeholder="10-digit mobile number" value={contact} onChange={(e) => setContact(e.target.value)} required />
                                                                </div>
                                                            </div>
                                                            <div className="my-4 row" style={{width: "600px"}}>
                                                                <div className="col">
                                                                    <input type="text" className="form-control rounded-0" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                                                                </div>
                                                                <div className="col">
                                                                    <input type="text" className="form-control rounded-0" placeholder="Locality" value={locality} onChange={(e) => setLocality(e.target.value)} required />
                                                                </div>
                                                            </div>
                                                            <div className="my-4 row" style={{width: "600px"}}>
                                                                <div className="col">
                                                                    <textarea className="form-control rounded-0" placeholder="Address" value={addresses} onChange={(e) => setAddresses(e.target.value)} required></textarea>
                                                                </div>
                                                            </div>
                                                            <div className="my-4 row" style={{width: "600px"}}>
                                                                <div className="col">
                                                                    <input type="text" className="form-control rounded-0" placeholder="City/District/Town" value={city} onChange={(e) => setCity(e.target.value)} required />
                                                                </div>
                                                                <div className="col">
                                                                    <input type="text" className="form-control rounded-0" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required />
                                                                </div>
                                                            </div>
                                                            <div className="my-4 row" style={{width: "600px"}}>
                                                                <label className="pb-2">Address Type</label>
                                                                <div className="col">
                                                                    <input type="radio" name="addressesTypeSelect" value="Home" onChange={(e) => setAddressesType(e.target.value)} /><span className="me-5"> Home (All day delivery)</span>
                                                                    <input type="radio" name="addressesTypeSelect" value="Work" onChange={(e) => setAddressesType(e.target.value)} /> Work (Delivery between 10 AM - 5 PM)
                                                                </div>
                                                            </div>
                                                            <div className="mb-3">
                                                                <button className="btn btn-success" onClick={() => handleNewAddressSaveBtn()}>SAVE AND DELIVER HERE</button> <span className="ps-3 text-primary hoverBtn" onClick={() => setAddNewAddressDetails(false)}>CANCLE</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : <p className="text-primary ps-4 pt-2 hoverBtn" onClick={() => {setAddNewAddressDetails(true); setShowEditAddress(""); setSelectedAddressId("")}}>+ Add a new address</p>
                                            }
                                        </div>
                                    )
                                }
                                <div className="bg-white mt-3">
                                    <div className="pt-3 pb-1 px-5 row">
                                        <div className="col-sm-1 mt-1"><span className="bg-secondary text-success bg-opacity-25 px-2 py-1">3.</span></div>
                                        <div className="col-sm-9 mt-1"><p><span className="fs-6">ORDER SUMMARY ✔</span></p></div>
                                    </div>
                                    {checkoutItems.map((item, idx) => (
                                        <div key={item._id} className="row px-5 py-3 w-100">
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
                                            {idx >= 0 && idx <= checkoutItems.length - 2 && <hr style={{ color: "gray" }} className="mt-2" />}
                                        </div>
                                    ))}
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

export default ProductBuying;