import { FaShippingFast, FaGift, FaHeadset } from 'react-icons/fa';

const WhyChooseUs = () => {
  return (
    <section className="flex items-center justify-center py-12 h-[400px]">
      <div className="container px-4 mx-auto">
        <h2 className="mb-8 text-3xl font-bold text-center">لماذا نحن</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Fast Delivery */}
          <div className="flex flex-col items-center p-6 text-center bg-white rounded-lg shadow-lg">
            <FaShippingFast className="mb-4 text-4xl text-blue-500" />
            <h3 className="mb-2 text-xl font-semibold">خدمة توصيل سريعة</h3>
            <p className="text-gray-600">
              We ensure quick delivery so you get your medications and products as fast as possible.
            </p>
          </div>

          {/* Comprehensive Product Range */}
          <div className="flex flex-col items-center p-6 text-center bg-white rounded-lg shadow-lg">
            <FaGift className="mb-4 text-4xl text-green-500" />
            <h3 className="mb-2 text-xl font-semibold">منتجات متنوعة</h3>
            <p className="text-gray-600">
              We have a wide selection of products to meet all your pharmacy needs.
            </p>
          </div>

          {/* 24/7 Support */}
          <div className="flex flex-col items-center p-6 text-center bg-white rounded-lg shadow-lg">
            <FaHeadset className="mb-4 text-4xl text-red-500" />
            <h3 className="mb-2 text-xl font-semibold">24/7 دعم متواصل</h3>
            <p className="text-gray-600">
              Our customer support team is available around the clock to assist you with any queries.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
