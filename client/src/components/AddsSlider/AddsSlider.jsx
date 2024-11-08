


import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { IMAGE_URL, URL } from '../../constant/URL';
import { useQuery } from 'react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AddsSlider = () => {
  const token = window.localStorage.getItem('token');
  const [addsData, setaddsData] = useState([])

  const fetchAdds = async () => {
    try {
      const { data } = await axios.get(`${URL}adds`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      return data;

    } catch (error) {
      console.log(error);
    }
  }


  const { data: adds, isLoading: addsLoading, error: addsError } = useQuery('adds', fetchAdds);

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
    setaddsData(adds);
  }, [adds])

  return (
    <div className="h-auto max-w-full py-2 mx-auto sm:px-4 ">
      <p className='p-2 text-lg font-bold text-primary'>اعلانات  </p>

        {addsData?.map((add) => (
          <div className="mt-2 " dir='rtl'>

            <div className="relative overflow-hidden rounded-lg">
              <img className="object-cover w-full h-[150px]" src={IMAGE_URL + "adds/" + add.image} />
            </div>
          </div>

        ))}
      
    </div>
  );
};

export default AddsSlider;
