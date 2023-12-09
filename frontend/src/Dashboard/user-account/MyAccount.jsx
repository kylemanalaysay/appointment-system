import { useContext, useState } from 'react';
import userImg from '../../assets/images/violet.png';
import Loading from '../../components/Loader/Loading';
import userGetProfile from '../../hooks/useFetch.js';
import Profile from './Profile.jsx';
import Mybookings from './MyBookings.jsx';
import { BASE_URL } from '../../config.js';
import Error from '../../components/Error/Error.jsx';

const MyAccount = () => {
  const [tab, setTab] = useState("bookings");

  const {
    data: userData,
    loading,
    error,
  } = userGetProfile(`${BASE_URL}/users/profile/me`);

  console.log(userData, "userdata");

  return (
    <section>
      <div className="max-w-1170px mx-auto px-5">
        {loading && !error && <Loading />}
        {error && !loading && <Error errMessage={error} />}
        {!loading && !error && (
          <div className="grid md:grid-cols-3 gap-10">
            <div className="pb-50px px-30px rounded-md flex flex-col items-center">

              <div className='text-center'>
                <h3 className='text-15px leading-30px text-headerColor font-bold'>
                  {userData?.firstName} {userData?.lastName}
                </h3>
                <p className="text-textColor text-15px leading-6 font-medium">
                  {userData?.email}
                </p>
              </div>
            </div>

            <div className="col-span-2 flex flex-col items-center md:items-start justify-center">
              <div className="flex flex-row items-start">
                <button
                  onClick={() => setTab('bookings')}
                  className={`${
                    tab === 'bookings' ? 'bg-primaryColor text-white font-normal' : ''
                  } py-2 px-5 rounded-md text-headingColor font-semibold text-16px leading-7 border border-solid border-primaryColor mr-2`}
                >
                  My Bookings
                </button>

                <button
                  onClick={() => setTab('settings')}
                  className={`${
                    tab === 'settings' ? 'bg-primaryColor text-white font-normal' : ''
                  } py-2 px-5 rounded-md text-headingColor font-semibold text-16px leading-7 border border-solid border-primaryColor`}
                >
                  Profile Settings
                </button>
              </div>
              {tab === 'bookings' && <Mybookings />}
              {tab === 'settings' && <Profile />}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MyAccount;
