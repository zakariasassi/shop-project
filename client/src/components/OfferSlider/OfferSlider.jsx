import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { IMAGE_URL, URL } from '../../constant/URL';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SEO from '../SEO'; // Import the SEO component

const OfferSlider = () => {
  const [offersData, setOffersData] = useState([]);

  const fetchOffers = async () => {
    const token = window.localStorage.getItem('token');

    try {
      const { data } = await axios.get(`${URL}offers`, {
        headers: {
          authorization: 'Bearer ' + token,
        },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const { data: offers, isLoading: offersLoading, error: offersError } = useQuery('offers', fetchOffers);

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  useEffect(() => {
    setOffersData(offers);
  }, [offers]);

  return (
    <div className="h-auto max-w-full mx-auto ">

                  <p className='p-4 font-bold text-'> عروض   </p>

        {offersData?.map((offer) => (
          <Link key={offer.id} to="/offer-products" state={{ id: offer.id }}>
            <div className=" cursor-lg text-primarypointer" dir="rtl">

              <div className="relative m-4 overflow-hidden rounded-lg">
                <img
                  className="object-cover w-full h-[200px]"
                  src={ IMAGE_URL +  "offers/" + offer.image}
                  alt={offer.title}
                />

              </div>
            </div>
          </Link>
        ))}
    </div>
  );
};

export default OfferSlider;
