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

function Router() {
  const { user, checkAuth, checkingAuth } = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <Loader2 size={35} className='text-yellow-500 animate-spin' />;
    </div>
  )
  return (
    <div>

      <Routes>

        <Route path='/' element={<App />}>

          <Route index element={<Home />} />
          <Route path='search' element={<SearchPage />} />

          <Route path='dashboard' element={user ? <Dashboard /> : <Home/>} >
            <Route path='profile' element={<Profile />} />
            <Route path='order' element={<Order />} />
          </Route>

        </Route>

      </Routes>
    </div>
  )
}

export default Router