import SearchBar from '../components/SearchBar'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDown, CircleUserRound, ShoppingCart } from 'lucide-react';
import useMobile from '../Hooks/useMobile.jsx'
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import ForgotPassword from '../pages/ForgotPassword.jsx';
import { useUserStore } from '../stores/useUserStore.js';
import OTPVerication from '../pages/OTPVerication.jsx';
import ResetPassword from '../pages/ResetPassword.jsx';
import AccountMenu from '../components/AccountMenu.jsx';
import MobileAccountMenu from '../components/MobileAccountMenu.jsx';
import { useProductStore } from '../Admin/Stores/useProductStore.js';

function Header() {
  const { isLogin, isOTP, setIsLogin, isMenu, setIsMenu, isMobileMenu, setIsMobileMenu, isSignup, isForgotPassword, isResetPassword, user } = useUserStore();
  const { setInputValue } = useProductStore();

  const [isMobile] = useMobile()
  const location = useLocation()
  const navigate = useNavigate()

  const isSearchPage = location.pathname === '/search'

  return (
    <header className='bg-white lg:h-[80px] mt-2 lg:mt-1 lg:shadow-md sticky top-0 flex items-center mb-1 flex-col z-50 '>
      {!(isMobile && isSearchPage) && (
        <div className='container flex items-center h-full justify-between pr-2 mx-auto mb-1'>
          <div 
          onClick={() =>{
            setInputValue('')
            navigate('/')
          }} 
          className='flex text-2xl lg:text-3xl lg:items-center ml-4 cursor-pointer'>
            <p className='blue-gradient_text font-bold'>Hamro</p>
            <p className='text-yellow-500 font-semibold'>Pasal</p>
          </div>

          <div className='hidden lg:flex flex-1'>
            <SearchBar />
          </div>

          <div className='flex '>
            <button className='lg:hidden mr-2 text-neutral-500' onClick={() => {
              if (!user) {
                setIsLogin(true)
              } else {
                setIsMobileMenu()
              }
            }
            }>
              <CircleUserRound size={27} />
            </button>

            <div className='hidden lg:block'>
              <div className='flex justify-center items-center gap-20 mr-8 ml-3'>
                {!user ? (<button onClick={() => setIsLogin(true)}
                  className='text-lg'>
                  Login
                </button>) : (
                  <div className='relative'>
                    <button
                      onClick={() => setIsMenu(!isMenu)}
                      className="flex items-center gap-2 px-4 py-2 "
                    >
                      <span className=''>My Account</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isMenu ? 'rotate-180' : ''}`} />
                    </button>
                    {isMenu && <AccountMenu />}
                  </div>
                )}


                <button className='flex justify-center items-center gap-2 bg-green-700 h-14 p-3 rounded-lg'>
                  <div>
                    <ShoppingCart className='text-white animate-bounce' />
                  </div>

                  <div className='font-medium text-white flex flex-col justify-center items-center p-2'>
                    <p className='font-semibold'> My Cart</p>
                    {/* <p>1 Items</p>
                    <p>Rs 500</p> */}
                  </div>
                </button>

              </div>
            </div>
          </div>
        </div>

      )}

      {(location.pathname === '/search' || location.pathname === '/') &&
        <div className={`lg:hidden mb-2 mt-2`}>
          <SearchBar />
        </div>
      }
      {isLogin && <Login />}
      {isSignup && <Signup />}
      {isForgotPassword && <ForgotPassword />}
      {isOTP && <OTPVerication />}
      {isResetPassword && <ResetPassword />}
      {isMobileMenu && <MobileAccountMenu />}

    </header>
  )
}

export default Header