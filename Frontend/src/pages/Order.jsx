import React, { useEffect } from 'react'
import { Package2, Truck, CreditCard, MapPin, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { useOrderStore } from '../stores/useOrderStore.js';
import { pricewithDiscount } from '../utils/pricewithDiscount.js';
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees.js';

function OrderStatusBadge({ status }) {
    return (
        <span 
        className={`px-3 py-1.5 text-xs font-medium rounded-full inline-flex items-center gap-1
            ${status === "Cancelled" ? "bg-red-100 text-red-800" :
                status === "Delivered" ? "bg-green-100 text-green-800" :
                    status === "Shipped" ? "bg-purple-100 text-purple-800" :
                        "bg-blue-100 text-blue-800"}
                `}
        >
            {status}
        </span>
    );
}

function OrderItem({ item }) {
    return (
        <div className="flex items-start gap-3 py-2">
            <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                <div className="mt-1 text-xs text-gray-500">
                    <span>Qty: {item.qty}</span>
                    <span className="mx-1">•</span>
                    <span>Rs.{pricewithDiscount(item.price, item.discount)}</span>
                </div>
            </div>
            <div className="text-sm font-medium text-gray-900">
                Rs.{item.qty * pricewithDiscount(item.price, item.discount)}
            </div>
        </div>
    );
}

function OrderCard({ order }) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Order Header - Always visible */}
            <div className="p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Package2 size={16} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">{order.orderId}</span>
                    </div>
                    <OrderStatusBadge status={order.order_status} />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Placed on: {new Date(order.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center gap-1">
                        <span>Rs.{DisplayPriceInRupees(order.totalPrice)}</span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                </div>
            </div>

            {/* Expandable Content */}
            {isExpanded && (
                <>
                    {/* Order Items */}
                    <div className="px-4 py-2 border-t border-gray-100">
                        <div className="space-y-2">
                            {order.orderItems.map((item, index) => (
                                <OrderItem key={index} item={item} />
                            ))}
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="p-4 bg-gray-50 text-xs space-y-2">

                        <div className="flex justify-between items-center ">
                            <div className="flex items-center gap-1 text-gray-600">
                                <ShoppingBag size={15} />
                                <span>Handling charge</span>
                            </div>
                            <span>Rs.15</span>
                        </div>

                        <div className="flex items-center justify-between gap-2 text-gray-600">
                            <div className="flex items-center gap-1">
                                <Truck size={15} />
                                <span>Delivery charge</span>
                            </div>
                            <div>
                                {order.totalPrice > 124 ?
                                    <div>
                                        <span className="line-through text-gray-400 mr-2">Rs.25</span>
                                        <span className="text-green-600">FREE</span>
                                    </div>
                                    :
                                    <div>
                                        <span>Rs.25</span>
                                    </div>
                                }
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                            <CreditCard size={14} />
                            <span>{order.paymentMethod}</span>
                        </div>

                        <div className="flex gap-2 text-gray-600">
                            <MapPin size={14} className='mt-1' />
                            <div>
                                <p className="font-medium">{order.shippingAddress.recipient_name}</p>
                                <p>{order.shippingAddress.address_line}, {order.shippingAddress.localPlace}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
                                <p>Mobile: {order.shippingAddress.mobile}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

function Order() {
    const { Orders, getOrders } = useOrderStore()

    useEffect(() => {
        getOrders();
    }, [])
    return (
        <div className="max-w-6xl min-h-[78vh] bg-gray-50 mt-2 p-2 lg:p-5 rounded-lg">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">My Orders</h1>
            <div className="  flex flex-col gap-3 pr-2">
                {Orders.map((order) => (
                    <OrderCard key={order._id} order={order} />
                ))}
                {!Orders.length &&
                    <div className='mt-48 w-full flex justify-center items-center font-bold text-xl'>No Orders</div>
                }
            </div>
        </div>
    );
}

export default Order