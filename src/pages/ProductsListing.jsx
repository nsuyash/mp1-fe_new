import { useEffect, useState } from 'react';
import Header from '../components/Header'
import useFetch from '../useFetch'
import { useParams, useLocation, useNavigate, NavLink } from 'react-router-dom'
import SelectCategoryTab from '../components/SelectCategoryTab';
import { useDispatch, useSelector } from "react-redux"
import { fetchWishlist, postWishlist, deleteWishlist } from "./features/wishlist/wishlistSlice"



const ProductsListing = () => {
  const [category, setCategory] = useState([])
  const [selectSort, setSelectSort] = useState("popularity")
  const [chevron, setChevron] = useState([true, true, false, false, false, true])

  const { collectionName } = useParams()
  const location = useLocation();
  const navigate = useNavigate();

  const { data, loading } = useFetch(`https://mp1-be-git-main-suyash-nandurkars-projects.vercel.app/collection/${collectionName}${location.search}`)

  const dispatch = useDispatch();
  const { wishlist } = useSelector(state => {
    return state.wishlist
  })

  useEffect(() => {
    dispatch(fetchWishlist())
    const interval = setInterval(() => {
      dispatch(fetchWishlist());
    }, 1000);

    return () => clearInterval(interval);
  }, [dispatch])

  const handleAddWishlistProduct = (wishlistProduct) => {
    dispatch(postWishlist(wishlistProduct)).unwrap()
  }

  const handleCategoryFilter = (event) => {
    const { checked, value } = event.target

    if (checked) {
      setCategory((prevCategory) => [...prevCategory, value])
    } else {
      setCategory((prevCategory) => prevCategory.filter(filterCategory => filterCategory !== value))
    }
  }

  const handleSortByPrice = (selectedCategory, selectSort) => {

    let sortedArray = [];

    if (selectSort === "highToLow") {
      sortedArray = [...selectedCategory].sort((a, b) => b.mrp - a.mrp)
    } else if (selectSort === 'lowToHigh') {
      sortedArray = [...selectedCategory].sort((a, b) => a.mrp - b.mrp)
    } else {
      sortedArray = [...selectedCategory].sort((a, b) => Math.random() - 0.5)
    }

    return sortedArray;
  }

  const handleCheckboxChange = (filterKey, filterSpecification) => {
    const searchParams = new URLSearchParams(location.search)

    // Checked current filter specification is already in the URL
    const currentFilter = searchParams.get(filterKey)?.split(",") || []

    if (currentFilter.includes(filterSpecification)) {

      // Remove the filter item if it's already selected
      const updateCurrentFilters = currentFilter.filter(specification => specification !== filterSpecification)

      if (updateCurrentFilters.length > 0) {
        searchParams.set(filterKey, updateCurrentFilters.join(","));
      } else {
        searchParams.delete(filterKey)
      }

    } else {
      currentFilter.push(filterSpecification);
      searchParams.set(filterKey, currentFilter.join(","))
    }

    // Update the URL with the new query parameters
    navigate(`${location.pathname}?${searchParams.toString()}`)
  }

  const handleClearAllFilters = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.forEach((_, key) => {
      searchParams.delete(key);
    });
    navigate(`${location.pathname}`);
  }

  const handleChevrons = (index) => {
    setChevron((prev) => {
      const updatedChevron = [...prev];
      updatedChevron[index] = !updatedChevron[index]
      return updatedChevron
    })
  }

  const selectedCategory = category.length > 0 ? data?.products.filter(collection => category.includes(collection.subCollectionType)) : data?.products
  const selectedCategoryWithSort = selectSort === "popularity" ? selectedCategory : handleSortByPrice(selectedCategory, selectSort)



  return (
    <>
      <Header />
      <main style={{ backgroundColor: "#eaf1ea" }}>
        <SelectCategoryTab />
        <section>
          <div className='row pt-3 ms-1 me-3'>
            <>
              <div className='col-md-3'>
                {
                  data && data.filters && (
                    <form className='bg-white shadow-sm pt-2'>
                      <p className='mx-3 pt-1'><strong className='h5'>Filters</strong> <span onClick={handleClearAllFilters} className='float-end text-primary pt-1' style={{ fontSize: 12, cursor: 'pointer' }}><i className="bi bi-x"></i>CLEAR ALL</span></p>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "GrayText" }} className="ps-3"><i className="bi bi-chevron-left" style={{ fontSize: 11 }}></i> {collectionName}</p>
                      {
                        collectionName === "mobiles&tablets" ? <div className='ms-4'>
                          <label><input type='checkbox' onChange={handleCategoryFilter} value="mobile" /> <span style={{ fontSize: 13 }}>Mobile</span></label><br />
                          <label><input type='checkbox' onChange={handleCategoryFilter} value="tablet" /> <span style={{ fontSize: 13 }}>Tablet</span></label>
                        </div> :
                          collectionName === "tv&washingMachine" ? <div>
                            <label><input type='checkbox' onChange={handleCategoryFilter} value="tv" /> <span style={{ fontSize: 13 }}>Tv</span></label><br />
                            <label><input type='checkbox' onChange={handleCategoryFilter} value="washingMachine" /> <span style={{ fontSize: 13 }}>Washing Machine</span></label>
                          </div> :
                            collectionName === "fashion" ? <div>
                              <label><input type='checkbox' onChange={handleCategoryFilter} value="menCollection" /> <span style={{ fontSize: 13 }}>Men Collection</span></label><br />
                              <label><input type='checkbox' onChange={handleCategoryFilter} value="womenCollection" /> <span style={{ fontSize: 13 }}>Women Collection</span></label>
                            </div> :
                              collectionName === "furniture" ? <div>
                                <label><input type='checkbox' onChange={handleCategoryFilter} value="sofa" /> <span style={{ fontSize: 13 }}>Sofa</span></label><br />
                                <label><input type='checkbox' onChange={handleCategoryFilter} value="chair" /> <span style={{ fontSize: 13 }}>Chair</span></label><br />
                                <label><input type='checkbox' onChange={handleCategoryFilter} value="table" /> <span style={{ fontSize: 13 }}>Table</span></label><br />
                                <label><input type='checkbox' onChange={handleCategoryFilter} value="mattress" /> <span style={{ fontSize: 13 }}>Mattress</span></label>
                              </div> : <div className='hidden'></div>
                      }
                      <hr style={{ color: "gray" }} />
                      {
                        Object.entries(data['filters']).map(([key, value], index) => (
                          <section key={index}>
                            <div onClick={() => handleChevrons(index)} style={{ cursor: 'pointer' }}>
                              <p className="px-3" style={{ fontWeight: 500, fontSize: 14 }}>{key.split("X").join(" ").toUpperCase()} <span className='float-end me-2'>{chevron[index] ? <i className="bi bi-chevron-down"></i> : <i className="bi bi-chevron-up"></i>}</span></p>
                            </div>
                            {
                              chevron[index] && (
                                <div className='ms-4'>
                                  {
                                    value.map((specification, index) => (
                                      <div key={index} className='pb-2'>
                                        <label htmlFor={`${specification}-${key}`}><input type='checkbox' id={`${specification}-${key}`} onChange={() => handleCheckboxChange(key, specification)} checked={new URLSearchParams(location.search).get(key)?.split(',').includes(specification) || false} /> <span style={{ fontSize: 13 }}>{specification}</span></label><br />
                                      </div>
                                    ))
                                  }
                                </div>
                              )
                            }
                            <hr style={{ color: "gray" }} />
                          </section>
                        ))
                      }
                    </form>
                  )
                }
              </div>
              <div className='bg-white col-md-9'>
                {
                  loading ?
                    <div className='d-flex justify-content-center align-items-center bg-opacity-25 bg-white' style={{ height: '500px' }}>
                      <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div> :
                    selectedCategoryWithSort && selectedCategoryWithSort && selectedCategoryWithSort.length > 0 ? (
                      <>
                        <div className='py-3 ps-2'>
                          <span>{data?.products?.collectionType?.split("&").join(" & ").toUpperCase()} <small>(Showing {data && data.products.length} products)</small></span><br />
                          <label className='pe-2' style={{ fontWeight: 500, fontSize: 14 }}>Sort by:</label>
                          <label className="pe-3"><input type='radio' name="sort" value="popularity" checked={selectSort === "popularity"} onChange={(event) => setSelectSort(event.target.value)} /> <span style={{ fontSize: 14 }}>
                            Popularity</span></label>
                          <label className="pe-3"><input type='radio' name="sort" value="highToLow" checked={selectSort === "highToLow"} onChange={(event) => setSelectSort(event.target.value)} /> <span style={{ fontSize: 14 }}>Price -- High to Low</span></label>
                          <label><input type='radio' name="sort" value="lowToHigh" checked={selectSort === "lowToHigh"} onChange={(event) => setSelectSort(event.target.value)} /> <span style={{ fontSize: 14 }}>Price -- Low to High</span></label>
                        </div>
                        {
                          selectedCategoryWithSort.map((item, index) => (
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
                        }
                        <hr style={{ color: "gray" }} />
                      </>
                    ) : <div className='text-center py-5 px-5'><img src='/notFound.svg' className='img-fluid' style={{ width: 400 }} alt='Not found image.' />
                      <p className='fs-2 pt-3'>No such product found.</p></div>
                }
              </div>
            </>
          </div>
        </section>
      </main>
    </>
  )
}

export default ProductsListing;