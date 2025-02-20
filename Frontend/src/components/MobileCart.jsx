import { ShoppingCart, ChevronRight } from 'lucide-react'
import React from 'react'
import { totalPriceWithDiscount } from '../utils/CartProductPrice'
import { useCartStore } from '../stores/useCartStore.js'

const MobileCart = () => {
    const { cartProducts } = useCartStore();

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0C831F] shadow-black shadow-2xl lg:hidden m-3 rounded-lg">
            <div className="flex items-center justify-between px-3 py-1.5">
                <div className="flex items-center space-x-3 text-white">
                    <ShoppingCart className="w-6 h-6 animate-bounce" />
                    <div className='flex flex-col'>
                        <span className="text-sm">{cartProducts.length} Items</span>
                        <span className="text-sm">Rs.{totalPriceWithDiscount(cartProducts)}</span>
                    </div>
                </div>
                <div
                    className=" text-white rounded-md flex justify-center items-center"
                >
                    View Cart
                    <ChevronRight className="w-5 h-5" />
                </div>
            </div>
        </div>
    )
}

export default MobileCart