import React, { useEffect } from 'react'
import App from './App.jsx'
import { Route, Routes, useNavigate } from 'react-router-dom'
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
import NotFoundPage from './components/NotFoundPage.jsx'
import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';
import CheckoutPage from './pages/CheckoutPage.jsx'
import AddressPage from './components/AddressPage.jsx'
import PaymentStatusPage from './pages/PaymentStatusPage.jsx'
import AdminOrders from './Admin/Pages/AdminOrders.jsx'
import Unauthorized from './pages/Unauthorized.jsx'

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
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <div>

        <Routes>
          <Route path='/' element={<App />}>

            <Route index element={<Home />} />
            <Route path='search' element={<SearchPage />} />

            <Route path='dashboard' element={user ? <Dashboard /> : <Unauthorized />} >
              <Route path='profile' element={<Profile />} />
              <Route path='address' element={<AddressPage />} />
              <Route path='order' element={<Order />} />
            </Route>

            <Route path='checkout' element={user ? <CheckoutPage /> : <Unauthorized />} />
            <Route path='payment' element={user ? <PaymentStatusPage /> : <Unauthorized />} />
          </Route>

          <Route path=':categoryName/:categoryId/:subcategoryName/:subcategoryId' element={<ProductList />} />
          <Route path='product/:name/:id' element={<ProductDisplayPage />} />

          {/*For only allowing admin to view these pages use  user?.role === 'ADMIN' */}
          <Route path='admin' element={user ? <Admin /> : <Unauthorized />} >
            <Route path='dashboard' element={<AdminDashboard />} />
            <Route path='category' element={<Category />} />
            <Route path='sub-category' element={<SubCategory />} />
            <Route path='products' element={<Products />} />
            <Route path='order' element={<AdminOrders />} />
            <Route path='upload-product' element={<UploadProduct />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />

        </Routes>
      </div>
    </MantineProvider>
  )
}

export default Router