import React from 'react';
import ContentLoader from 'react-content-loader';

const CategorySkeleton = () => {
  return (
    <>
        {new Array(18).fill(null).map((_, index) => (
          <ContentLoader
          key={index}
          speed={2}
          width={window.innerWidth < 768 ? 80 : 200}
          height={window.innerWidth < 768 ? 110 : 220}
          viewBox="0 0 120 150"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
          >
            <rect x="0" y="0" rx="10" ry="10" width="120" height="100" />
            <rect x="0" y="108" rx="5" ry="5" width="120" height="20" />
          </ContentLoader>
        ))}

        </>
  );
};

export default CategorySkeleton;