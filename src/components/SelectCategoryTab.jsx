import { Link } from "react-router-dom";

const SelectCategoryTab = () => {
    return (
        <section className='text-dark pt-1' style={{backgroundColor: '#a9c5a0', fontSize: 14}}>
            <div className=' text-center'>
            <div> 
                {
                [{category: '50% off', path: '/'}, {category: 'Mobiles & Tablets', path: '/collection/mobiles&tablets'}, {category: 'Laptops', path: '/collection/laptops'}, {category: 'Tv & Appliances', path: '/'}, {category: 'Fashion', path: '/'}, {category: 'Furniture', path: '/'}].map((collectionType, index) => (
                    <div className="h6 d-inline-block" key={index}><Link to={collectionType.path} style={{textDecoration: 'none', color: 'black', padding: '0rem 4rem'}}><span className="cXATEGORY">{collectionType.category}</span></Link></div>
                ))
                }               
            </div>
            </div>
        </section>
    );
}

export default SelectCategoryTab;