import React from 'react';
import { X, Settings } from 'lucide-react';

export default function Sidebar({
  actionList = [],
  activeTab,
  setActiveTab,
  isOpen ,
  setIsOpen,
  user = { name: 'Alex Mercer', role: 'Store Manager' },
}) {
  // Derive user initials dynamically if not explicitly supplied
  const getInitials = (name = '') => {
    if (user?.initials) return user.initials;
    if (!name) return 'SM';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleNavClick = (id) => {
    setActiveTab?.(id);
    // Auto-close sidebar drawer on mobile viewports
    if (typeof window !== 'undefined' && window.innerWidth < 768 && setIsOpen) {
      setIsOpen(false);
    }
  };

  if(!isOpen){
  	return;
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden transition-opacity"
          onClick={() => setIsOpen?.(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation Container */}
      <aside
        aria-label="Sidebar navigation"
        className={`fixed md:sticky top-0 left-0 z-40 flex flex-col w-64 bg-white border-r border-slate-200/80 h-screen transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <svg
              width="32"
              height="32"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="shrink-0"
            >
              <rect x="8" y="8" width="14" height="32" rx="3" fill="#2563EB" />
              <rect x="26" y="8" width="14" height="14" rx="3" fill="#0F172A" />
              <rect x="26" y="26" width="14" height="14" rx="3" fill="#94A3B8" />
            </svg>
            <div>
              <span className="text-lg font-black text-slate-900 tracking-tight block leading-none">
                Supermax
              </span>
              <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">
                Ops Tower
              </span>
            </div>
          </div>

          {/* Mobile Close Button */}
          {setIsOpen && (
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
              aria-label="Close sidebar navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 space-y-1 py-4 overflow-y-auto">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {actionList.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 group relative ${
                  isActive
                    ? 'bg-blue-50/80 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                {/* Active Left Accent Pill */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-full" />
                )}

                <div className="flex items-center space-x-3 min-w-0 pl-1">
                  {Icon && (
                    <Icon
                      aria-hidden="true"
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                  )}
                  <span className="text-xs truncate">{item.label}</span>
                </div>

                {item.count !== undefined && (
                  <span
                    className={`ml-2 text-[11px] px-2 py-0.5 rounded-full font-bold shrink-0 transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-amber-100/80 text-amber-800'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Manager Profile Footer */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/50 mt-auto">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white hover:shadow-2xs transition-all border border-transparent hover:border-slate-200/60">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs shadow-2xs shrink-0 ring-2 ring-slate-200/60">
                {getInitials(user?.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                  {user?.name || 'Store Manager'}
                </p>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse"
                    aria-hidden="true"
                  />
                  <p className="text-[10px] text-slate-500 font-medium truncate">
                    {user?.role || 'Manager'}
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Store Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}