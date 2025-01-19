import { ChevronRight, Package } from 'lucide-react';
import React from 'react'

function Order() {
    const orders = [
        {
            id: '1',
            date: '2024-03-15',
            status: 'Delivered',
            total: 129.99,
            items: 3,
        },
        {
            id: '2',
            date: '2024-03-10',
            status: 'In Transit',
            total: 79.99,
            items: 2,
        },
        {
            id: '3',
            date: '2024-03-05',
            status: 'Processing',
            total: 199.99,
            items: 4,
        },
    ];
    return (
        <div className="max-w-3xl bg-white p-5 rounded-lg">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-gray-100 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Package className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="font-medium">Order #{order.id}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-medium">${order.total.toFixed(2)}</p>
                                <p className="text-sm text-gray-500">{order.items} items</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium
                ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                ${order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : ''}
                ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : ''}
              `}>
                                {order.status}
                            </span>
                            <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                View Details
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Order