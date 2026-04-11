import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../api';

// Admin Views
import DashboardOverview from './views/DashboardOverview';
import ManageProjects from './views/ManageProjects';
import ManageExperiences from './views/ManageExperiences';
import ManageMessages from './views/ManageMessages';
import ManageBlogs from './views/ManageBlogs';

const AdminLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check auth
    const token = localStorage.getItem('portfolio-admin-token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('portfolio-admin-token');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'fas fa-chart-line' },
    { name: 'Projects', path: '/admin/dashboard/projects', icon: 'fas fa-project-diagram' },
    { name: 'Experience', path: '/admin/dashboard/experiences', icon: 'fas fa-briefcase' },
    { name: 'Messages', path: '/admin/dashboard/messages', icon: 'fas fa-envelope' },
    { name: 'Blogs', path: '/admin/dashboard/blogs', icon: 'fas fa-blog' },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden transition-colors duration-300">
      
      {/* Sidebar */}
      <motion.aside 
        className={`bg-white dark:bg-gray-800 w-64 flex-shrink-0 shadow-lg flex flex-col transition-all z-20 ${isSidebarOpen ? '' : '-ml-64 md:ml-0 md:w-20'}`}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
            <h1 className={`font-bold text-xl text-accent truncate ${!isSidebarOpen && 'md:hidden'}`}>Admin Portal</h1>
            {!isSidebarOpen && <i className="fas fa-hammer text-accent text-xl hidden md:block"></i>}
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
              return (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                      isActive 
                      ? 'bg-accent/10 text-accent font-medium' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <i className={`${item.icon} ${!isSidebarOpen && 'md:mx-auto'} text-lg`}></i>
                    <span className={`ml-3 ${!isSidebarOpen && 'md:hidden'}`}>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={handleLogout}
            className={`flex items-center text-red-500 hover:text-red-700 transition w-full px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20`}
          >
            <i className={`fas fa-sign-out-alt ${!isSidebarOpen && 'md:mx-auto'}`}></i>
            <span className={`ml-3 ${!isSidebarOpen && 'md:hidden'}`}>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 z-10">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-gray-500 hover:text-accent dark:text-gray-400 transition">
              View Site <i className="fas fa-external-link-alt ml-1"></i>
            </Link>
          </div>
        </header>

        {/* Dynamic Pages */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/projects" element={<ManageProjects />} />
              <Route path="/experiences" element={<ManageExperiences />} />
              <Route path="/messages" element={<ManageMessages />} />
              <Route path="/blogs" element={<ManageBlogs />} />
            </Routes>
          </div>
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
