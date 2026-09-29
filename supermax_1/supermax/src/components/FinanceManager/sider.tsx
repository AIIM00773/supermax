import React from 'react';
import { X, LogOut, ShieldCheck } from 'lucide-react';

export default function Sider({
  tabsList = [],
  tbsList = [],
  activeTab,
  setActiveTab,
  user,
  isOpen = false,
  setIsOpen = () => {}
}) {
  // Support both tabsList and tbsList prop variants
  const activeTabsList = tabsList.length > 0 ? tabsList : tbsList;

  // Extract user info with fallback defaults for Finance Manager role
  const userName = user?.name || user?.full_name || 'Elena Vance';
  const userRole = user?.role || 'Finance Controller';
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setIsOpen(false); // Close mobile drawer on item selection
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* 1. Header / Brand Logo */}
      <div className="p-5 sm:p-6 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <svg
            width="32"
            height="32"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
          >
            <rect x="8" y="8" width="14" height="32" rx="2" fill="#2563EB" />
            <rect x="26" y="8" width="14" height="14" rx="2" fill="#1E3A5F" />
            <rect x="26" y="26" width="14" height="14" rx="2" fill="#94A3B8" />
          </svg>
          <div>
            <span className="text-lg font-extrabold text-slate-900 tracking-tight block leading-none">
              Supermax
            </span>
            <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">
              Finance Control
            </span>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Management & Audit
          </p>
        </div>

        {activeTabsList.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center space-x-3 truncate">
                {Icon && (
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                )}
                <span className="truncate">{item.label}</span>
              </div>

              {item.count ? (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.count}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* 3. System Status / Audit Badge */}
      <div className="px-4 py-3 mx-3 mb-3 bg-slate-50 border border-slate-200/80 rounded-xl">
        <div className="flex items-center space-x-2 text-[11px] font-medium text-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate">FY26 Books Balanced</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5 pl-6">Updated 10m ago</p>
      </div>

      {/* 4. User Profile & Account Footer */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#1E3A5F] flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {userName}
              </p>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  {userRole}
                </p>
              </div>
            </div>
          </div>

          <button
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 shrink-0">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Mobile Slide-over Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-72 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>
    </>
  );
}