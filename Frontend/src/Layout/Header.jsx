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
import CartDrawer from '../components/CartDrawer.jsx';
import { useDisclosure } from '@mantine/hooks';
import { useCartStore } from '../stores/useCartStore.js';
import { totalPriceWithDiscount } from '../utils/CartProductPrice.js';
import MobileCart from '../components/MobileCart.jsx';

function Header() {
  const { isLogin, isOTP, setIsLogin, isMenu, setIsMenu, isMobileMenu, setIsMobileMenu, isSignup, isForgotPassword, isResetPassword, user } = useUserStore();
  const { setInputValue } = useProductStore();
  const { cartProducts } = useCartStore()
  const [opened, { open, close }] = useDisclosure(false);

  const [isMobile] = useMobile()
  const location = useLocation()
  const navigate = useNavigate()

  const isSearchPage = location.pathname === '/search'

  return (
    <header className='bg-white lg:h-[80px] mt-2 lg:mt-1 lg:shadow-md sticky top-0 flex items-center mb-1 flex-col z-50 '>
      {!(isMobile && isSearchPage) && (
        <div className='container flex items-center h-full justify-between pr-2 mx-auto mb-1'>
          <div
            onClick={() => {
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


                <button
                  onClick={() => open()}
                  className='flex justify-center items-center gap-2 bg-[#318616] h-14 w-28 rounded-lg'
                >
                  <div>
                    <ShoppingCart className='text-white animate-bounce' />
                  </div>

                  <div
                    className='text-sm font-semibold text-white flex flex-col justify-center items-center'
                  >
                    {cartProducts.length ?
                      <div>
                        <p>{cartProducts.length} Items</p>
                        <p>Rs.{totalPriceWithDiscount(cartProducts)}</p>
                      </div>
                      :
                      <p className='font-semibold'> My Cart</p>
                    }
                  </div>
                </button>

              </div>
            </div>
          </div>
        </div>

      )}

      {(location.pathname === '/search' || location.pathname === '/') &&
        <div className={`lg:hidden mb-2 mt-2 scale-x-[1.2] scale-y-110`}>
          <SearchBar />
        </div>
      }
      {isLogin && <Login />}
      {isSignup && <Signup />}
      {isForgotPassword && <ForgotPassword />}
      {isOTP && <OTPVerication />}
      {isResetPassword && <ResetPassword />}
      {isMobileMenu && <MobileAccountMenu />}
      <CartDrawer opened={opened} close={close} />
      {(cartProducts.length > 0 && location.pathname != '/checkout') &&
        <div onClick={open} >
          <MobileCart />
        </div>
      }

    </header>
  )
}

export default Header