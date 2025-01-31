import React from 'react';
import ContentLoader from 'react-content-loader';

const CategorySkeleton = () => {
  return (
    <>
        {new Array(20).fill(null).map((_, index) => (
          <ContentLoader
          key={index}
          speed={2}
          width={window.innerWidth < 768 ? 60 : 120}
          height={window.innerWidth < 768 ? 85 : 150}
          viewBox="0 0 120 150"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
          >
            <rect x="0" y="0" rx="10" ry="10" width="120" height="100" />
            <rect x="0" y="110" rx="5" ry="5" width="120" height="20" />
          </ContentLoader>
        ))}

        </>
  );
};

export default CategorySkeleton;