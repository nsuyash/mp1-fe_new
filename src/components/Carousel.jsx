import carouselOne from '../Images/carouselOne.svg'
import carouselTwo from '../Images/carouselTwo.svg'
import carouselThree from '../Images/carouselThree.svg'
import carouselFour from '../Images/carouselFour.svg'
import { NavLink } from 'react-router-dom'

const Carousel = () => {
    return (
      <>
        <section>
          <div id="carouselExampleAutoplaying" className="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-pause="false" data-bs-interval="2500">
            <div className="carousel-indicators">
              <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
              <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="1" aria-label="Slide 2"></button>
              <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="2" aria-label="Slide 3"></button>
              <button type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide-to="3" aria-label="Slide 4"></button>
            </div>
            <div className="carousel-inner">
               <div className="carousel-item active">
                <NavLink to='/collection/mobiles&tablets?brand=Apple'>
                  <img src={carouselOne} className="d-block w-100" alt="carouselOfferImages" />
                </NavLink>
               </div>
              <div className="carousel-item">
                <NavLink to='/collection/laptops'>
                  <img src={carouselTwo} className="d-block w-100" alt="carouselOfferImages" />
                </NavLink>
              </div>
              <div className="carousel-item">
                <NavLink to=''>
                  <img src={carouselThree} className="d-block w-100" alt="carouselOfferImages" />
                </NavLink>
              </div>
              <div className="carousel-item">
                <NavLink to='/collection/mobiles&tablets?brand=SAMSUNG'>
                  <img src={carouselFour} className="d-block w-100" alt="carouselOfferImages" />
                </NavLink>
              </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
            </button>
          </div>
        </section>     
      </>
    )
  }
  
  export default Carousel;