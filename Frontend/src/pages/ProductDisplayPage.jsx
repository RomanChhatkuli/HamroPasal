import { useEffect, useState } from 'react';
import { Rocket, Tag, ShoppingCart, ChevronLeft, CheckCircle, AlertCircle, Search, Loader2 } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '../Admin/Stores/useProductStore';
import Header from '../Layout/Header';
import Footer from '../Layout/Footer'
import AddToCartButton from '../components/AddToCartButton';

const ProductDisplay = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const { fetchProductDetail, isFetchingProductDetails } = useProductStore();
  const [product, setProduct] = useState({
    name: '',
    image: [],
    category: [],
    subcategory: [],
    unit: '',
    stock: '',
    price: '',
    discount: '',
    description: '',
    more_Details: {},
  });
  const params = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function getData() {
      const result = await fetchProductDetail(params.id);
      setProduct(result);
    }
    getData()
  }, [params]);

  const calculatedPrice = product?.discount
    ? product?.price - (product?.price * product?.discount) / 100
    : product?.price;

  const discountAmount = product?.discount
    ? product?.price - calculatedPrice
    : 0;

  // Reusable product info section
  const ProductInfoSection = () => (
    <div className="bg-white p-4 lg:p-6 rounded-xl shadow-sm border border-gray-100">
      <h1 className="lg:text-2xl text-md text-pretty font-bold text-gray-800 mb-4">{product?.name}</h1>

      {/* Pricing Section */}
      <div className="mb-3 lg:mb-6">
        <div className='flex items-center justify-between'>

          <div className="flex items-center gap-3">
            <span className="text-lg lg:text-3xl font-bold text-gray-800">
              Rs.{Number(calculatedPrice).toFixed(0)}
            </span>
            {product?.discount > 0 && (
              <>
                <span className="text-gray-500 line-through">Rs.{product?.price}</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs lg:text-sm">
                  {product?.discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Add to Cart Button */}
          {product?.stock > 0 ? (
            <div className='scale-[1.15]'>
              <AddToCartButton product={product} />
            </div>
          ) : (
            <button
              className="w-full bg-gray-400 text-white py-3 rounded-lg font-medium cursor-not-allowed"
              disabled
            >
              Out of Stock
            </button>
          )}
        </div>

        {product?.discount > 0 && (
          <p className="text-xs lg:text-sm text-gray-500 lg:mt-2 ">
            You save Rs.{discountAmount.toFixed(0)}
          </p>
        )}
      </div>

      {/* Stock & Quantity */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          {product?.stock > 0 ? (
            <>
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-600">In Stock</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-600">Out of Stock</span>
            </>
          )}
        </div>
      </div>

      {/* Delivery & Policies */}
      <div className="bg-white py-2">
        <h2 className="text-xl font-bold mb-4">Why shop from HamroPasal?</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
          <Rocket className="w-6 h-6 text-blue-500 flex-shrink-0 mt-4" />
          <div>
            <h3 className="text-lg font-semibold">Superfast Delivery</h3>
            <p className="text-gray-600">
              Get your order delivered to your doorstep at the earliest from dark stores near you.
            </p>
          </div>
        </div>
          <div className="flex items-start space-x-4">
            <Tag className="w-6 h-6 text-green-500 flex-shrink-0 mt-4" />
            <div>
              <h3 className="text-lg font-semibold">Best Prices & Offers</h3>
              <p className="text-gray-600">
                Best price destination with offers directly from the manufacturers.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-4 mt-4">
            <ShoppingCart className="w-6 h-6 text-purple-500 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold">Wide Assortment</h3>
              <p className="text-gray-600">
                Choose from different products across food, personal care, household & other categories.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Fixed Header */}
      <div className='hidden lg:block'>
        <div className="fixed top-0 left-0 w-full bg-white shadow-sm z-50"  >
          <Header />
        </div>
      </div>

      {/* Mobile Header */}
      <div className='flex items-center justify-between lg:hidden mt-3 px-3'>
        <button className="flex items-center text-gray-600" onClick={() => window.history.back()}>
          <ChevronLeft className="w-5 h-5" />
          <div className="ml-1" >Back</div>
        </button>
        <Link className="flex items-center text-gray-600" to={'/search'}>
          <Search className="w-6 h-6" />
        </Link>
      </div>

      {
        isFetchingProductDetails &&
         <div className="w-[100vw] h-[100vh] flex justify-center items-center">
          <Loader2 size={35} className='text-yellow-500 animate-spin' />
        </div>
      }

      <div className="max-w-7xl mx-auto p-2 mt-2 lg:mt-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1">
            {/* Image Gallery */}
            {product?.image &&
              (<div className="bg-gray-100 rounded-xl p-2 shadow-sm">
                <div className="h-[330px] lg:h-[440px] bg-white rounded-xl overflow-hidden">
                  <img
                    src={product?.image[selectedImage]}
                    alt={product?.name}
                    className="w-full h-full object-contain p-4"
                  />
                </div>
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2  lg:justify-center">
                  {product?.image.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`min-w-16 h-16 rounded-lg cursor-pointer border-2 ${selectedImage === index ? 'border-green-500' : 'border-gray-200'
                        }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-contain bg-white p-1 rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>)
            }
            {/* Mobile Product Info */}
            <div className="lg:hidden mt-2">
              <ProductInfoSection />
            </div>

            {/* Product Description Section */}
            <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <h2 className="lg:text-xl text-lg font-bold text-gray-800 mb-1">Product Description</h2>
              <p className=" leading-relaxed text-sm lg:text-md">
                {product?.description || "No description available"}
              </p>

              {product?.more_details?.highlights && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {product?.more_details?.highlights.map((item, index) => (
                      <li key={index} className="flex items-start text-gray-600">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {Object.keys(product?.more_details || {}).length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-1">Specifications</h3>
                  <div className="flex flex-col gap-2 ml-[-3px]">
                    {Object.entries(product?.more_details).map(([key, value]) => {
                      if (['highlights', 'deliveryTime'].includes(key)) return null;
                      return (
                        <div key={key} className="bg-gray-50 px-2 py-1 rounded-lg">
                          <div className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</div>
                          <div className="text-gray-800 text-sm lg:text-md mt-1">{value.toString()}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="px-2 py-1 rounded-lg mt-2 ml-[-5px]">
                <div className="text-sm font-medium capitalize">Return Policy</div>
                <div className="text-gray-800 text-sm lg:text-md mt-1">
                  This Item is non-returnable. For a damaged, defective, incorrect or expired item, you can request a replacement within 72 hours of delivery.
                  In case of an incorrect item, you may raise a replacement or return request only if the item is sealed/ unopened/ unused and in original condition.</div>
              </div>
            </div>
          </div>

          {/* Desktop Product Info (Sidebar) */}
          <div className="hidden lg:block lg:w-[40%] lg:sticky lg:self-start lg:top-24  lg:overflow-y-auto lg:pt-2">
            <ProductInfoSection />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDisplay;