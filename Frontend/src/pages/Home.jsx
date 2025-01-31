import React, { useEffect } from 'react'
import banner from '../assets/banner.jpg'
import CategorySkeleton from '../components/CategorySkeleton'
import { useCategoryStore } from '../Admin/Stores/useCategoryStore'
import { useSubCategoryStore } from '../Admin/Stores/useSubCategoryStore';
import CategoryWiseProduct from '../components/CategoryWiseProduct';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { isFetchingCategory, categories, fetchCategory } = useCategoryStore();
  const { subCategories, fetchSubCategory } = useSubCategoryStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchCategory()
    fetchSubCategory()
  }, [])
  
  function sanitizeName(name) {
    return name
      .trim()
      .replace(/[^a-zA-Z0-9_\/.]/g, ''); // Remove disallowed characters for cloudniary public_id
  }

  function handleRedirectProductPage(id, name) {
    const subcategory = subCategories.find(sub => {
      const filterData = sub.category.some(c => {
        return c === id
      })

      return filterData ? true : null
    })
    navigate(`/${sanitizeName(name)}/${id}/${sanitizeName(subcategory.name)}/${subcategory._id}`)
  }

  return (
    <section className='lg:px-24 px-1'>
      <div className='container mx-auto'>
        <div className={`w-full rounded`}>
          <img
            src={banner}
            className='w-full h-24 lg:h-60'
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

      {categories?.map((category, index) => (
        <CategoryWiseProduct
        key={category?._id + "CategorywiseProduct"}
        id={category?._id}
        name={category?.name}
        />
      ))}

    </section>
  )
}

export default Home
{/* <iframe
  width="100%"
  height="400"
  frameBorder="0"
  scrolling="no"
  src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=rural%20health%20education%20and%20service%20center+(Rural%20Health%20Education%20and%20Service%20Center)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
>
</iframe> */}
{/* <a href="https://www.gps.ie/">gps systems</a> */ }