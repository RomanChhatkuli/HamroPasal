import { Outlet } from 'react-router-dom'
import Header from './Layout/Header'
import Footer from './Layout/Footer'
import { Toaster } from 'react-hot-toast'


function App() {

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