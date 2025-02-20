import React, { useEffect } from 'react';
import { Users, Package, Layers, ShoppingBag, Folder, DollarSign } from 'lucide-react';
import { useCategoryStore } from '../Stores/useCategoryStore';
import { useSubCategoryStore } from '../Stores/useSubCategoryStore'
import { useProductStore } from '../Stores/useProductStore'
import { useOrderStore } from '../../stores/useOrderStore';
import { DisplayPriceInRupees } from '../../utils/DisplayPriceInRupees.js'
import { useUserStore } from '../../stores/useUserStore.js';

function AdminDashboard() {

  const { categories } = useCategoryStore()
  const {  subCategories } = useSubCategoryStore()
  const { products } = useProductStore()
  const { adminOrders,getOrdersAdmin } = useOrderStore()
  const { adminUser, getAdminUser } = useUserStore()
 
  useEffect(() => {
    getOrdersAdmin()
    getAdminUser()
  },[])

  const totalCategories = categories.length
  const totalSubCategories = subCategories.length
  const totalProducts = products.length
  const totalOrders = adminOrders.length
  const totalRevenue = adminOrders.reduce((acc, order) => acc + order.totalPrice, 0);
  const totalUser = adminUser.length
 

  const stats = [
    { label: 'Total Users', value: totalUser, icon: Users, color: 'bg-gray-500' },
    { label: 'Total Categories', value: totalCategories, icon: Layers, color: 'bg-blue-500' },
    { label: 'Total Subcategories', value: totalSubCategories, icon: Folder, color: 'bg-red-500' },
    { label: 'Total Products', value: totalProducts, icon: Package, color: 'bg-green-500' },
    { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'bg-purple-500' },
    { label: 'Total Revenue', value: `Rs.${DisplayPriceInRupees(totalRevenue)}`, icon: DollarSign, color: 'bg-yellow-500' },
  ];

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
    </div>
  );
}

export default AdminDashboard