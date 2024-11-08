import React, { useState } from "react";
import { Label, TextInput } from "flowbite-react";
// import Swiper core and required modules
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

function Hero() {
  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={10}
        slidesPerView={1}
        navigation
        className="h-auto"
        style={{
          objectFit: "contain",
        }}
        autoplay={{
          delay: 2000, // Delay between transitions in milliseconds
        }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
      >
        <SwiperSlide>
          <img
            className="w-full"
            src="https://assets.aboutamazon.com/dims4/default/e16b842/2147483647/strip/false/crop/2000x1125+0+0/resize/1486x836!/quality/90/?url=https%3A%2F%2Famazon-blogs-brightspot.s3.amazonaws.com%2Fa3%2Fc2%2F5c0b93db41d789be1bec015003bd%2Fpharmacy-hero-2000x1125.jpg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            className="w-full"
            src="https://assets.aboutamazon.com/dims4/default/e16b842/2147483647/strip/false/crop/2000x1125+0+0/resize/1486x836!/quality/90/?url=https%3A%2F%2Famazon-blogs-brightspot.s3.amazonaws.com%2Fa3%2Fc2%2F5c0b93db41d789be1bec015003bd%2Fpharmacy-hero-2000x1125.jpg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            className="w-full"
            src="https://assets.aboutamazon.com/dims4/default/e16b842/2147483647/strip/false/crop/2000x1125+0+0/resize/1486x836!/quality/90/?url=https%3A%2F%2Famazon-blogs-brightspot.s3.amazonaws.com%2Fa3%2Fc2%2F5c0b93db41d789be1bec015003bd%2Fpharmacy-hero-2000x1125.jpg"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            className="w-full"
            src="https://assets.aboutamazon.com/dims4/default/e16b842/2147483647/strip/false/crop/2000x1125+0+0/resize/1486x836!/quality/90/?url=https%3A%2F%2Famazon-blogs-brightspot.s3.amazonaws.com%2Fa3%2Fc2%2F5c0b93db41d789be1bec015003bd%2Fpharmacy-hero-2000x1125.jpg"
          />
        </SwiperSlide>
        ...
      </Swiper>

      <div className="flex w-[1200px]  justify-center m-auto mt-5 ">
        <div className="flex justify-center w-full bg-teal-400 rounded-lg ">
          <div className=" w-[60%] max-sm:w-full flex justify-center    ">
            <div className="flex justify-center w-full gap-4 p-10 max-sm:flex-wrap ">
              <div className="w-full ">
                <input
                  id="small"
                  type="text"
                  className="w-full rounded-lg"
                  placeholder="ابحث عن اي منتج تريده الان !"
                />
              </div>
              <button className="px-6 text-teal-500 bg-white rounded-lg">
                بحث
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
