import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ShoppingCart,
  CheckCircle2,
  Clock,
  ShieldAlert,
  DollarSign,
  Filter,
  Search,
  X,
  RefreshCw,
  Truck,
  CheckSquare,
  Square,
  PackageX,
  Send,
  Building2,
  TrendingDown,
  Info
} from 'lucide-react';

// --- MOCK LOW-STOCK INVENTORY DATA ---
const INITIAL_LOW_STOCK_ITEMS = [
  {
    id: 'SKU-7731',
    name: 'Lean Ground Beef (500g)',
    category: 'Meat & Poultry',
    stock: 8,
    minThreshold: 25,
    targetStock: 80,
    dailySalesRate: 4, // 2 days of stock left
    unitPrice: 5.50,
    supplier: 'Highland Prime Meats',
    leadTimeDays: 2,
    urgency: 'critical',
  },
  {
    id: 'SKU-8821',
    name: 'Fresh Whole Milk (1L)',
    category: 'Dairy',
    stock: 14,
    minThreshold: 50,
    targetStock: 100,
    dailySalesRate: 12, // ~1.1 days left
    unitPrice: 1.80,
    supplier: 'Kiambu Dairy Coop',
    leadTimeDays: 1,
    urgency: 'critical',
  },
  {
    id: 'SKU-5110',
    name: 'Extra Virgin Olive Oil (750ml)',
    category: 'Pantry',
    stock: 18,
    minThreshold: 20,
    targetStock: 50,
    dailySalesRate: 2, // 9 days left
    unitPrice: 9.20,
    supplier: 'Mediterranean Imports',
    leadTimeDays: 5,
    urgency: 'warning',
  },
  {
    id: 'SKU-4402',
    name: 'Artisan Wheat Bread (500g)',
    category: 'Bakery',
    stock: 22,
    minThreshold: 30,
    targetStock: 60,
    dailySalesRate: 8, // ~2.7 days left
    unitPrice: 2.40,
    supplier: 'Metro Bakers Ltd',
    leadTimeDays: 1,
    urgency: 'warning',
  },
  {
    id: 'SKU-1109',
    name: 'Frozen Salmon Fillets (1kg)',
    category: 'Seafood',
    stock: 3,
    minThreshold: 15,
    targetStock: 40,
    dailySalesRate: 3, // 1 day left
    unitPrice: 14.50,
    supplier: 'Oceanic Foods Inc',
    leadTimeDays: 3,
    urgency: 'critical',
  },
];

export default function LowStockAlerts() {
  const [items, setItems] = useState(INITIAL_LOW_STOCK_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  // Modal & Toast States
  const [poModalItems, setPoModalItems] = useState(null); // items to order in modal
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- STATS CALCULATIONS ---
  const stats = useMemo(() => {
    const criticalCount = items.filter((i) => i.urgency === 'critical').length;
    const warningCount = items.filter((i) => i.urgency === 'warning').length;

    // Items that will stock out before new stock arrives (Days Left < Lead Time)
    const impendingStockouts = items.filter((item) => {
      const daysLeft = item.stock / item.dailySalesRate;
      return daysLeft < item.leadTimeDays;
    }).length;

    // Total cost to bring all items back to target stock levels
    const totalReorderCost = items.reduce((acc, item) => {
      const deficit = item.targetStock - item.stock;
      return acc + deficit * item.unitPrice;
    }, 0);

    return { criticalCount, warningCount, impendingStockouts, totalReorderCost };
  }, [items]);

  // --- FILTERING ---
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesUrgency =
        selectedUrgency === 'All' || item.urgency === selectedUrgency;

      return matchesSearch && matchesUrgency;
    });
  }, [items, searchQuery, selectedUrgency]);

  // --- BATCH SELECTION HANDLERS ---
  const handleSelectAll = () => {
    if (selectedItemIds.length === filteredItems.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(filteredItems.map((i) => i.id));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // --- PO TRIGGER HANDLERS ---
  const handleOpenSinglePo = (item) => {
    setPoModalItems([item]);
  };

  const handleOpenBatchPo = () => {
    const selectedObjList = items.filter((i) => selectedItemIds.includes(i.id));
    setPoModalItems(selectedObjList);
  };

  const handleConfirmPo = (e) => {
    e.preventDefault();
    if (!poModalItems || poModalItems.length === 0) return;

    const count = poModalItems.length;
    const itemIds = poModalItems.map((i) => i.id);

    // Remove ordered items from the active low stock list
    setItems((prev) => prev.filter((i) => !itemIds.includes(i.id)));
    setSelectedItemIds((prev) => prev.filter((id) => !itemIds.includes(id)));

    showToast(
      `Dispatching Purchase Orders for ${count} SKU${count > 1 ? 's' : ''}!`
    );
    setPoModalItems(null);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen p-4 sm:p-6 lg:p-8 space-y-6 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs space-x-2 border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        {/* Header Section */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-rose-50/30 via-white to-white">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Low Stock Alerts & Critical Items
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Items currently below minimum safety thresholds requiring immediate supplier replenishment.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => showToast('Re-assessing sales velocity and current inventory...')}
              className="inline-flex items-center px-3 py-2 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Recalculate Runout
            </button>

            {selectedItemIds.length > 0 && (
              <button
                onClick={handleOpenBatchPo}
                className="inline-flex items-center px-3.5 py-2 bg-rose-600 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all shadow-md animate-in fade-in zoom-in-95"
              >
                <ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> Reorder Selected ({selectedItemIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Analytics Summary Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-100 bg-slate-50/40 text-xs">
          <div className="p-4 border-r border-b md:border-b-0 border-slate-100 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-rose-100/70 text-rose-700">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 font-medium text-[11px]">Critical Stockouts</p>
              <p className="font-bold text-rose-600 text-sm">{stats.criticalCount} SKUs</p>
            </div>
          </div>

          <div className="p-4 border-r-0 md:border-r border-b md:border-b-0 border-slate-100 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-100/70 text-amber-700">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 font-medium text-[11px]">Near Minimum</p>
              <p className="font-bold text-amber-600 text-sm">{stats.warningCount} SKUs</p>
            </div>
          </div>

          <div className="p-4 border-r border-slate-100 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-orange-100/70 text-orange-700">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 font-medium text-[11px]">Runout Before Arrival</p>
              <p className="font-bold text-slate-900 text-sm">{stats.impendingStockouts} SKUs</p>
            </div>
          </div>

          <div className="p-4 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-100/70 text-blue-700">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 font-medium text-[11px]">Full Target Reorder</p>
              <p className="font-bold text-slate-900 text-sm">
                ${stats.totalReorderCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search critical items, suppliers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-slate-50/50 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Severity Tabs */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Urgency:</span>
            <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold w-full sm:w-auto">
              {['All', 'critical', 'warning'].map((urg) => (
                <button
                  key={urg}
                  onClick={() => setSelectedUrgency(urg)}
                  className={`flex-1 sm:flex-initial px-3 py-1 rounded-md capitalize transition-all ${
                    selectedUrgency === urg
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {urg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alert Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                <th className="py-3 px-4 w-10 text-center">
                  <button
                    onClick={handleSelectAll}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {selectedItemIds.length === filteredItems.length && filteredItems.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-rose-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Item & Supplier</th>
                <th className="py-3 px-4">Current / Target</th>
                <th className="py-3 px-4">Est. Runout</th>
                <th className="py-3 px-4">Lead Time</th>
                <th className="py-3 px-4">Reorder Deficit</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isSelected = selectedItemIds.includes(item.id);
                  const deficit = item.targetStock - item.stock;
                  const estimatedCost = (deficit * item.unitPrice).toFixed(2);
                  const daysLeft = (item.stock / item.dailySalesRate).toFixed(1);
                  const isImpendingOut = Number(daysLeft) <= item.leadTimeDays;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors group ${
                        isSelected ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* Checkbox Selection */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleSelect(item.id)}
                          className="text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-rose-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* SKU Name & Supplier */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                              {item.name}
                            </div>
                            <div className="flex items-center text-[10px] text-slate-400 space-x-2 mt-0.5">
                              <span className="font-mono">{item.id}</span>
                              <span>•</span>
                              <span className="flex items-center">
                                <Building2 className="w-3 h-3 mr-1" />
                                {item.supplier}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Current Stock vs Target Bar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-rose-600">{item.stock}</span>
                          <span className="text-slate-400">/</span>
                          <span className="text-slate-600 font-medium">{item.targetStock} units</span>
                        </div>
                        <div className="w-32 bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1">
                          <div
                            className={`h-full rounded-full ${
                              item.urgency === 'critical' ? 'bg-rose-500' : 'bg-amber-500'
                            }`}
                            style={{
                              width: `${Math.min(
                                Math.round((item.stock / item.targetStock) * 100),
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </td>

                      {/* Est. Runout Timeline */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5">
                          <Clock
                            className={`w-3.5 h-3.5 ${
                              isImpendingOut ? 'text-rose-500' : 'text-slate-400'
                            }`}
                          />
                          <span
                            className={`font-semibold ${
                              isImpendingOut ? 'text-rose-600 font-bold' : 'text-slate-700'
                            }`}
                          >
                            ~{daysLeft} days left
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Avg {item.dailySalesRate} units/day
                        </div>
                      </td>

                      {/* Supplier Lead Time */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="flex items-center space-x-1">
                          <Truck className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.leadTimeDays} day lead</span>
                        </div>
                        {isImpendingOut && (
                          <span className="inline-block text-[9px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200 mt-0.5">
                            Order Today
                          </span>
                        )}
                      </td>

                      {/* Calculated Deficit & Cost */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          +{deficit} units
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Est. ${estimatedCost}
                        </div>
                      </td>

                      {/* Direct Action */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenSinglePo(item)}
                          className="inline-flex items-center bg-rose-600 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all shadow-2xs"
                        >
                          <Send className="w-3 h-3 mr-1" /> Quick PO
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                    <p className="font-semibold text-slate-700">Stock Levels Healthy</p>
                    <p className="text-xs mt-0.5">No critical or low-stock items require action right now.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1 text-[11px]">
            <Info className="w-3.5 h-3.5 text-rose-500 mr-1" />
            <span>Runout estimations calculate daily sales velocity against supplier lead time.</span>
          </div>
          <span>
            Showing <strong className="text-slate-800">{filteredItems.length}</strong> alert items
          </span>
        </div>
      </div>

      {/* --- CONFIRMATION PO MODAL --- */}
      {poModalItems && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-rose-50/40">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {poModalItems.length > 1
                      ? `Batch Purchase Order (${poModalItems.length} Items)`
                      : `Confirm Purchase Order`}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Dispatches restock request to designated suppliers.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPoModalItems(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleConfirmPo} className="p-5 space-y-4">
              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl bg-slate-50/50 p-1">
                {poModalItems.map((item) => {
                  const deficit = item.targetStock - item.stock;
                  return (
                    <div key={item.id} className="p-3 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-[10px] text-slate-400">
                          Supplier: <span className="font-semibold">{item.supplier}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-rose-600">+{deficit} units</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ${(deficit * item.unitPrice).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Grand Total */}
              <div className="p-3.5 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">Total Purchase Commitment:</span>
                <span className="font-bold text-base text-emerald-400 font-mono">
                  $
                  {poModalItems
                    .reduce((acc, i) => acc + (i.targetStock - i.stock) * i.unitPrice, 0)
                    .toFixed(2)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPoModalItems(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs flex items-center"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" /> Dispatch Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}