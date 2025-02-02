import { Outlet } from 'react-router-dom'
import Header from './Layout/Header'
import Footer from './Layout/Footer'
import { Toaster } from 'react-hot-toast'
import { useCategoryStore } from './Admin/Stores/useCategoryStore'
import { useSubCategoryStore } from './Admin/Stores/useSubCategoryStore'
import { useProductStore } from './Admin/Stores/useProductStore'
import { useEffect } from 'react'

function App() {
  const { fetchCategory } = useCategoryStore()
  const {  fetchSubCategory } = useSubCategoryStore()
  const { fetchProduct } = useProductStore()

  useEffect(() => {
    fetchCategory()
    fetchSubCategory()
    fetchProduct()
  }, [fetchCategory, fetchSubCategory, fetchProduct])

  return (
    <div>
      <Toaster />
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default App