import React, { useCallback, useEffect, useState } from 'react'
import panBanner from '../assets/pan.jpg'
import CategorySkeleton from '../components/CategorySkeleton'
import { useCategoryStore } from '../Admin/Stores/useCategoryStore'
import { useSubCategoryStore } from '../Admin/Stores/useSubCategoryStore';
import CategoryWiseProduct from '../components/CategoryWiseProduct';
import { useNavigate } from 'react-router-dom';
import { banner } from '../utils/banner';
import cigratte from '../assets/cigratte.webp'
import InfiniteScroll from 'react-infinite-scroll-component'


function sanitizeName(name) {
  return name
    .trim()
    .replace(/[^a-zA-Z0-9_\/.]/g, '');
}

function Home() {
  const { isFetchingCategory, categories } = useCategoryStore();
  const { subCategories } = useSubCategoryStore()
  const navigate = useNavigate()
  const [visibleCount, setVisibleCount] = useState(8)

  const handleRedirectProductPage = useCallback((id, name) => {
    const subcategory = subCategories.find(sub =>
      sub.category.some(c => c === id)
    )
    if (subcategory) {
      navigate(`/${sanitizeName(name)}/${id}/${sanitizeName(subcategory.name)}/${subcategory._id}`);
    }
  }, [subCategories, navigate]);


  return (
    <section className='lg:px-24 px-1'>
      <div className='container mx-auto'>
        <div className={`w-full rounded hidden lg:block`}
          onClick={() => handleRedirectProductPage("66dffd311e92f6b41280b7ae", "paan corner")}
        >
          <img
            srcSet={panBanner}
            className='w-full'
            alt='banner'
          />
        </div>
        <div className='ml-9 grid-cols-3 mb-3 hidden lg:grid'>
          {banner.map((e, index) => {
            return (
              <div
                key={index}
                onClick={() => handleRedirectProductPage(e.id, e.name)}
              >
                <img
                  srcSet={e.image}
                  className='w-96 object-contain'
                  alt='banner'
                />
              </div>
            )
          })}
        </div>

        {/* Mobile Banner  */}
        <div className={`w-full rounded lg:hidden mb-3 p-2`}
          onClick={() => handleRedirectProductPage("66dffd311e92f6b41280b7ae", "paan corner")}
        >
          <img
            srcSet={cigratte}
            className='w-full'
            alt='banner'
          />
        </div>
      </div>

      <div className="max-w-screen mx-auto lg:p-2">
        <div className='lg:hidden px-2 py-1 text-sm font-bold'>Shop By Category</div>
        <div className="grid grid-cols-4 lg:gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
          {
            isFetchingCategory ?
              (<CategorySkeleton />)
              :
              (
                categories.map((category, index) => {
                  return (
                    <div key={index} onClick={() => handleRedirectProductPage(category._id, category.name)}>
                      <div className=''>
                        <img
                          src={category.image}
                          alt={category.name}
                          loading='lazy'
                          className='w-full h-full cursor-pointer object-contain'
                        />
                      </div>
                    </div>
                  )
                })
              )

          }
        </div>
      </div>
      {/* <InfiniteScroll
        dataLength={20} //This is important field to render the next data
        next={loadMoreProducts}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
      </InfiniteScroll> */}
      {categories?.slice(0, visibleCount).map((category, index) => (
        <CategoryWiseProduct
          key={category?._id + "CategorywiseProduct"}
          id={category?._id}
          name={category?.name}
        />
      ))}

      {visibleCount < categories.length && (
        <div className="text-center mt-4">
          <button
            onClick={() => setVisibleCount((prev) => prev + 6)}
            className=" text-green-500 mb-4"
          >
            Load More
          </button>
        </div>
      )}


    </section>
  )
}

export default Home