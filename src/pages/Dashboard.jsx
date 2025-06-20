import React, { useState, useEffect } from 'react';
import Dashmain from './Dashmain';
import Projectlog from './Projectlog';
import Settings from './Settings';
import { FaTachometerAlt, FaFileAlt, FaCogs, FaAngleDown } from 'react-icons/fa';
import logo from '../assets/logo.jpeg'
import { useNavigate } from 'react-router-dom'; 
import ViewLogs from './ViewLogs';
import { useLocation } from 'react-router-dom';

const Dashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [reportDropdownOpen, setReportDropdownOpen] = useState(false);


  const navigate = useNavigate(); 
  const location = useLocation(); 

  useEffect(() => {
    if (location.pathname === '/logs' && location.state?.awc) {
      setActiveTab('viewlogs');
    }
  }, [location]);
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashmain />;
      case 'logs':
        return <Projectlog />;
      case 'viewlogs':
        return <ViewLogs />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashmain />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case '1':
        return 'Administrator';
      case '2':
        return 'Supervisor';
      case '3':
        return 'Viewer';
      default:
        return 'Administrator'; 
    }
  };


  const handleLogout = async () => {
    const token = localStorage.getItem('accessToken');

    try {
      if (token) {
        const response = await fetch('http://monitoring.mashmari.in:8000/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        });

       
        if (response.ok) {
          console.log("Logout success");
        } else {
          console.warn("Logout failed on server, clearing token anyway");
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken'); 
      navigate('/'); 
    }
  };



  const userRole = '1';
  return (
    <div className="min-h-screen flex flex-col md:flex-row">


      {/* Sidebar - Fixed for Desktop */}
      <div className="hidden md:flex flex-col w-64 bg-white text-gray-800 shadow-md fixed h-screen">
        <div className="flex items-center justify-center gap-2 h-16 border-b px-4">
          <img src={logo} alt="Mashmari Logo" className="h-40 w-40 object-contain" />
          </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto border-r">

          <button
            // onClick={() => setActiveTab('dashboard')}
            onClick={() => {
              navigate('/dashboard'); 
              setActiveTab('dashboard'); 
            }}
            className={`block text-left font-medium w-full px-4 py-2 ${activeTab === 'dashboard'
              ? 'bg-[#4c0b4d] text-white'
              : 'text-black hover:text-[#4a044e]'
              }`}
          >
            <span className="flex items-center gap-2">
              <FaTachometerAlt className={`${activeTab === 'dashboard' ? 'text-white' : 'text-[#4a044e]'}`} />
              Dashboard
            </span>
          </button>


          {/* Reports Dropdown */}
          <div>
            <button
              onClick={() => setReportDropdownOpen(!reportDropdownOpen)}
              className="block text-left w-full px-4 py-2 font-medium hover:text-[#4a044e] flex justify-between items-center"
            >
              <span className="flex items-center gap-2">
                <FaFileAlt className="text-[#4a044e]" />
                Center Wise Log
              </span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${reportDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {reportDropdownOpen && (
              <div className="ml-4 mt-1 space-y-1">
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`block text-left w-full px-4 py-2 text-sm ${activeTab === 'logs'
                    ? 'bg-[#4c0b4d] text-white'
                    : 'text-black hover:text-[#4a044e]'
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <FaFileAlt className={`${activeTab === 'logs' ? 'text-white' : 'text-[#4a044e]'}`} />
                    Projector Logs
                  </span>
                </button>

              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('settings')}
            className={`block font-medium text-left w-full px-4 py-2 ${activeTab === 'settings'
              ? 'bg-[#4c0b4d] text-white'
              : 'text-black hover:text-[#4a044e]'
              }`}
          >
            <span className="flex items-center gap-2">
              <FaCogs className={`${activeTab === 'settings' ? 'text-white' : 'text-[#4a044e]'}`} />
              Settings
            </span>
          </button>

        </nav>
        <div className="mt-auto px-4 pb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-10V5m-6 5h.01" />
            </svg>
            Logout
          </button>
        </div>

      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden bg-white text-gray-800 w-full shadow-md">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="text-xl font-bold text-[#701a75]">Mashmari</div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="focus:outline-none">
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="bg-gray-100 border-t">
            <button
              onClick={() => { setActiveTab('dashboard'); setMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 hover:text-[#4a044e]"
            >
              Dashboard
            </button>

            <div>
              <button
                onClick={() => setReportDropdownOpen(!reportDropdownOpen)}
                className="w-full text-left px-4 py-2 hover:text-[#4a044e] flex justify-between items-center"
              >
                Center Wise Log
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${reportDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {reportDropdownOpen && (
                <div className="ml-4">
                  <button
                    onClick={() => { setActiveTab('logs'); setMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-sm hover:text-[#4a044e]"
                  >
                    Projector Logs
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => { setActiveTab('settings'); setMenuOpen(false); }}
              className="block w-full text-left px-4 py-2 hover:text-[#4a044e]"
            >
              Settings
            </button>
          </div>
        )}

      </div>


      {/* Main Content Area */}
      <div className="md:ml-64 flex-1 flex flex-col min-h-screen">

        {/* Topbar - Sticky */}
        <div className="bg-white px-6 py-4 text-black sticky top-0 z-10 border-b flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#4c0b4d]">Mashmari Doot Monitoring</h1>

          <div className="flex flex-col-reverse items-end md:flex-row md:items-center gap-1 md:gap-2">
            <span className="text-sm font-medium text-gray-800 text-right md:text-left">
              Welcome, {getRoleLabel(userRole)}
            </span>
            <div className="w-9 h-9 rounded-full bg-[#4c0b4d] text-white flex items-center justify-center font-semibold">
              A
            </div>
          </div>


        </div>


        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#f7f7f7]">
          {renderContent()}
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
