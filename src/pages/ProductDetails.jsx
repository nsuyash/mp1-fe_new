import { useParams } from "react-router-dom"
import Header from "../components/Header"
import SelectCategoryTab from "../components/SelectCategoryTab"
import useFetch from "../useFetch"
import { useEffect, useState } from "react"
import { postCartProduct } from "./features/addToCart/addToCartSlice"
import { useDispatch } from "react-redux"
import {Link} from "react-router-dom"
import { useNavigate } from "react-router-dom"

const ProductDetails = () => {
    const itemDetailsParams = useParams()
    const {data, loading, error} = useFetch(`https://mp1-be-git-main-suyash-nandurkars-projects.vercel.app/products/${itemDetailsParams.productId}`)
    const [imageUrl, setImageUrl] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if(data){
            setImageUrl(data.productImageUrl)
        }
    }, [data])

    const handleAddToCart = (productData) => {
        dispatch(postCartProduct(productData))
        setTimeout(() => {
            navigate("/cart")
        }, 1000)
    }

    const handleBuyingItem = (productData) => {
        dispatch(postCartProduct(productData))
        setTimeout(() => {
            navigate("/checkout/init", { state: { product: productData } })
        }, 1000)
    }

    return (
        <>
            <Header />
            <main>
                <SelectCategoryTab />
                {
                    data && !loading ? (
                    <section className="row my-4">
                        <div className="col-md-6">
                            <div className="row ms-2">
                                <div className="col-md-4">
                                    {
                                        data.productImagesUrl.map((url,idx) => (
                                            <img src={url} alt='product imgs' className="w-50 text-center border px-2 py-2 mb-2" style={{ height: '150px', objectFit: 'contain' }} onMouseEnter={() => setImageUrl(url)} />
                                        ))
                                    }
                                </div>
                                <div className="col-md-2">
                                    <img src={imageUrl} alt="product imgs" className="border py-3 px-3" style={{ width: '420px', height: "465px", objectFit: 'contain' }}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 py-3">
                            <p id='ixTEMNXAME' style={{fontSize: 25}}>{data.modelName} {data.modelSubContent}</p>
                            <p style={{fontSize: 13}}><span className='text-bold rounded text-white' style={{padding: '0.2rem 0.5rem 0.2rem 0.5rem', backgroundColor: '#388e3c'}}>{data.rating} ★</span></p>
                            <p>
                            <span style={{fontSize: 30, fontWeight: 600, color: 'black'}}>₹{(data.mrp - (data.mrp * (data.discount / 100))).toFixed(0).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")}</span>
                            <s className="px-2" style={{color: 'black'}}>₹{(data.mrp).toFixed(0).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")}</s>
                            <span className='text-success' style={{fontWeight: 500}}>{data.discount}% off</span><br /><br />
                            <span className='bg-success text-light py-1 px-2'>Saved upto ₹{(data.mrp * (data.discount / 100)).toFixed(0).toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")}</span><br />
                            </p><br />
                            <div className="d-inline">
                            <button className="btn btn-dark px-3 py-2 me-3" onClick={() => handleAddToCart(data)}>Add to Cart</button>
                            <button className="btn btn-success px-3 py-2" onClick={() => handleBuyingItem(data)}>Buy Now</button>
                            </div><br /><br /><br />
                            <div>
                                <h5>Highlights</h5>
                                <ul style={{fontSize: 14, width: "20rem"}}>
                                    {data.highlights.map((content, index) => (
                                        <li key={index} style={{color: 'lightgray', paddingTop: '0.3rem'}}><span className='text-dark'>{content}</span></li>
                                    ))}
                                </ul><br />
                                <h5>Description</h5>
                                {
                                    data.description.map((content, idx) => (
                                        <div key={idx} className="clearfix pb-3">
                                            <img src={content.imageUrl} className="col-md-6 float-md-end img-fluid"  style={{height: "270px", objectFit: "contain"}} /><br />
                                            <p style={{width: '500px'}}>{content.content}</p><br />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </section>
                    ) :
                    <div className='d-flex justify-content-center align-items-center bg-opacity-25 bg-white' style={{ height: '500px' }}>
                            <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                            </div>
                    </div>
                }
            </main>
        </>
    )
}

export default ProductDetails;