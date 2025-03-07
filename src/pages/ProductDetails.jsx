import { useParams } from "react-router-dom";
import Header from "../components/Header";
import SelectCategoryTab from "../components/SelectCategoryTab";
import useFetch from "../useFetch";
import { useEffect, useState } from "react";
import { postCartProduct } from "./features/addToCart/addToCartSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProductDetails = () => {
    const mySecret = process.env.REACT_APP_DATA_URL;
    const itemDetailsParams = useParams();
    const { data, loading } = useFetch(`${mySecret}/products/${itemDetailsParams.productId}`);
    const [imageUrl, setImageUrl] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (data) {
            setImageUrl(data.productImageUrl);
        }
    }, [data]);

    const handleAddToCart = (productData) => {
        dispatch(postCartProduct(productData));
        setTimeout(() => {
            navigate("/cart");
        }, 1000);
    };

    const handleBuyingItem = (productData) => {
        dispatch(postCartProduct(productData));
        setTimeout(() => {
            navigate("/checkout/init", { state: { product: productData } });
        }, 1000);
    };

    return (
        <>
            <Header />
            <SelectCategoryTab />
            <main className="py-4 px-4">
                {data && !loading ? (
                    <section className="row my-4">
                        <div className="col-lg-6 col-md-12">
                            <div className="row">
                                <div className="col-3">
                                    {data.productImagesUrl.map((url, idx) => (
                                        <img 
                                            key={idx} 
                                            src={url} 
                                            alt='product imgs' 
                                            className="w-100 border p-2 mb-2 cursor-pointer"
                                            style={{ height: '100px', objectFit: 'contain' }}
                                            onMouseEnter={() => setImageUrl(url)}
                                        />
                                    ))}
                                </div>
                                <div className="col-9">
                                    <img 
                                        src={imageUrl} 
                                        alt="product" 
                                        className="border w-100 p-3" 
                                        style={{ height: "400px", objectFit: 'contain' }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-12 py-3">
                            <h4>{data.modelName} {data.modelSubContent}</h4>
                            <p>
                                <span className='badge bg-success'>{data.rating} ★</span>
                            </p>
                            <p className="fs-4 fw-bold text-dark">
                                ₹{(data.mrp - (data.mrp * (data.discount / 100))).toLocaleString()}
                                <s className="text-muted ms-2">₹{data.mrp.toLocaleString()}</s>
                                <span className='text-success ms-2'>{data.discount}% off</span>
                            </p>
                            <p className='bg-success text-light p-2 d-inline-block rounded'>
                                Saved up to ₹{(data.mrp * (data.discount / 100)).toLocaleString()}
                            </p>
                            <div className="mt-3">
                                <button className="btn btn-dark me-2" onClick={() => handleAddToCart(data)}>Add to Cart</button>
                                <button className="btn btn-success" onClick={() => handleBuyingItem(data)}>Buy Now</button>
                            </div>
                            <div className="mt-4">
                                <h5>Highlights</h5>
                                <ul className="list-unstyled">
                                    {data.highlights.map((content, index) => (
                                        <li key={index} className="text-secondary">• {content}</li>
                                    ))}
                                </ul>
                                <h5>Description</h5>
                                {data.description.map((content, idx) => (
                                    <div key={idx} className="clearfix pb-3">
                                        <img 
                                            src={content.imageUrl} 
                                            className="img-fluid float-md-end mb-3" 
                                            alt={content.modelName} 
                                            style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }} 
                                        />
                                        <p>{content.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                ) : (
                    <div className='d-flex justify-content-center align-items-center' style={{ height: '500px' }}>
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
};

export default ProductDetails;
