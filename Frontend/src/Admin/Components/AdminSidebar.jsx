import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, Layers, Grid3X3,ShoppingBag, Package, CloudUpload, Menu, X } from "lucide-react"
import useMobile from "../../Hooks/useMobile"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
  { icon: Layers, label: "Categories", path: "/admin/category" },
  { icon: Grid3X3, label: "Subcategories", path: "/admin/sub-category" },
  { icon: ShoppingBag, label: "Orders", path: "/admin/order" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: CloudUpload, label: "Upload Product", path: "/admin/upload-product" },
]

function AdminSidebar() {
  const location = useLocation()
  const pathname = location.pathname
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile] = useMobile(1024)

  const toggleSidebar = () => setIsOpen(!isOpen)

  const SidebarContent = () => (
    <div className="fixed top-0 left-0 h-full w-[250px] flex-col bg-white overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <Link to="/" className="flex text-2xl lg:text-3xl lg:items-center">
          <p className="blue-gradient_text font-bold">Hamro</p>
          <p className="text-yellow-500 font-semibold">Pasal</p>
        </Link>
        {isMobile && (
          <button onClick={toggleSidebar} className="lg:hidden">
            <X className="h-6 w-6" />
          </button>
        )}
      </div>

      <nav className="mt-4 lg:mt-8 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-4 text-gray-700 hover:bg-gray-100 ${
                isActive ? "bg-gray-100 border-r-4 border-blue-500" : ""
              }`}
              onClick={() => isMobile && setIsOpen(false)}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button onClick={toggleSidebar} className="fixed top-2 left-4 z-20 lg:hidden bg-white p-2 rounded-md shadow-md">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </button>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleSidebar}
        >
          <div
            className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="hidden lg:block w-64 bg-white h-screen shadow-lg">
          <SidebarContent />
        </div>
      )}
    </>
  )
}

export default AdminSidebar