import React from 'react';
import { 
  X, 
  Boxes, 
  Warehouse, 
  Settings, 
  LogOut, 
  ChevronDown 
} from 'lucide-react';

export default function InventorySidebar({
  isOpen = true,
  setIsOpen,
  tabsList = [],
  activeTab,
  setActiveTab,
  user = { name: 'David K.', role: 'Inventory Admin', warehouse: 'Main Hub - WH1' },
}) {
  // Derive user initials dynamically
  const getInitials = (name = '') => {
    if (user?.initials) return user.initials;
    if (!name) return 'IA';
    const parts = name.trim().split(' ');
    return parts.length >= 2 
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() 
      : name.slice(0, 2).toUpperCase();
  };

  const handleTabClick = (id) => {
    setActiveTab?.(id);
    // Auto-close sidebar on mobile viewports after selecting an action
    if (typeof window !== 'undefined' && window.innerWidth < 768 && setIsOpen) {
      setIsOpen(false);
    }
  };

  // Badge styling variants for inventory priorities
  const getBadgeStyle = (variant = 'rose') => {
    switch (variant) {
      case 'amber':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'emerald':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'blue':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rose':
      default:
        return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 md:hidden transition-opacity"
          onClick={() => setIsOpen?.(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        aria-label="Inventory Admin Navigation"
        className={`fixed md:sticky top-0 left-0 z-40 flex flex-col w-64 bg-white border-r border-slate-200/80 h-screen transition-transform duration-200 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand & Warehouse Selector */}
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <Boxes className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-black text-slate-900 tracking-tight block leading-none">
                  Supermax
                </span>
                <span className="text-[10px] uppercase tracking-wider text-blue-600 font-bold">
                  Stock Control
                </span>
              </div>
            </div>

            {/* Mobile Dismiss Button */}
            {setIsOpen && (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg md:hidden"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Active Warehouse Indicator */}
          <div className="mt-4 px-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <Warehouse className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-xs font-semibold text-slate-700 truncate">
                {user?.warehouse || 'Central Distribution'}
              </span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1 py-4 overflow-y-auto">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Inventory Operations
          </p>
          
          {tabsList?.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 group relative ${
                  isActive
                    ? 'bg-blue-50/80 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                }`}
              >
                {/* Active Accent Bar */}
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

                {/* Stock Alert / Task Count Badge */}
                {item.count !== undefined && item.count !== null && (
                  <span
                    className={`ml-2 text-[11px] px-2 py-0.5 rounded-full font-bold border shrink-0 transition-colors ${getBadgeStyle(
                      item.badgeVariant
                    )}`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User / Inventory Admin Footer */}
        <div className="p-3 border-t border-slate-200/80 bg-slate-50/50 mt-auto">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white hover:shadow-2xs transition-all border border-transparent hover:border-slate-200/60">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-2xs shrink-0 ring-2 ring-blue-100">
                {getInitials(user?.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                  {user?.name || 'David K.'}
                </p>
                <div className="flex items-center space-x-1.5 mt-0.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse"
                    aria-hidden="true"
                  />
                  <p className="text-[10px] text-slate-500 font-medium truncate">
                    {user?.role || 'Inventory Admin'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-0.5">
              <button
                type="button"
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Inventory Settings"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}