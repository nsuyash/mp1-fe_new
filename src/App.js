import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import Header from './components/Header'
import Carousel from './components/Carousel'
import useFetch from './useFetch'
import {Link, NavLink} from 'react-router-dom'
import discount from './Images/discount.svg'
import mobileTab from './Images/mobileTab.svg'
import laptop from './Images/laptop.svg'
import tvWashingMachine from './Images/tvWasingMachine.svg'
import fashion from './Images/fashion.svg'
import furniture from './Images/furniture.svg'
import samsungLimitedOfferCard from './Images/samsungLimitedOfferCard.gif'
import redmiLimitedOfferCard from './Images/redmiLimitedOfferCard.gif'
import appleLimitedOfferCard from './Images/appleLimitedOfferCard.gif'
import asusLimitedOfferCard from './Images/asusLimitedOfferCard.gif'
import lenovoLimitedOfferCard from './Images/lenovoLimitedOfferCard.gif'
import hpLimitedOfferCard from './Images/hpLimitedOfferCard.gif'
import topSellingSmartphone from './Images/topSellingSmartphone.gif'



const BestDeals = ({data, brandName}) => {
  return (
    <>
      {
        data && data.filter(item => (item.collectionType === "mobiles&tablets" || item.collectionType === "laptops") && item.features['brand'] === brandName).slice(0,2).map((item, index) => (
          <NavLink to={`/productDetails/${item.collectionType}/${item._id}`} style={{textDecoration: 'none'}}>
            <div className='d-inline-block pb-2 pe-2' key={index}>
            <div className='card text-center' style={{width: '200px'}}>
              <img src={item.productImageUrl} className='card-img-top mt-3 px-3' alt='productImage' style={{width: "200px", height: '150px'}} />
              <div className='card-body'>
                <p className='card-text' style={{fontSize: '12px', lineHeight:1}} >{item.modelName}</p>
                <h6>From ₹{(item.mrp - (item.mrp * (item.discount / 100))).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}* <s>{(item.mrp).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</s></h6> 
              </div>
            </div>
          </div>
          </NavLink>
        ))
      }
    </>
  );
}


export default function App() {
  const {data, loading} = useFetch("https://mp1-be-git-main-suyash-nandurkars-projects.vercel.app/products")

  

  return (
    <>
      <Header />
      <br />
      {
        !loading ? <main>     
          <Carousel />
          <section className='my-5 text-center mx-3'>
            <div>
              {
                [{src: `${discount}`, route: '/'}, {src: `${mobileTab}`, route: '/collection/mobiles&tablets'}, {src: `${laptop}`, route: '/collection/laptops'}, {src: `${tvWashingMachine}`, route: '/'}, {src: `${fashion}`, route: '/'}, {src: `${furniture}`, route: '/'}].map((category, index) => (
                  <div className='d-inline-block' key={index} style={{padding: '0rem 2.1rem'}}>
                    <Link to={category.route} style={{textDecoration: 'none', color: 'black'}}>
                      <img style={{ width: "150px", height: "150px" }} className='img-fluid' src={category.src} alt='Category' />
                      <h6>{['Top Offer', 'Mobile & Tab', 'Laptops', 'Tv & Appliances', 'Fashion', 'Furniture'][index]}</h6>
                    </Link>
                  </div>
                ))
              }
            </div>
          </section>
          <section className='mb-5 mx-4'>
            <h3 className='mb-4'>Best Deals on Smartphones<span className='float-end' style={{color: "#a9c5a0"}}><i className="bi bi-arrow-right-circle-fill"></i></span></h3>
            <div>
              {
                data && (
                  <>
                    {
                      ['SAMSUNG', 'REDMI', 'Apple'].map((brand, index) => (
                        <BestDeals key={index} data={data} brandName={brand} />
                      ))
                    }
                  </>
                )
              }
            </div>
          </section>
          <section className='mx-4 mb-2'>
            {
              data && (
                <>
                  {
                    [{path: `${samsungLimitedOfferCard}`, itemId: "66caf0f9f2ca813d2f0acc5a"}, {path: `${redmiLimitedOfferCard}`, itemId: "66caf0fcf2ca813d2f0acc92"}, {path: `${appleLimitedOfferCard}`, itemId: "66caf0fef2ca813d2f0accb6"}].map((path, index) => (
                      <div className='d-inline-block px-2 pb-2' key={index}>
                        <NavLink to={`/productDetails/mobiles&tables/${path.itemId}`} style={{textDecoration: 'none'}}>
                          <img src={path.path} className='img-fluid' alt='Limited-Offers-Card' style={{width: "400px", height: '200px'}} />
                        </NavLink>
                      </div>
                    ))
                  }
                </>
              )
            }
          </section><br />
          <section className='mb-5 mx-4'>
            <h3 className='mb-4'>Best Deals on Laptops<span className='float-end' style={{color: "#a9c5a0"}}><i className="bi bi-arrow-right-circle-fill"></i></span></h3>
            <div>
              {
                data && (
                  <>
                    {
                      ['ASUS', 'HP', 'Lenovo'].map((brand, index) => (
                        <BestDeals key={index} data={data} brandName={brand} />
                      ))
                    }
                  </>
                )
              }
            </div>
          </section>
          <section className='mx-5 mb-3'>
            <div className='row'>
              {
                [`${asusLimitedOfferCard}`, `${lenovoLimitedOfferCard}`, `${hpLimitedOfferCard}`].map((path, index) => (
                  <div className='col-md-4' key={index}>
                    <img src={path} className='img-fluid' alt='Limited-Offers-Card' />
                  </div>
                ))
              }
            </div>
          </section><br />
          <section className='mx-5 mb-5'>
            <img src={topSellingSmartphone} className='rounded img-fluid' alt='Top Selling Smartphone Offer'/>
          </section>
        </main> :
        <div className='d-flex justify-content-center align-items-center bg-opacity-25 bg-white' style={{ height: '500px' }}>
            <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
            </div>
        </div>
      }
    </>
  )
}
