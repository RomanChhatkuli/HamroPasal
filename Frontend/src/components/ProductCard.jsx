import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { pricewithDiscount } from "../utils/pricewithDiscount";
import { Clock } from 'lucide-react';
import AddToCartButton from './AddToCartButton';

function ProductCard({ product }) {
    const [randomTime] = useState(() => Math.floor(10 + Math.random() * 5));

    const sanitizeName = useMemo(() => (name) => {
        return name.trim().replace(/[^a-zA-Z0-9_\/.]/g, '');
    }, []);

    const discountedPrice = useMemo(() => DisplayPriceInRupees(pricewithDiscount(product.price, product.discount)), [product.price, product.discount]);

    const productLink = useMemo(() => `/product/${sanitizeName(product?.name)}/${product?._id}`, [product]);

    return (
        <Link to={productLink} key={product._id} className='border py-2 lg:p-4 grid gap-1 lg:gap-3 min-w-36 lg:min-w-52 rounded cursor-pointer bg-white'>
            <div className='min-h-20 w-full max-h-24 lg:max-h-32 rounded overflow-hidden'>
                <img
                    src={product?.image[0]}
                    loading='lazy'
                    alt={product?.name}
                    className='w-full h-full object-scale-down lg:scale-125'
                />
            </div>
            <div className='flex items-center lg:gap-8 gap-5'>
                <div className='rounded text-xs flex justify-center items-center w-fit lg:px-2 bg-slate-100'>
                    <Clock className='scale-[0.4]' />
                    {randomTime} min
                </div>
                {Boolean(product.discount) && (
                    <p className='text-green-600 px-2 w-fit text-xs rounded'>{product.discount}% off</p>
                )}
            </div>
            <div className='px-2 lg:px-0 font-medium text-ellipsis text-sm lg:text-base line-clamp-2'>
                {product.name}
            </div>
            <div className='w-fit gap-1 px-2 lg:px-0 text-sm lg:text-base'>
                {product.unit}
            </div>
            <div className='px-2 lg:px-0 flex items-center justify-between gap-4 lg:gap-12 text-sm lg:text-base'>
                <div className='flex items-center gap-1'>
                    <div className='font-semibold text-xs lg:text-base'>
                        Rs.{discountedPrice}
                    </div>
                </div>
                {product.stock === 0 ? (
                    <p className='text-red-500 text-sm text-center'>Out of stock</p>
                ) : (
                    <AddToCartButton product={product} />
                )}
            </div>
        </Link>
    );
}

export default React.memo(ProductCard);