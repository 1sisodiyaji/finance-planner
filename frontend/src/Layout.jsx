import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartPieIcon,
  ChevronLeftIcon,
  SwatchIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useTheme, themes } from './context/ThemeContext';


const Layout = ({component}) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isThemeDropdownOpen, setThemeDropdownOpen] = useState(false);
    const location = useLocation();
    const { theme, setTheme, currentTheme } = useTheme();
  
    const menuItems = [
      { path: '/', icon: HomeIcon, label: 'Dashboard' },
      { path: '/loans', icon: CreditCardIcon, label: 'Loans' },
      { path: '/expenses', icon: BanknotesIcon, label: 'Expenses' },
      { path: '/reports', icon: ChartPieIcon, label: 'Reports' },
    ];
  
    const sidebarVariants = {
      open: {
        width: "240px",
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30
        }
      },
      closed: {
        width: "80px",
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30
        }
      }
    };
  return (
    <div className="flex">
    {/* Sidebar */}
    <motion.nav
      variants={sidebarVariants}
      initial="open"
      animate={isSidebarOpen ? "open" : "closed"}
      className={`fixed top-0 left-0 bottom-0 bg-gradient-to-b ${theme.primary} text-white z-40`}
    >
      <div className="flex flex-col h-full">
        <div className={`flex items-center p-6 ${!isSidebarOpen && 'justify-center'}`}>
          {isSidebarOpen ? (
            <h1 className="text-2xl font-bold">CraftFossLabs</h1>
          ) : (
            <h1 className="text-2xl font-bold">CFL</h1>
          )}
        </div>

        <div className="flex flex-col flex-grow">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
              >
                <motion.div
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center px-6 py-3 transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  {isSidebarOpen && <span className="ml-4">{item.label}</span>}
                </motion.div>
              </Link>
            );
          })}
        </div>

        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-4 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <motion.div
            animate={{ rotate: isSidebarOpen ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </motion.div>
        </button>
      </div>
    </motion.nav>

    {/* Top Bar */}
    <div className={`fixed top-0 right-0 h-16 bg-white shadow-sm z-30 flex items-center justify-end px-6 ${isSidebarOpen ? 'left-60' : 'left-20'}`}>
      <div className="flex items-center space-x-4">
        {/* Theme Selector */}
        <div className="relative">
          <button
            onClick={() => setThemeDropdownOpen(!isThemeDropdownOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
          >
            <SwatchIcon className={`w-6 h-6 ${theme.highlight}`} />
            {isThemeDropdownOpen ? (
              <ChevronDownIcon className="w-4 h-4 transform rotate-180" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
          </button>

          <AnimatePresence>
            {isThemeDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
              >
                {Object.entries(themes).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setTheme(key);
                      setThemeDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left flex items-center space-x-2 hover:bg-gray-100 ${
                      currentTheme === key ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full ${value.secondary}`} />
                    <span className="text-sm text-gray-700">{value.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${theme.primary} flex items-center justify-center`}>
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="Avatar"
              className="w-9 h-9 rounded-full bg-white"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Main content padding */}
    <div className={`flex-1 ${isSidebarOpen ? 'ml-60' : 'ml-20'} mt-16 p-6 transition-all duration-300`}>
      {component}
    </div>
  </div>
  )
}

export default Layout