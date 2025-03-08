import React, { useState, useRef, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Search, Filter, ChevronDown, ChevronUp, X as XMark, Loader, Loader2 } from 'lucide-react';
import { useSubCategoryStore } from '../Stores/useSubCategoryStore.js';
import { useCategoryStore } from '../Stores/useCategoryStore.js'
import toast from 'react-hot-toast';

function SubCategory() {
  const { categories, fetchCategory } = useCategoryStore()
  const { loading, isFetchingSubCategory, editSubCategory, addSubCategory, subCategories, setIsDeleteModalOpen, isDeleteModalOpen, deleteSubCategory, fetchSubCategory, isAddModalOpen, setIsAddModalOpen } = useSubCategoryStore()

  const [formData, setFormData] = useState({
    name: '',
    image: '',
    categoryIds: []
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const fileInputRef = useRef(null);

  // Add new state for category dropdown
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if(categories.length === 0){
      fetchCategory()
    }
    if(subCategories.length === 0){
      fetchSubCategory()
    }
  }, [fetchCategory,fetchSubCategory])

  if (isFetchingSubCategory) {
    return (<div className="w-[80vw] h-[70vh] flex justify-center items-center">
      <Loader2 size={35} className='text-yellow-500 animate-spin' />
    </div>)
  }

  const handleAdd = () => {
    setFormData({ name: '', image: '', categoryIds: [] });
    setPreviewImage(null);
    setSelectedSubcategory(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (subcategory) => {
    setFormData({
      name: subcategory.name,
      image: subcategory.image,
      categoryIds: [...subcategory.category]
    });
    setPreviewImage(subcategory.image);
    setSelectedSubcategory(subcategory);
    setIsAddModalOpen(true);
  };

  const handleDelete = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsDeleteModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(formData => ({ ...formData, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryToggle = (categoryId) => {
    setFormData(prev => {
      const newCategoryIds = prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId];
      return { ...prev, categoryIds: newCategoryIds };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.categoryIds.length === 0) {
      toast.error('Please select at least one category');
      return;
    }
    const data = new FormData();
    data.append('name', formData.name);
    data.append('Sub-Category', formData.image);
    data.append('category', JSON.stringify(formData.categoryIds));
    if (selectedSubcategory) {
      // Edit Sub-Category
      data.append('_id', selectedSubcategory._id);
      editSubCategory(data)
    } else {
      // Add Sub-Category 
      addSubCategory(data)
    }
  };

  const confirmDelete = () => {
    if (selectedSubcategory) {
      deleteSubCategory(selectedSubcategory._id)
    }
  };

  const filteredSubCategories = subCategories.filter((subcat) => {
    const matchesSearch = subcat.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryFilter
      ? subcat.category.includes(selectedCategoryFilter)
      : true;
    return matchesSearch && matchesCategory;
  })


  return (
    <div className="w-[93vw] lg:w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="lg:text-2xl text-lg font-semibold text-gray-800">Subcategories</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 lg:text-md text-sm text-white px-2 lg:px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Subcategory
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search subcategories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer w-16"
                >
                  <div className="flex items-center gap-2">
                    SN
                  </div>
                </th>
                <th className="px-3 lg:px-16 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                  Image
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Name
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    Categories
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSubCategories.map((subcategory, index) => (
                <tr key={subcategory._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className=" whitespace-nowrap">
                    <div className='w-16 lg:w-40 h-20'>

                      <img
                        src={subcategory.image}
                        alt={subcategory.name}
                        className="w-full h-full rounded-lg object-contain"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {subcategory.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {subcategory.category.map((categoryId) => {
                        const category = categories.find((cat) => cat._id === categoryId);
                        return category ? (
                          <span key={categoryId} className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {category.name}
                          </span>
                        ) : null;
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(subcategory)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(subcategory)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">
                {selectedSubcategory ? 'Edit Subcategory' : 'Add Subcategory'}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories
                </label>
                <div className="relative" ref={dropdownRef}>
                  {/* Selected Categories Tags */}
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
                            <XMark className="w-4 h-4" />
                          </button>
                        </span>
                      ) : null;
                    })}
                    {formData.categoryIds.length === 0 && (
                      <span className="text-gray-500">Select categories...</span>
                    )}
                  </div>

                  {/* Dropdown Menu */}
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
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter subcategory name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory Image
                </label>
                <div className="mt-2 flex flex-col items-center">
                  {previewImage && (
                    <div className="mb-4 relative w-full h-48 ">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Upload className="w-5 h-5" />
                    <span>{previewImage ? 'Change Image' : 'Upload Image'}</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  disabled={loading}
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {loading ? (
                    <Loader className='flex justify-center items-center w-full animate-spin' />
                  ) : (selectedSubcategory ? 'Save Changes' : 'Add Subcategory')}

                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{selectedSubcategory?.name}"?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  {loading ? (
                    <Loader className='flex justify-center items-center w-full animate-spin' />
                  ) : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SubCategory