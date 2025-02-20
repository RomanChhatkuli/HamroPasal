import { Timer, ChevronRight, FileText, Truck, ShoppingBag } from 'lucide-react';
import { Button, Drawer } from '@mantine/core';
import { useCartStore } from '../stores/useCartStore.js';
import { totalPriceWithDiscount, totalPriceWithoutDiscount } from '../utils/CartProductPrice.js';
import AddToCartButton from './AddToCartButton.jsx';
import { pricewithDiscount } from '../utils/pricewithDiscount.js';
import emptyCart from '../assets/emptyCart.webp'
import { useUserStore } from '../stores/useUserStore.js';
import { useNavigate } from 'react-router-dom';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees.js';

function CartDrawer({ opened, close }) {
    const { cartProducts } = useCartStore();
    const { user, setIsLogin } = useUserStore()
    const navigate = useNavigate()

    let total;
    const deliveryCharge = 25;
    const handlingCharge = 15;
    const priceWithDiscount = totalPriceWithDiscount(cartProducts)
    const priceWithoutDiscount = totalPriceWithoutDiscount(cartProducts)
    const saved = Number(priceWithoutDiscount.replace(/,/g, '')) - Number(priceWithDiscount.replace(/,/g, ''));
    if (Number(priceWithDiscount.replace(/,/g, '')) > 99) {
        total = Number(priceWithDiscount.replace(/,/g, '')) + handlingCharge;
    } else {
        total = Number(priceWithDiscount.replace(/,/g, '')) + handlingCharge + deliveryCharge;
    }

    return (
        <div className='relative'>
            <Drawer
                opened={opened}
                onClose={close}
                position='right'
                size={400}
                title={<p className='font-semibold text-xl'>My Cart</p>}
            >
                {cartProducts.length ?
                    <div className="max-h-screen  scroll-auto">
                        {saved > 20 &&
                            <div className='flex justify-between items-center px-3 py-2 mb-2 rounded-2xl text-sm bg-blue-100 font-semibold text-[#256fef]'>
                                <p>Your total savings</p>
                                <p>Rs.{saved}</p>
                            </div>
                        }

                        <div className="max-w-2xl mx-auto bg-white ">
                            <div className="p-3 bg-gray-50 flex items-center gap-3">
                                <Timer className="text-green-600" size={30} />
                                <div className="text-sm text-gray-600 flex flex-col">
                                    <span className="font-medium text-black">Delivery in 10 minutes</span>
                                    Shipment of {cartProducts.length} items
                                </div>
                            </div>

                            <div className="p-1 mb-2">
                                {cartProducts.map((product, index) => (
                                    <div key={index} className="flex gap-4 mt-3">
                                        <img
                                            src={product?.image?.[0]}
                                            alt={product?.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-xs font-medium">{product?.name}</h3>
                                            <p className="text-sm text-gray-500">{product?.unit}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="font-semibold text-xs">Rs.{pricewithDiscount(product?.price, product?.discount)}</span>
                                                {product?.price > pricewithDiscount(product?.price, product?.discount) && (
                                                    <span className="text-gray-500 line-through text-xs">Rs.{product?.price}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className='flex items-center'>
                                            <AddToCartButton product={product} />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 border-t">
                                <h2 className="font-semibold mb-2">Bill details</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1">
                                            <FileText size={15} />
                                            <span>Items total</span>
                                            {saved > 0 && (
                                                <span className="text-[9px] bg-blue-100 px-1 mt-1 rounded-md font-normal text-blue-600">Saved Rs.{saved}</span>
                                            )}
                                        </div>
                                        <div>
                                            {saved > 0 &&
                                                <span className="line-through text-gray-400 mr-2 text-sm">Rs.{priceWithoutDiscount}</span>
                                            }
                                            <span className='text-sm'>Rs.{priceWithDiscount}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-1">
                                            <Truck size={15} />
                                            <span>Delivery charge</span>
                                        </div>
                                        <div>
                                            {Number(priceWithDiscount.replace(/,/g, '')) > 99 ?
                                                <div>
                                                    <span className="line-through text-gray-400 mr-2">Rs.{deliveryCharge}</span>
                                                    <span className="text-green-600">FREE</span>
                                                </div>
                                                :
                                                <div>
                                                    <span>Rs.{deliveryCharge}</span>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-1">
                                            <ShoppingBag size={15} />
                                            <span>Handling charge</span>
                                        </div>
                                        <span>Rs.{handlingCharge}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t">
                                <div className=" px-3 py-1 mb-1 flex justify-between items-center font-semibold text-sm">
                                    <span>Grand total</span>
                                    <span>Rs.{DisplayPriceInRupees(total)}</span>
                                </div>
                            

                            </div>
                            <div className="p-4 border-t">
                                <h3 className="font-semibold mb-2">Cancellation Policy</h3>
                                <p className="text-sm text-gray-600">
                                    Orders cannot be cancelled once packed for delivery. In case of
                                    unexpected delays, a refund will be provided, if applicable.
                                </p>
                            </div>

                            <div className="sticky bottom-0 bg-white border-t py-4 px-2 ">
                                <div className="flex justify-between items-center ">
                                    <button className="bg-[#0C831F] text-white px-1 py-1 rounded-lg flex items-center gap-28">
                                        <div className='w-20'>
                                            <span className="font-semibold text-sm">Rs.{total}</span>
                                            <div className="text-sm">TOTAL</div>
                                        </div>
                                        <div className='flex items-center w-36'>
                                            {!user ?
                                                <p
                                                    onClick={() => {
                                                        close()
                                                        setIsLogin(true)
                                                    }}
                                                    className='text-base'
                                                >
                                                    Login to Proceed
                                                </p>
                                                :
                                                <p className='ml-12'
                                                onClick={() => {
                                                    close()
                                                    navigate('/checkout')
                                                }}
                                                >
                                                    Proceed
                                                </p>
                                            }
                                            <ChevronRight size={20} />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div>
                        <img src={emptyCart} alt="EmptyCart" />
                        <div className='flex justify-center items-center mt-2' onClick={close}>
                            <Button variant='outline' color='#0C831F' onClick={() => navigate('/')}>
                                Shop Now
                            </Button>
                        </div>
                    </div>
                }

            </Drawer>
        </div>
    );
}

export default CartDrawer






