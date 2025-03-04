import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { fetchCartProduct, deleteCartProduct, deleteCartProducts, updateProductQuantity } from "../addToCart/addToCartSlice";
import { fetchAddress, postAddress, updateAddress, deleteAddress  } from "./buyingAddress";
import { useDispatch, useSelector } from "react-redux";
import SelectCategoryTab from "../../../components/SelectCategoryTab";
import { useLocation } from "react-router-dom";
import { Toast } from "bootstrap";
import thankYou from "../../../Images/thankYou.svg"

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
    const [orderConfirmation, setOrderConfirmation] = useState(false)
    const [paymentSelected, setPaymentSelected] = useState(false)
    const [orderPlaced, setOrderPlaced] = useState(false)

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
            }, 100);
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
        console.log("New Address",newAddress)
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

     const handlePlaceOrderBtn = () => {
        if(paymentSelected && showAddress && orderConfirmation){
            setOrderPlaced(true)
            dispatch(deleteCartProducts())
        } else {
            alert("Please select address, payment & order conformation method to place this order!!!")
        }
     }

    return (
        <>
            <Header />
            <SelectCategoryTab />
            <main style={{ backgroundColor: "#eaf1ea", minHeight: "100vh" }}>
                <div className="px-5 py-5">
                    {
                        orderPlaced ? 
                        <div className="bg-white">
                            <div className="continer py-3">
                                <div className="row px-3">
                                    <div className="col-12 col-md-6">
                                        <div className="d-flex pb-5">
                                            <img src={thankYou} alt="thank you" className="ps-5 pe-3" width={150} />
                                            <p><span className="text-success fs-4">Order Place for ₹{totalAmount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}!</span> <br />
                                            <small>Your {checkoutItems.length} item will be delivered soon.</small>
                                        </p>
                                        </div>
                                        <h5 className="ms-5">Delivery Address</h5>
                                        <div className="ms-5">
                                            <span className="fs-6"><strong>{showAddress[0].name} <span className="ms-3 px-2 py-1 bg-secondary bg-opacity-25 rounded-1 me-3">{showAddress[0].addressType}</span> {showAddress[0].contactNumber}</strong></span><br />
                                            <p className="fs-6">{showAddress[0].address}, {showAddress[0].city}, {showAddress[0].locality} {showAddress[0].state} - <strong>{showAddress[0].pincode}</strong></p>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-6">
                                        <div className="row px-5 py-3 w-100">
                                        {
                                            checkoutItems.map((item, idx) => (
                                                <>
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
                                                    </div>
                                                </>
                                            ))
                                        }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> :
                        checkoutItems && checkoutItems.length > 0 && !orderPlaced ? (
                            <div className="row mx-5">
                                <div className="row col-md-8 mb-3">
                                    {/* Login Details */}
                                    <div className="bg-white">
                                        <div className="pt-2 px-5 row">
                                            <div className="col-sm-1 mt-2"><span className="bg-secondary text-success bg-opacity-25 px-2 py-1">1.</span></div>
                                            <div className="col-sm-11"><p><span className="fs-6">LOGIN ✔</span> <br /><span>Suyash Nandurkar +919834143191</span></p></div>
                                        </div>
                                    </div>
                                    {/* Display Selected address with change address option */}
                                    <div className={showAddress.length > 0 ? "bg-white mt-3 pt-1" : "bg-primary bg-opacity-25 mt-3"}>
                                        <div className="pt-2 pb-1 px-5 row">    
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
                                    {/* Select Display address with edit & delete btn option */}
                                    {
                                        address && address.length > 0 && showAddress.length < 1 && (
                                            <>
                                                { Array.isArray(address) && address.map((add, idx) => (
                                                    <div
                                                        key={add._id}
                                                        className={
                                                            selectedAddressId === add._id && !addNewAddressDetails
                                                            ? "bg-secondary bg-opacity-25 p-3"
                                                            : "bg-white ps-3"
                                                        }
                                                        >
                                                        {showEditAddress !== add._id ? (
                                                            <div className="row">
                                                            <div className="col-12 col-md-1 py-3 text-center">
                                                                <input
                                                                id={`address-${idx}`}
                                                                type="radio"
                                                                name="selectAddressToDeliver"
                                                                checked={selectedAddressId === add._id}
                                                                value={add._id}
                                                                onChange={() => {
                                                                    setSelectedAddressId(String(add._id));
                                                                    setAddNewAddressDetails(false);
                                                                    setShowEditAddress("")
                                                                }}
                                                                />
                                                            </div>
                                                            <div className="col-12 col-md-9 py-3">
                                                                <label htmlFor={`address-${idx}`} className="w-100">
                                                                <span className="fs-6">
                                                                    <strong>
                                                                    {add.name}{" "}
                                                                    <span className="ms-3 px-2 py-1 bg-secondary bg-opacity-25 rounded-1 me-3">
                                                                        {add.addressType}
                                                                    </span>
                                                                    {add.contactNumber}
                                                                    </strong>
                                                                </span>
                                                                <p className="fs-6 pt-3 mb-0">
                                                                    {add.address}, {add.city}, {add.locality}, {add.state} {add.pincode}
                                                                </p>
                                                                </label>
                                                                {selectedAddressId === add._id && (
                                                                <button
                                                                    className="btn btn-success mt-3"
                                                                    onClick={() => setShowAddress((prev) => [...prev, add])}
                                                                >
                                                                    DELIVER HERE
                                                                </button>
                                                                )}
                                                            </div>
                                                            {selectedAddressId === add._id && (
                                                                <div className="col-12 col-md-2 text-md-end mt-2 mt-md-0">
                                                                <p className="mb-0">
                                                                    <span
                                                                    className="hoverBtn text-primary"
                                                                    onClick={() => {
                                                                        handleEditAddressClick(add);
                                                                        setAddNewAddressDetails(false);
                                                                    }}
                                                                    style={{ cursor: "pointer" }}
                                                                    >
                                                                    Edit
                                                                    </span>
                                                                    <span
                                                                    className="hoverBtn text-danger ps-2"
                                                                    onClick={() => {
                                                                        dispatch(deleteAddress(add._id));
                                                                        setAddNewAddressDetails(false);
                                                                    }}
                                                                    style={{ cursor: "pointer" }}
                                                                    >
                                                                    Delete
                                                                    </span>
                                                                </p>
                                                                </div>
                                                            )}
                                                            </div>
                                                        ) : (
                                                            <div className="mx-5">
                                                            <div className="mb-3">
                                                                <input type="radio" checked={true} className="mt-3 me-2" readOnly />
                                                                <span>EDIT ADDRESS</span>
                                                            </div>
                                                            <form>
                                                                <div className="row g-3">
                                                                <div className="col-12 col-md-6">
                                                                    <input
                                                                    type="text"
                                                                    className="form-control rounded-0"
                                                                    placeholder="Name"
                                                                    value={name}
                                                                    onChange={(e) => setName(e.target.value)}
                                                                    required
                                                                    />
                                                                </div>
                                                                <div className="col-12 col-md-6">
                                                                    <input
                                                                    type="text"
                                                                    className="form-control rounded-0"
                                                                    placeholder="10-digit mobile number"
                                                                    value={contact}
                                                                    onChange={(e) => setContact(e.target.value)}
                                                                    required
                                                                    />
                                                                </div>
                                                                </div>
                                                                <div className="row g-3 mt-3">
                                                                <div className="col-12 col-md-6">
                                                                    <input
                                                                    type="text"
                                                                    className="form-control rounded-0"
                                                                    placeholder="Pincode"
                                                                    value={pincode}
                                                                    onChange={(e) => setPincode(e.target.value)}
                                                                    required
                                                                    />
                                                                </div>
                                                                <div className="col-12 col-md-6">
                                                                    <input
                                                                    type="text"
                                                                    className="form-control rounded-0"
                                                                    placeholder="Locality"
                                                                    value={locality}
                                                                    onChange={(e) => setLocality(e.target.value)}
                                                                    required
                                                                    />
                                                                </div>
                                                                </div>
                                                                <div className="row g-3 mt-3">
                                                                <div className="col-12">
                                                                    <textarea
                                                                    className="form-control rounded-0"
                                                                    placeholder="Address"
                                                                    value={addresses}
                                                                    onChange={(e) => setAddresses(e.target.value)}
                                                                    required
                                                                    ></textarea>
                                                                </div>
                                                                </div>
                                                                <div className="row g-3 mt-3">
                                                                <div className="col-12 col-md-6">
                                                                    <input
                                                                    type="text"
                                                                    className="form-control rounded-0"
                                                                    placeholder="City/District/Town"
                                                                    value={city}
                                                                    onChange={(e) => setCity(e.target.value)}
                                                                    required
                                                                    />
                                                                </div>
                                                                <div className="col-12 col-md-6">
                                                                    <input
                                                                    type="text"
                                                                    className="form-control rounded-0"
                                                                    placeholder="State"
                                                                    value={state}
                                                                    onChange={(e) => setState(e.target.value)}
                                                                    required
                                                                    />
                                                                </div>
                                                                </div>
                                                                <div className="row g-3 mt-3">
                                                                <div className="col-12">
                                                                    <label className="d-block pb-2">Address Type</label>
                                                                    <div className="form-check form-check-inline">
                                                                    <input
                                                                        id="addressTypeSelectHome"
                                                                        type="radio"
                                                                        className="form-check-input"
                                                                        name="addressType"
                                                                        value="Home"
                                                                        checked={addressesType === "Home"}
                                                                        onChange={() => setAddressesType("Home")}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="addressTypeSelectHome"
                                                                    >
                                                                        Home (All day delivery)
                                                                    </label>
                                                                    </div>
                                                                    <div className="form-check form-check-inline">
                                                                    <input
                                                                        id="addressTypeSelectWork"
                                                                        type="radio"
                                                                        className="form-check-input"
                                                                        name="addressType"
                                                                        value="Work"
                                                                        checked={addressesType === "Work"}
                                                                        onChange={() => setAddressesType("Work")}
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="addressTypeSelectWork"
                                                                    >
                                                                        Work (Delivery between 10 AM - 5 PM)
                                                                    </label>
                                                                    </div>
                                                                </div>
                                                                </div>
                                                                <div className="mt-4">
                                                                <button
                                                                    className="btn btn-success"
                                                                    onClick={() => handleUpdateAddress(add._id)}
                                                                >
                                                                    SAVE AND DELIVER HERE
                                                                </button>
                                                                <span
                                                                    className="text-primary ps-3 hoverBtn"
                                                                    style={{ cursor: "pointer" }}
                                                                    onClick={() => setShowEditAddress("")}
                                                                >
                                                                    CANCEL
                                                                </span>
                                                                </div>
                                                            </form>
                                                            </div>
                                                        )}
                                                        </div>

                                                ))}
                                            </>
                                        )
                                    }
                                    {/* Add New Address Form */}
                                    {
                                        showAddress.length < 1 && (
                                            <div className="my-3 bg-white">
                                                {
                                                    addNewAddressDetails ? (
                                                        <div className="bg-secondary bg-opacity-25 my-4 py-3">
                                                            <div className="container">
                                                                <div className="mx-5">
                                                                <div className="d-flex align-items-center mb-3">
                                                                    <input
                                                                    type="radio"
                                                                    checked={true}
                                                                    className="me-2 mt-3"
                                                                    name="selectAddressToDeliver"
                                                                    />
                                                                    <span className="mt-3">ADD A NEW ADDRESS</span>
                                                                </div>
                                                                <div className="row g-3">
                                                                    <div className="col-12 col-md-6">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control rounded-0"
                                                                        placeholder="Name"
                                                                        value={name}
                                                                        onChange={(e) => setName(e.target.value)}
                                                                        required
                                                                    />
                                                                    </div>
                                                                    <div className="col-12 col-md-6">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control rounded-0"
                                                                        placeholder="10-digit mobile number"
                                                                        value={contact}
                                                                        onChange={(e) => setContact(e.target.value)}
                                                                        required
                                                                    />
                                                                    </div>
                                                                </div>
                                                                <div className="row g-3 my-4">
                                                                    <div className="col-12 col-md-6">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control rounded-0"
                                                                        placeholder="Pincode"
                                                                        value={pincode}
                                                                        onChange={(e) => setPincode(e.target.value)}
                                                                    />
                                                                    </div>
                                                                    <div className="col-12 col-md-6">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control rounded-0"
                                                                        placeholder="Locality"
                                                                        value={locality}
                                                                        onChange={(e) => setLocality(e.target.value)}
                                                                        required
                                                                    />
                                                                    </div>
                                                                </div>
                                                                <div className="row g-3 my-4">
                                                                    <div className="col-12">
                                                                    <textarea
                                                                        className="form-control rounded-0"
                                                                        placeholder="Address"
                                                                        value={addresses}
                                                                        onChange={(e) => setAddresses(e.target.value)}
                                                                        required
                                                                    ></textarea>
                                                                    </div>
                                                                </div>
                                                                <div className="row g-3 my-4">
                                                                    <div className="col-12 col-md-6">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control rounded-0"
                                                                        placeholder="City/District/Town"
                                                                        value={city}
                                                                        onChange={(e) => setCity(e.target.value)}
                                                                        required
                                                                    />
                                                                    </div>
                                                                    <div className="col-12 col-md-6">
                                                                    <input
                                                                        type="text"
                                                                        className="form-control rounded-0"
                                                                        placeholder="State"
                                                                        value={state}
                                                                        onChange={(e) => setState(e.target.value)}
                                                                        required
                                                                    />
                                                                    </div>
                                                                </div>
                                                                <div className="row g-3 my-4">
                                                                    <div className="col-12">
                                                                    <label className="pb-2 d-block">Address Type</label>
                                                                    <div>
                                                                        <div className="form-check form-check-inline">
                                                                        <input
                                                                            type="radio"
                                                                            className="form-check-input"
                                                                            name="addressesTypeSelect"
                                                                            id="homeAddress"
                                                                            value="Home"
                                                                            onChange={(e) => setAddressesType(e.target.value)}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="homeAddress">
                                                                            Home (All day delivery)
                                                                        </label>
                                                                        </div>
                                                                        <div className="form-check form-check-inline">
                                                                        <input
                                                                            type="radio"
                                                                            className="form-check-input"
                                                                            name="addressesTypeSelect"
                                                                            id="workAddress"
                                                                            value="Work"
                                                                            onChange={(e) => setAddressesType(e.target.value)}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="workAddress">
                                                                            Work (Delivery between 10 AM - 5 PM)
                                                                        </label>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                                <div className="mb-3">
                                                                    <button
                                                                    className="btn btn-success"
                                                                    onClick={() => handleNewAddressSaveBtn()}
                                                                    >
                                                                    SAVE AND DELIVER HERE
                                                                    </button>
                                                                    <span
                                                                    className="ps-3 text-primary hoverBtn"
                                                                    onClick={() => setAddNewAddressDetails(false)}
                                                                    style={{ cursor: "pointer" }}
                                                                    >
                                                                    CANCEL
                                                                    </span>
                                                                </div>
                                                                </div>
                                                            </div>
                                                            </div>
                                                    ) : <p className="text-primary ps-4 pt-2 hoverBtn" onClick={() => {setAddNewAddressDetails(true); setShowEditAddress(""); setSelectedAddressId("")}}>+ Add a new address</p>
                                                }
                                            </div>
                                        )
                                    }
                                    {/* Order Summary */}
                                    <div className="bg-white mt-3">
                                        <div className="pt-3 pb-1 px-5 row">
                                            <div className="col-sm-1 mt-1"><span className="bg-secondary text-success bg-opacity-25 px-2 py-1">3.</span></div>
                                            <div className="col-sm-9 mt-1"><p><span className="fs-6">ORDER SUMMARY {orderConfirmation && "✔" }</span></p></div>
                                            <div className="col-sm-2 mt-1">
                                                {orderConfirmation && <button className="btn border px-3 text-success" onClick={() => setOrderConfirmation(false)}>CHANGE</button>}
                                            </div>
                                        </div>
                                        {
                                            !orderConfirmation ? (
                                                checkoutItems.map((item, idx) => (
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
                                                                        cartValue ? dispatch(updateProductQuantity({ cartId: item._id, quantity: item.quantity - 1 })): checkoutItems[0].quantity--;
                                                                        setCartStatus("decrease");
                                                                        showToast(cartValue ? {...item, quantity: item.quantity - 1} : checkoutItems[0], "decrease");
                                                                    }
                                                                }}>-</button>
                                                            <span className="px-2 py-1 mx-2 bg-light rounded">{item.quantity}</span>
                                                            <button className="btn btn-secondary btn-sm"
                                                                onClick={() => {
                                                                    cartValue ? dispatch(updateProductQuantity({ cartId: item._id, quantity: item.quantity + 1 })): checkoutItems[0].quantity++;
                                                                    setCartStatus("increase");
                                                                    showToast(cartValue ? {...item, quantity: item.quantity + 1} : checkoutItems[0], "increase");
                                                            }}>+</button>
                                                        </p>
                                                        </div>
                                                        {idx >= 0 && idx <= checkoutItems.length - 2 && <hr style={{ color: "gray" }} className="mt-2" />}
                                                    </div>
                                                    ))
                                                ) : <p className="ms-5"><strong>{checkoutItems.length} ITEM</strong></p>
                                            }
                                    </div>
                                    {/* Order Confirmation */}
                                    {
                                        !orderConfirmation && (
                                        <div className="bg-white mt-3">
                                            <div className="py-2 px-5 row">
                                                <div className="col-sm-10 mt-2"><p><strong className="fs-6">Order Confirmation</strong></p></div>
                                                <div className="col-sm-2 mt-1"><button onClick={() => setOrderConfirmation(true)} className="btn btn-success px-2">CONTINUE</button></div>
                                            </div>
                                        </div>
                                        )
                                    }
                                    {/* Payment Method Only COD availabe*/}
                                    <div className="bg-white mt-3">
                                        <div className="pt-3 pb-1 px-5 row">
                                            <div className="col-sm-1 mt-1"><span className="bg-secondary text-success bg-opacity-25 px-2 py-1">4.</span></div>
                                            <div className="col-sm-9 mt-1"><p><span className="fs-6">PAYMENT METHOD</span></p></div>
                                        </div>
                                        <div className="ps-5 pb-3">
                                            <input type="radio" checked={paymentSelected === true} onChange={() => setPaymentSelected(!paymentSelected)} /> COD
                                        </div>
                                    </div>
                                </div>
                                {/* Generate Bill Section */}
                                <div className="col-md-4">
                                    <div className="bg-white">
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
                                            <div className="pb-3 text-center">
                                                <button className="btn btn-success px-5 py-1" onClick={handlePlaceOrderBtn}>PLACE ORDER</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : 
                        <div className='d-flex justify-content-center align-items-center bg-opacity-25 bg-white' style={{ height: '500px' }}>
                            <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    }
                </div>
            </main>
            {updatedItem && (
                <div className="toast-container position-fixed bottom-0 end-0 p-3">
                    <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className="toast-body row">
                            <div className="col-md-11">
                                {cartStatus === "increase" ? `✅ You've increased '${updatedItem.modelName}' quantity to '${updatedItem.quantity}'` 
                                : cartStatus === "decrease" ? `✅ You've decreased '${updatedItem.modelName}' quantity to '${updatedItem.quantity}'` 
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