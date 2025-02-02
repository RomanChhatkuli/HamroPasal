import { ChevronDown, ChevronLeft, Search } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useProductStore } from '../Admin/Stores/useProductStore';
import { useSubCategoryStore } from '../Admin/Stores/useSubCategoryStore';
import { useCategoryStore } from '../Admin/Stores/useCategoryStore';
import ProductCard from '../components/ProductCard';
import Header from '../Layout/Header';

function sanitizeName(name) {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9_\/.]/g, '');
}

function ProductList() {
  const params = useParams();
  const navigate = useNavigate()
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [selectedSubCategory, setselectedSubCategory] = useState(params.subcategoryName);
  const [selectedMainCategory, setSelectedMainCategory] = useState(params.categoryName || '');
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);

  const { fetchProductByCategoryAndSubcategory } = useProductStore();
  const { subCategories } = useSubCategoryStore();
  const { categories } = useCategoryStore();
  const [data, setData] = useState([]);

  const mainCategories = categories.slice(0, 7);
  const moreCategories = categories.slice(7);

  useEffect(() => {
    async function getData() {
      if (params.categoryId && params.subcategoryId) {
        const response = await fetchProductByCategoryAndSubcategory(params.categoryId, params.subcategoryId);
        setData(response);
      }
    }
    getData();
  }, [params.categoryId, params.subcategoryId]);

  useEffect(() => {
    if (params.categoryId && subCategories) {
      const result = subCategories.filter((subCategory) =>
        Array.isArray(subCategory.category)
          ? subCategory.category.includes(params.categoryId)
          : subCategory.category === params.categoryId
      );
      setFilteredSubCategories(result);
    }
  }, [params, subCategories]);

  const handleMoreClick = () => {
    setShowMoreDropdown(!showMoreDropdown);
  };
  
    const handleRedirectCategory = useCallback((category) => {
      setselectedSubCategory(null)
      setSelectedMainCategory(category)
      const subcategory = subCategories.find(sub =>
        sub.category.some(c => c === category._id)
      )
      if (subcategory) {
        navigate(`/${sanitizeName(category.name)}/${category._id}/${sanitizeName(subcategory.name)}/${subcategory._id}`);
      }
    }, [subCategories,params,categories]);
  

  return (
    <div className="max-h-screen bg-gray-50">
      <div className='hidden lg:block'>
      <Header />
      </div>
      <div className='flex items-center justify-between lg:hidden mt-3 px-3 mb-2'>
        <button className="flex items-center text-gray-600">
          <ChevronLeft className="w-5 h-5" />
          <Link className="ml-1" to={'/'}>Back</Link>
        </button>
        <Link className="flex items-center text-gray-600" to={'/search'}>
          <Search className="w-6 h-6" />
        </Link>
      </div>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-[80px] z-40 hidden lg:block">
        <div className="max-w-7xl mx-auto p-2 px-16">
          <nav className="flex space-x-8 relative">
            {mainCategories.map((category) => (
              <button
                key={`${category._id}-mainCategory`}
                onClick={() => handleRedirectCategory(category)}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors ${selectedMainCategory === category
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {category.name}
              </button>
            ))}
            <div className="relative">
              <button
                onClick={handleMoreClick}
                className={`text-sm font-medium pb-2 border-b-2 transition-colors flex items-center ${showMoreDropdown
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                More
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {showMoreDropdown && (
                <div className="absolute max-h-[47vh] overflow-y-auto top-full right-0 mt-1 w-56 bg-white  rounded-lg shadow-lg py-2 z-50">
                  {moreCategories.map((category) => (
                    <button
                      key={`${category._id}-moreCategory`}
                      onClick={() => {
                        handleRedirectCategory(category)
                        setShowMoreDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto h-[83.5vh] lg:h-[75vh]">
        <div className="flex gap-[85px] lg:gap-14 ">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0 ">
            <div className="bg-white rounded-lg shadow-sm fixed w-20 lg:w-72 mt-9 lg:mt-1">
              <nav className="max-h-[78vh] lg:max-h-[73.3vh] overflow-y-auto ">
                {filteredSubCategories.map((subCategory) => (
                  <Link
                    key={`${subCategory._id}-subcategory`}
                    onClick={() => setselectedSubCategory(subCategory.name)}
                    className={`w-full gap-1 lg:gap-0 text-pretty lg:text-left p-3 rounded-lg flex flex-col lg:flex-row justify-center items-center lg:space-x-3 ${selectedSubCategory === subCategory.name
                      ? 'bg-green-50 text-green-700'
                      : 'hover:bg-gray-50'
                      }`}
                      to={`/${sanitizeName(params.categoryName)}/${params.categoryId}/${sanitizeName(subCategory.name)}/${subCategory._id}`}
                  >
                    <img
                      src={subCategory.image}
                      alt={subCategory.name}
                      className="w-14 lg:w-20 h-14 relative lg:top-1 lg:h-20 object-contain mb-[-4px] lg:mb-0"
                    />
                    <span className="flex-1 text-xs lg:text-base ">{subCategory.name}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Product Grid */}
          <div className="sticky top-20">
            <div className=" mb-2 lg:mb-3 mt-2 ">
              <h2 className="lg:text-xl text-sm relative right-16 lg:right-0 font-semibold">{selectedSubCategory || params.subcategoryName}</h2>
            </div>

            <div className='max-h-[78vh] mb-3 lg:mb-2 lg:max-h-[67vh] relative overflow-y-auto'>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-6 ">
                {data.map((product) => (
                  <ProductCard product={product} key={product?._id + "ProductList"} />
                ))}
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductList;
