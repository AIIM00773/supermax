import React, { useState } from 'react';
import Sidebar from "../../components/StoreManager/sidebar";
import Overview from "../../components/StoreManager/overview";
import Approvals from "../../components/StoreManager/approvals";
import StoreBroadcasts from "../../components/StoreManager/broadcasts";
import StaffRoster from "../../components/StoreManager/stuff"; 
import { useUser } from "../../contexts/user"; 

import { 
  LayoutDashboard, 
  ShieldCheck, 
  Users, 
  Megaphone,
  Menu,
  Bell,
  ShieldAlert,
  Store,
  ChevronRight
} from 'lucide-react';

export default function StoreManagerDashboard() {
  const { user, is_authenticated } = useUser();

  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarIsOpen, setSidebarIsOpen] = useState(true);

  // Navigation Items Specification
  const navigationItems = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'approvals', label: 'Pending Approvals', icon: ShieldCheck, count: 3 },
    { id: 'announcements', label: 'Store Broadcasts', icon: Megaphone },
    { id: 'staff_logs', label: 'Staff Roster & Duty', icon: Users }
  ];

  // Access Clearance Guard
  if (!is_authenticated || user?.role !== "Store Manager") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700/80 rounded-2xl p-8 text-center shadow-2xl animate-fade-in">
          <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-extrabold text-white mb-2 tracking-tight">Access Restricted</h1>
          <p className="text-slate-400 text-xs leading-relaxed mb-6">
            You lack operational clearance for the <strong className="text-slate-200">Store Manager Tower</strong>. Please log in with authorized manager credentials.
          </p>
          <button 
            type="button"
            onClick={() => window.location.href = '/login'}
            className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-xl transition-all shadow-xs"
          >
            Return to Login Portal
          </button>
        </div>
      </div>
    );
  }

  // Active Navigation Metadata
  const currentNav = navigationItems.find((item) => item.id === activeTab);

  // Active Tab Switcher
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'approvals':
        return <Approvals />;
      case 'announcements':
        return <StoreBroadcasts />;
      case 'staff_logs':
        return <StaffRoster />;
      default:
        return (
          <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-800">Section Not Found</h2>
            <p className="text-xs text-slate-500 mt-1">The requested tab route does not exist.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 flex font-sans antialiased text-slate-800">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        actionList={navigationItems} 
        isOpen={sidebarIsOpen} 
        setIsOpen={setSidebarIsOpen}
        setActiveTab={setActiveTab} 
        activeTab={activeTab} 
        user={user} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header Navigation Bar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between flex-shrink-0 z-10">
          
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
              aria-label="Toggle Navigation Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-xs font-medium hidden sm:flex">
              <span className="flex items-center gap-1 text-slate-600 font-bold">
                <Store className="w-3.5 h-3.5 text-blue-600" /> Store #402
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-slate-900 font-semibold">{currentNav?.label || 'Dashboard'}</span>
            </div>
          </div>

          {/* Right: Live Status & User Profile */}
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" /> Live Store Operations
            </span>

            <button 
              type="button"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
            </button>

            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'SM'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'Store Manager'}</p>
                <p className="text-[10px] text-slate-400 font-medium">Downtown Branch</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Tab View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            {renderTabContent()}
          </div>
        </main>

      </div>
    </div>
  );
}