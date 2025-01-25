import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader, Upload, X, XCircle } from 'lucide-react';
import { useCategoryStore } from '../Stores/useCategoryStore.js';
import { useSubCategoryStore } from '../Stores/useSubCategoryStore.js';
import { useProductStore } from '../Stores/useProductStore.js';

function UploadProduct() {
  const { categories, fetchCategory } = useCategoryStore()
  const { subCategories, fetchSubCategory } = useSubCategoryStore()
  const { loading, addProduct } = useProductStore()

  useEffect(() => {
    fetchCategory()
    fetchSubCategory()
  }, [])

  const [selectedImages, setSelectedImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    image: [],
    categoryIds: [],
    subcategoryIds: [],
    unit: '',
    stock: '',
    price: '',
    discount: '',
    description: '',
    moreDetails: {},
    publish: true
  });
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSubcategoryDropdownOpen, setIsSubcategoryDropdownOpen] = useState(false);
  const fileInputRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const subcategoryDropdownRef = useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
      if (subcategoryDropdownRef.current && !subcategoryDropdownRef.current.contains(event.target)) {
        setIsSubcategoryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => {
      const newCategoryIds = prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId];
      return { ...prev, categoryIds: newCategoryIds };
    });
  };

  const handleSubcategoryToggle = (subcategoryId) => {
    setFormData(prev => {
      const newSubcategoryIds = prev.subcategoryIds.includes(subcategoryId)
        ? prev.subcategoryIds.filter(id => id !== subcategoryId)
        : [...prev.subcategoryIds, subcategoryId];
      return { ...prev, subcategoryIds: newSubcategoryIds };
    });
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      setFormData({ ...formData, image: Array.from(e.target.files) });
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImages(prev => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.categoryIds.length === 0) {
      toast.error('Please select at least one category');
      return;
    } if (formData.subcategoryIds.length === 0) {
      toast.error('Please select at least one sub-category');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    formData.image.forEach((image) => {
      data.append('products', image);
    });
    data.append('category', JSON.stringify(formData.categoryIds));
    data.append('subCategory', JSON.stringify(formData.subcategoryIds));
    data.append('unit', formData.unit);
    data.append('stock', formData.stock);
    data.append('price', formData.price);
    data.append('discount', formData.discount);
    data.append('description', formData.description);
    data.append('publish', formData.publish);
    data.append('moreDetails', JSON.stringify(formData.moreDetails));
    addProduct(data)

    setFormData({
      name: '',
      image: [],
      categoryIds: [],
      subcategoryIds: [],
      unit: '',
      stock: '',
      price: '',
      discount: '',
      description: '',
      moreDetails: {},
      publish: true
    })
    setSelectedImages([])
  };

  const handleMoreDetailsChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      moreDetails: { ...prev.moreDetails, [key]: value }
    }));
  };

  const addMoreDetail = () => {
    const key = `detail${Object.keys(formData.moreDetails).length + 1}`;
    handleMoreDetailsChange(key, '');
  };

  const removeMoreDetail = (key) => {
    const { [key]: _, ...rest } = formData.moreDetails;
    setFormData(prev => ({
      ...prev,
      moreDetails: rest
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Upload Product</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="space-y-6">
            {/* Product Name*/}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name*
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Categories and subCategories*/}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative" ref={categoryDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories*
                </label>
                <div
                  className="min-h-[42px] p-1.5 border rounded-lg cursor-text flex flex-wrap gap-2"
                  onClick={() => setIsCategoryDropdownOpen(true)}
                >
                  {formData.categoryIds.map(categoryId => {
                    const category = categories.find(c => c._id === categoryId);
                    return category ? (
                      <span
                        key={category._id}
                        className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {category.name}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryToggle(category._id);
                          }}
                          className="ml-1 hover:text-blue-600"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </span>
                    ) : null;
                  })}
                  {formData.categoryIds.length === 0 && (
                    <span className="text-gray-500">Select categories...</span>
                  )}
                </div>
                {isCategoryDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                    {categories.map(category => (
                      <div
                        key={category._id}
                        className={`
                          px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center
                          ${formData.categoryIds.includes(category._id) ? 'bg-blue-50' : ''}
                        `}
                        onClick={() => handleCategoryToggle(category._id)}
                      >
                        <input
                          type="checkbox"
                          checked={formData.categoryIds.includes(category._id)}
                          onChange={() => { }}
                          className="mr-3"
                        />
                        {category.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={subcategoryDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sub-Categories*
                </label>
                <div
                  className="min-h-[42px] p-1.5 border rounded-lg cursor-text flex flex-wrap gap-2"
                  onClick={() => setIsSubcategoryDropdownOpen(true)}
                >
                  {formData.subcategoryIds.map(subcategoryId => {
                    const subcategory = subCategories.find(s => s._id === subcategoryId);
                    return subcategory ? (
                      <span
                        key={subcategory._id}
                        className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-green-100 text-green-800"
                      >
                        {subcategory.name}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubcategoryToggle(subcategory._id);
                          }}
                          className="ml-1 hover:text-green-600"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </span>
                    ) : null;
                  })}
                  {formData.subcategoryIds.length === 0 && (
                    <span className="text-gray-500">Select subCategories...</span>
                  )}
                </div>
                {isSubcategoryDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
                    {subCategories.map(subcategory => (
                      <div
                        key={subcategory._id}
                        className={`
                          px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center
                          ${formData.subcategoryIds.includes(subcategory._id) ? 'bg-green-50' : ''}
                        `}
                        onClick={() => handleSubcategoryToggle(subcategory._id)}
                      >
                        <input
                          type="checkbox"
                          checked={formData.subcategoryIds.includes(subcategory._id)}
                          onChange={() => { }}
                          className="mr-3"
                        />
                        {subcategory.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Details*/}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., kg, pcs"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price*
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount (%)
                </label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="100"
                />
              </div>
            </div>

            {/* Description*/}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            {/* Product Images*/}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images*
              </label>
              <div className="mt-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Images</span>
                </button>
              </div>
              {selectedImages.length > 0 && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="w-64 relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className=" h-32 object-contain rounded-lg "
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-28 p-1 bg-red-500 text-white rounded-full transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Details*/}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Details
                </label>
                <button
                  type="button"
                  onClick={addMoreDetail}
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  + Add Detail
                </button>
              </div>
              <div className="space-y-2">
                {Object.entries(formData.moreDetails).map(([key, value]) => (
                  <div key={key} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => {
                        const { [key]: oldValue, ...rest } = formData.moreDetails;
                        setFormData(prev => ({
                          ...prev,
                          moreDetails: { ...rest, [e.target.value]: oldValue }
                        }));
                      }}
                      placeholder="Key"
                      className="flex-1 p-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleMoreDetailsChange(key, e.target.value)}
                      placeholder="Value"
                      className="flex-1 p-2 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeMoreDetail(key)}
                      className="p-2 text-red-500 hover:text-red-600 sm:self-auto self-end"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button*/}
          <div className="flex justify-end mt-8"> 
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              {loading ? (
                <Loader className='flex justify-center items-center w-full animate-spin' />
              ) : "Upload Product"}

            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadProduct