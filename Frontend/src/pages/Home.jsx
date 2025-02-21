import React, { useCallback, useState, useMemo, memo } from 'react';
import panBanner from '../assets/pan.avif';
import CategorySkeleton from '../components/CategorySkeleton';
import { useCategoryStore } from '../Admin/Stores/useCategoryStore';
import { useSubCategoryStore } from '../Admin/Stores/useSubCategoryStore';
import { useNavigate } from 'react-router-dom';
import { banner } from '../utils/banner';
import cigratte from '../assets/cigratte.avif';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader } from '@mantine/core';

const CategoryWiseProduct = React.lazy(() => import('../components/CategoryWiseProduct'));

const optimizedBanner = banner.map(b => ({
  ...b,
  image: b.image.replace(/\.(png|jpg)$/, '.webp')
}));

function sanitizeName(name) {
  return name.trim().replace(/[^a-zA-Z0-9_\/.]/g, '');
}

const CategoryItem = memo(({ category, onClick }) => (
  <div onClick={onClick}>
    <img
      src={category.imageWebp || category.image}
      alt={category.name}
      loading="lazy"
      width={100}
      height={100}
      className="w-full h-full cursor-pointer object-contain"
    />
  </div>
));

function Home() {
  const { isFetchingCategory, categories } = useCategoryStore();
  const { subCategories } = useSubCategoryStore();
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(6);
  const subCategoryMap = useMemo(() => {
    const map = new Map();
    subCategories.forEach(sub => {
      sub.category.forEach(catId => {
        map.set(catId, sub);
      });
    });
    return map;
  }, [subCategories]);

  const handleRedirectProductPage = useCallback((id, name) => {
    const subcategory = subCategoryMap.get(id);
    if (subcategory) {
      navigate(
        `/${sanitizeName(name)}/${id}/${sanitizeName(subcategory.name)}/${subcategory._id}`
      );
    }
  }, [subCategoryMap, navigate]);

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 6, categories.length));
  }, [categories.length]);

  const memoizedCategories = useMemo(
    () => categories.slice(0, visibleCount),
    [categories, visibleCount]
  );

  const optimizedCategories = useMemo(
    () => categories.map(c => ({
      ...c,
      imageWebp: c.image.replace(/\.(png|jpg)$/, '.webp')
    })),
    [categories]
  );

  return (
    <section className="lg:px-24 px-1">
      <div className="container mx-auto">
        <div className="w-full rounded hidden lg:block"
          onClick={() => navigate('/paancorner/66dffd311e92f6b41280b7ae/SmokingCessation/66e2b223cd76006eff5dbcb9')}
        >
          <img
            srcSet={panBanner}
            className="w-full h-full"
            alt="banner"
            loading="eager"
          />
        </div>

        <div className="ml-9 grid-cols-3 mb-3 hidden lg:grid">
          {optimizedBanner.map((e, index) => (
            <div key={index} onClick={() => handleRedirectProductPage(e.id, e.name)}>
              <img
                srcSet={e.image}
                className="w-96 object-contain h-full"
                alt="banner"
                loading="lazy"
                width={384}
                height={200}
              />
            </div>
          ))}
        </div>

        {/* Mobile Banner */}
        <div className="w-full rounded lg:hidden mb-3 p-2"
          onClick={() => navigate('/paancorner/66dffd311e92f6b41280b7ae/SmokingCessation/66e2b223cd76006eff5dbcb9')}
        >
          <img
            srcSet={cigratte}
            className="w-full"
            alt="banner"
            loading="eager"
            width={400}
            height={200}
          />
        </div>
      </div>

      <div className="max-w-screen mx-auto lg:p-2">
        <div className="lg:hidden px-2 py-1 text-sm font-bold">
          Shop By Category
        </div>
        {isFetchingCategory ? (
          <div className="grid grid-cols-4 lg:gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-6">
            <CategorySkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-4 lg:gap-2 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
            {optimizedCategories.map((category) => (
              <CategoryItem
                key={category._id}
                category={category}
                onClick={() =>
                  handleRedirectProductPage(category._id, category.name)
                }
              />
            ))}
          </div>
        )}
      </div>

      <InfiniteScroll
        dataLength={visibleCount}
        next={loadMore}
        hasMore={visibleCount < categories.length}
        loader={
          <div className="flex justify-center items-center py-32">
            <Loader color="green" size={30} />
          </div>
        }
      >
        <div className="overflow-hidden">
          {memoizedCategories.map((category) => (
            <React.Suspense
              key={category._id}
              fallback={<div className="h-96" />} // Use empty placeholder
            >
              <CategoryWiseProduct
                id={category._id}
                name={category.name}
              />
            </React.Suspense>
          ))}
        </div>
      </InfiniteScroll>
    </section>
  );
}

export default memo(Home);