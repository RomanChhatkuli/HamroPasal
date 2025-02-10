import React from 'react'
import { useProductStore } from '../Admin/Stores/useProductStore'
import ProductCard from '../components/ProductCard.jsx';
import { useLocation } from 'react-router-dom';
import NoProduct from '../assets/NoProduct.webp'

function SearchPage() {
  const { products } = useProductStore();
  const params = useLocation()

  const searchTerm = params?.search?.slice(3)
  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product?.name.toLowerCase().includes(searchTerm?.toLowerCase());
    return matchesSearch;
  })

  if (searchTerm.length) {
    return (
      <div className="min-h-[81vh] lg:px-32 p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="lg:text-lg text-sm text-gray-800">Showing results for "{searchTerm}"</h1>
        </div>
        {filteredProducts.length ?
          (<div className="bg-white rounded-xl">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard product={product} key={product?._id + "SearchProductCard"} />
              ))}
            </div>
          </div>)
          :
          (
            <div className='flex justify-center items-center flex-col mt-9'>
              <img
                src={NoProduct}
                alt="NoProduct"
                className='sm:w-80'
              />
              <p className='font-bold text-3xl lg:text-[44px] text-[rgb(184,184,184)]'>Nothing here yet</p>
            </div>
          )
        }
      </div>
    )
  }
}

export default SearchPage