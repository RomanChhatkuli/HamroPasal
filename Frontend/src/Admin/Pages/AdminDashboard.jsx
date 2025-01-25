import React from 'react';
import { Users, Package, ShoppingBag,Folder, DollarSign } from 'lucide-react';

const stats = [
  { label: 'Total Categories', value: '20', icon: Users, color: 'bg-blue-500' },
  { label: 'Total Subcategories', value: '221', icon: Folder, color: 'bg-red-500' },
  { label: 'Total Products', value: '566', icon: Package, color: 'bg-green-500' },
  { label: 'Total Orders', value: '256', icon: ShoppingBag, color: 'bg-purple-500' },
  { label: 'Total Revenue', value: '$12,456', icon: DollarSign, color: 'bg-yellow-500' },
];

function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Products</h2>
          {/* Add recent products table here */}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          {/* Add recent orders table here */}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard