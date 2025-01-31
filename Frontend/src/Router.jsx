import React, { useEffect } from 'react'
import App from './App.jsx'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SearchPage from './pages/SearchPage.jsx'
import Dashboard from './Layout/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import Order from './pages/Order.jsx'
import { useUserStore } from './stores/useUserStore.js'
import { Loader2 } from 'lucide-react'
import Products from './Admin/Pages/Products.jsx'
import SubCategory from './Admin/Pages/SubCategory.jsx'
import Category from './Admin/Pages/Category.jsx'
import UploadProduct from './Admin/Pages/UploadProduct.jsx'
import AdminDashboard from './Admin/Pages/AdminDashboard.jsx'
import Admin from './Admin/Admin.jsx'
import ProductList from './pages/ProductList.jsx'
import ProductDisplayPage from './pages/ProductDisplayPage.jsx'

function Router() {
  const { user, checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <Loader2 size={35} className='text-yellow-500 animate-spin' />
    </div>
  )
  return (
    <div>

      <Routes>
        <Route path='/' element={<App />}>

          <Route index element={<Home />} />
          <Route path='search' element={<SearchPage />} />

          <Route path='dashboard' element={user ? <Dashboard /> : <Home />} >
            <Route path='profile' element={<Profile />} />
            <Route path='order' element={<Order />} />
          </Route>
          
          <Route path=':categoryName/:categoryId/:subcategoryName/:subcategoryId' element={<ProductList />} />
          
        </Route>
          <Route path='product/:name/:id' element={<ProductDisplayPage />} />



        <Route path='admin' element={<Admin />} >
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='category' element={<Category />} />
          <Route path='sub-category' element={<SubCategory />} />
          <Route path='products' element={<Products />} />
          <Route path='upload-product' element={<UploadProduct />} />
        </Route>

      </Routes>
    </div>
  )
}

export default Router