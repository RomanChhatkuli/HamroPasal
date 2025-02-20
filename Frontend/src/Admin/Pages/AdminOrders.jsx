import React, { useEffect, useState } from 'react';
import { Package2, Truck, CreditCard, MapPin, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';
import { useOrderStore } from '../../stores/useOrderStore.js';
import { pricewithDiscount } from '../../utils/pricewithDiscount.js';
import { DisplayPriceInRupees } from '../../utils/DisplayPriceInRupees.js';

const ORDER_STATUSES = ["Order Processing", "Shipped", "Delivered", "Cancelled"];

function OrderStatusBadge({ status, onStatusChange, isExpanded }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <div
                className={`px-3 py-1.5 text-xs font-medium rounded-full inline-flex items-center gap-1
                    ${status === "Cancelled" ? "bg-red-100 text-red-800" :
                        status === "Delivered" ? "bg-green-100 text-green-800" :
                            status === "Shipped" ? "bg-purple-100 text-purple-800" :
                                "bg-blue-100 text-blue-800"}
                    ${isExpanded ? 'cursor-pointer' : 'cursor-not-allowed opacity-80'}`}
                onClick={(e) => {
                    if (isExpanded) {
                        e.stopPropagation();
                        setIsOpen(!isOpen);
                    }
                }}
            >
                {status}
                {isExpanded && <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
            </div>

            {isOpen && isExpanded && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1">
                    {ORDER_STATUSES.map((orderStatus) => (
                        <button
                            key={orderStatus}
                            onClick={(e) => {
                                e.stopPropagation();
                                onStatusChange(orderStatus);
                                setIsOpen(false);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100
                                ${status === orderStatus ? 'bg-gray-50' : ''}`}
                        >
                            {orderStatus}
                        </button>
                    ))}
                </div>
            )}
        </div>
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
                <h3 className="text-xs lg:text-sm font-medium text-gray-900">{item.name}</h3>
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
    const { editOrders } = useOrderStore();

    const handleStatusChange = async (newStatus) => {
        editOrders(order._id, newStatus);
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Order Header - Always visible */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Package2 size={16} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">{order.orderId}</span>
                    </div>
                    <OrderStatusBadge 
                        status={order.order_status} 
                        onStatusChange={handleStatusChange}
                        isExpanded={isExpanded}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                        <span>Placed on: {new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center gap-1 text-xs text-gray-500"
                    >
                        <span>Rs.{DisplayPriceInRupees(order.totalPrice)}</span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
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
                        <div className="flex justify-between items-center">
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
                            <MapPin size={14} className="mt-1" />
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

function AdminOrders() {
    const { adminOrders, getOrdersAdmin } = useOrderStore();

    useEffect(() => {
        getOrdersAdmin();
    }, []);

    return (
        <div className="max-w-6xl min-h-[78vh] bg-gray-50 mt-2 lg:p-5 rounded-lg">
            <h1 className="text-xl font-semibold text-gray-900 mb-4">Manage Orders</h1>
            <div className="flex flex-col gap-3 pr-2">
                {adminOrders.map((order) => (
                    <OrderCard 
                        key={order._id} 
                        order={order} 
                    />
                ))}
                {!adminOrders.length &&
                    <div className="mt-48 w-full flex justify-center items-center font-bold text-xl">
                        No Orders
                    </div>
                }
            </div>
        </div>
    );
}

export default AdminOrders;