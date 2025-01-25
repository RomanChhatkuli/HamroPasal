import React, { useState, useRef, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Loader2, Loader } from 'lucide-react';
import { useCategoryStore } from '../Stores/useCategoryStore.js';

export default function Categories() {
  const { fetchCategory, isFetching, categories, deleteCategory, addCategory, editCategory, loading, isDeleteModalOpen, setIsDeleteModalOpen, isAddModalOpen, setIsAddModalOpen } = useCategoryStore()

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', image: null });
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchCategory()
  }, [])

  if (isFetching) {
    return (<div className="w-[80vw] h-[70vh] flex justify-center items-center">
      <Loader2 size={35} className='text-yellow-500 animate-spin' />
    </div>)
  }

  const handleAdd = () => {
    setFormData({ name: '', image: '' });
    setPreviewImage(null);
    setSelectedCategory(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, image: category.image });
    setPreviewImage(category.image);
    setSelectedCategory(category);
    setIsAddModalOpen(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('category', formData.image);
    data.append('name', formData.name);
    if (selectedCategory) {
      data.append('_id', selectedCategory._id);
      // Edit existing category
      editCategory(data)
    } else {
      // Add new category
      addCategory(data)
    }
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      deleteCategory(selectedCategory._id)
    }
  };

  return (
    <div >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {categories.map((category) => (
          <div key={category._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
            <div className="relative h-44">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-800 ">{category.name}</h3>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => handleEdit(category)}
                  className=" text-blue-500 hover:bg-blue-50 rounded transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category)}
                  className=" text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-semibold">
                {selectedCategory ? 'Edit Category' : 'Add Category'}
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
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image
                </label>
                <div className="mt-2 flex flex-col items-center">
                  {previewImage && (
                    <div className="mb-4 relative w-full h-48">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
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
              <div className="flex justify-center ">
                <button
                  type="submit"
                  className="w-40 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  {loading ? (
                    <Loader className='flex justify-center items-center w-full animate-spin' />
                  ) : (selectedCategory ? 'Save Changes' : 'Add Category')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete "{selectedCategory?.name}"?
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