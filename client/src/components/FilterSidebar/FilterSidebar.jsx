import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Slider, Checkbox, Button } from 'antd';
import { getMainCategories } from '../../api/MainCategory';
import { getSubCategories } from '../../api/SubCategory';
import { getBrandCategories } from '../../api/BrandCategory';

const FilterSidebar = ({ filters, setFilters }) => {
  const [showFilters, setShowFilters] = useState(false);

  const { data: mainCategories, isLoading: loadingMainCategory, error: errorLoadingMainCategory } = useQuery({
    queryKey: ["categories", "main-category"],
    queryFn: ({ queryKey }) => getMainCategories(queryKey[1]),
  });

  const { data: subCategories, isLoading: loadingSubCategory, error: errorLoadingSubCategory } = useQuery({
    queryKey: ["categories", "sub-category"],
    queryFn: ({ queryKey }) => getSubCategories(queryKey[1]),
  });

  const { data: brandCategories, isLoading: loadingBrandCategory, error: errorLoadingBrandCategory } = useQuery({
    queryKey: ["categories", "brand-category"],
    queryFn: ({ queryKey }) => getBrandCategories(queryKey[1]),
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === 'checkbox') {
      setFilters({
        ...filters,
        [name]: checked ? [...(filters[name] || []), value] : filters[name].filter((v) => v !== value),
      });
    } else {
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };

  if (loadingMainCategory || loadingBrandCategory || loadingSubCategory) return <p className='text-center'>Loading categories...</p>;
  if (errorLoadingMainCategory) return <p>Error loading categories</p>;

  return (
    <div className="relative">
      {/* Toggle Button for Small Screens */}
      <Button
        className=  "block w-full m-auto md:hidden"
        type="primary"
        onClick={() => setShowFilters(!showFilters)}
      >
        {showFilters ? 'اخفاء الفلاتر' : 'عرض الفلاتر'}
      </Button>

      {/* Filter Panel */}
      <div
        className={`p-5 bg-white transition-transform duration-300 ease-in-out ${
          showFilters ? 'block' : 'hidden'
        } md:block`}
      >

        {/* Price Range */}
        <div className="mb-4">
          <h3 className="mb-2 font-semibold">عرض حسب السعر</h3>
          <Slider
            min={0}
            max={10000}
            value={filters.price}
            onChange={(value) => setFilters({ ...filters, price: value })}
          />
          <div className="flex justify-between text-xs">
            <span>د.ل 0</span>
            <span>د.ل {filters.price}</span>
            <span>د.ل 10000</span>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-4">
          <h3 className="mb-2 font-semibold">تصنيف المنتجات</h3>
          <Checkbox.Group
            options={mainCategories?.map((category) => ({
              label: category.name,
              value: category.id, // Using category ID as the unique value
            }))}
            value={filters.mcategories}
            onChange={(checkedValues) => setFilters({ ...filters, mcategories: checkedValues })}
          />
        </div>

        {/* Product Types */}
        <div className="mb-4">
          <h3 className="mb-2 font-semibold"> تصنيف المنتجات</h3>
          <Checkbox.Group
            options={subCategories?.map((category) => ({
              label: category.name,
              value: category.id, // Using category ID as the unique value
            }))}
            value={filters.scategories}
            onChange={(checkedValues) => setFilters({ ...filters, scategories: checkedValues })}
          />
        </div>

        {/* Brands */}
        <div className="mb-4">
          <h3 className="mb-2 font-semibold">العلامات التجارية</h3>
          <Checkbox.Group
            options={brandCategories?.map((brand) => ({
              label: brand.name,
              value: brand.id, // Using brand ID as the unique value
            }))}
            value={filters.bcategories}
            onChange={(checkedValues) => setFilters({ ...filters, bcategories: checkedValues })}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
