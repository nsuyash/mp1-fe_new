import Header from "../components/Header";
import SelectCategoryTab from "../components/SelectCategoryTab";

const UserProfile = () => {
    const displayProfile = {
        id: 15,
        name: "Suyash Nandurkar",
        profilePhoto: "https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg",
        email: "suyashnandurkar53@gmail.com",
        phone: "+91 9834143191",
        address: "Vamanprastha,near kalewadi petrol pump,kale colony, Pune, Pune, Maharashtra 412106"
      }

    return (
        <>
            <Header />
            <SelectCategoryTab />
            <main className='container mt-5'>
                <div className='row w-75 pt-5'>
                <div className='col-md-4'>
                    <img src={displayProfile.profilePhoto} alt="profile" width={130} />
                </div>
                <div className='col-md-8'>
                    <h2>{displayProfile.name}</h2>
                    <p>{displayProfile.phone}</p>
                    <p>{displayProfile.email}</p>
                    <p>{displayProfile.address}</p>
                </div>
                </div>
            </main>
        </>
    )
}

export default UserProfile;