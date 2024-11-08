import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { getMainCategories } from '../../api/MainCategory';
import { getSubCategories } from '../../api/SubCategory';
import { getBrandCategories } from '../../api/BrandCategory';
import { Link } from 'react-router-dom';

function DropDown() {
  const [activeMainCategory, setActiveMainCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);

  const { data: MaincategoriesUpdate, isLoading: LoadingMaincategories } = useQuery({
    queryKey: ["categories", "main-category"],
    queryFn: getMainCategories,
  });

  const { data: SubCategorysUpdate, isLoading: LoadingSubCategories } = useQuery({
    queryKey: ["categories", "sub-category"],
    queryFn: getSubCategories,
  });

  const { data: BrandcategoriesUpdate, isLoading: LoadingBrandcategories } = useQuery({
    queryKey: ["categories", "brand-category"],
    queryFn: getBrandCategories,
  });

  if (LoadingMaincategories || LoadingSubCategories || LoadingBrandcategories) {
    return <div>Loading...</div>;
  }

  const handleMainCategoryClick = (categoryId) => {
    setActiveMainCategory(categoryId);
    setActiveSubCategory(null);
  };

  const handleSubCategoryClick = (subCategoryId) => {
    setActiveSubCategory(subCategoryId);
  };

  return (
    <div className="relative inline-block text-left">
      <Link id="multiLevelDropdownButton" data-dropdown-toggle="multi-dropdown" className="inline-flex items-center font-medium text-center text-black focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
        Dropdown button
      </Link>

      <div id="multi-dropdown" className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
          {MaincategoriesUpdate?.map(mainCategory => (
            <li key={mainCategory.id}>
              <button onClick={() => handleMainCategoryClick(mainCategory.id)} className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                {mainCategory.name}
              </button>
              {activeMainCategory === mainCategory.id && (
                <div className="pl-4">
                  <ul>
                    {SubCategorysUpdate?.filter(sub => sub.MainCategoryId === mainCategory.id).map(subCategory => (
                      <li key={subCategory.id}>
                        <button onClick={() => handleSubCategoryClick(subCategory.id)} className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                          {subCategory.name}
                        </button>
                        {activeSubCategory === subCategory.id && (
                          <div className="pl-4">
                            <ul>
                              {BrandcategoriesUpdate?.filter(brand => brand.SubCategoryId === subCategory.id).map(brandCategory => (
                                <li key={brandCategory.id}>
                                  <a href={`/products/${brandCategory.id}`} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                    {brandCategory.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DropDown;
