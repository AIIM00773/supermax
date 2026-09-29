


import React, { useState, useMemo } from 'react';
import {
  Layers,
  Search,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  Package,
  ShoppingCart,
  Plus,
  Download,
  X,
  RefreshCw,
  MoreVertical,
  Building2,
  TrendingDown,
  DollarSign,
  Info
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
const INITIAL_INVENTORY = [
  { id: 'SKU-8821', name: 'Fresh Whole Milk (1L)', category: 'Dairy', stock: 14, minThreshold: 50, targetStock: 100, unitPrice: 1.80, supplier: 'Kiambu Dairy Coop', status: 'critical', lastRestocked: '2026-09-20' },
  { id: 'SKU-4402', name: 'Artisan Wheat Bread (500g)', category: 'Bakery', stock: 22, minThreshold: 30, targetStock: 60, unitPrice: 2.40, supplier: 'Metro Bakers Ltd', status: 'warning', lastRestocked: '2026-09-24' },
  { id: 'SKU-1092', name: 'Organic Bananas (1kg)', category: 'Produce', stock: 140, minThreshold: 60, targetStock: 200, unitPrice: 1.10, supplier: 'Fresh Harvest Distro', status: 'optimal', lastRestocked: '2026-09-27' },
  { id: 'SKU-7731', name: 'Lean Ground Beef (500g)', category: 'Meat & Poultry', stock: 8, minThreshold: 25, targetStock: 80, unitPrice: 5.50, supplier: 'Highland Prime Meats', status: 'critical', lastRestocked: '2026-09-18' },
  { id: 'SKU-3329', name: 'Sparkling Mineral Water (1.5L)', category: 'Beverages', stock: 310, minThreshold: 100, targetStock: 400, unitPrice: 0.90, supplier: 'Clear Springs Co', status: 'optimal', lastRestocked: '2026-09-25' },
  { id: 'SKU-5110', name: 'Extra Virgin Olive Oil (750ml)', category: 'Pantry', stock: 18, minThreshold: 20, targetStock: 50, unitPrice: 9.20, supplier: 'Mediterranean Imports', status: 'warning', lastRestocked: '2026-09-15' },
  { id: 'SKU-9023', name: 'Greek Yogurt Plain (500g)', category: 'Dairy', stock: 65, minThreshold: 35, targetStock: 120, unitPrice: 3.10, supplier: 'Kiambu Dairy Coop', status: 'optimal', lastRestocked: '2026-09-26' },
];

export default function SkuStockMatrix() {
  const [items, setItems] = useState(INITIAL_INVENTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // PO Action Modal State
  const [poModalItem, setPoModalItem] = useState(null);
  const [poQuantity, setPoQuantity] = useState(50);
  
  // Toast Notification State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // --- CATEGORY LIST ---
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(items.map((i) => i.category)))];
  }, [items]);

  // --- KPI CALCULATIONS ---
  const stats = useMemo(() => {
    const totalSkus = items.length;
    const criticalCount = items.filter((i) => i.status === 'critical').length;
    const warningCount = items.filter((i) => i.status === 'warning').length;
    const totalValuation = items.reduce((acc, i) => acc + i.stock * i.unitPrice, 0);

    return { totalSkus, criticalCount, warningCount, totalValuation };
  }, [items]);

  // --- FILTER & SORT LOGIC ---
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.supplier.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
          selectedCategory === 'All' || item.category === selectedCategory;
        const matchesStatus =
          selectedStatus === 'All' || item.status === selectedStatus;

        return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [items, searchQuery, selectedCategory, selectedStatus, sortField, sortOrder]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleOpenPoModal = (item) => {
    const recommended = Math.max(item.targetStock - item.stock, item.minThreshold);
    setPoQuantity(recommended);
    setPoModalItem(item);
  };

  const handleCreatePoSubmit = (e) => {
    e.preventDefault();
    if (!poModalItem) return;

    // Simulate ordering stock: bump status to optimal / increase inventory in real system
    showToast(`Purchase Order created! ${poQuantity} units of ${poModalItem.id} requested from ${poModalItem.supplier}.`);
    setPoModalItem(null);
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

      {/* Main Section Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        
        {/* Section Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-50/50 to-white">
          <div>
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Layers className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Live SKU Inventory Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Monitor real-time stock levels, threshold targets, and automated reorder triggers.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => showToast('Refreshed inventory data with live warehouse sync.')}
              className="inline-flex items-center px-3 py-2 border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Refresh
            </button>
            <button
              onClick={() => showToast('Exporting current SKU matrix to CSV...')}
              className="inline-flex items-center px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" /> Export Matrix
            </button>
          </div>
        </div>

        {/* Micro KPI Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-slate-100 bg-slate-50/40 text-xs">
          <div className="p-4 border-r border-b md:border-b-0 border-slate-100 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-100/60 text-blue-700">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 font-medium text-[11px]">Active SKUs</p>
              <p className="font-bold text-slate-900 text-sm">{stats.totalSkus} Items</p>
            </div>
          </div>

          <div className="p-4 border-r-0 md:border-r border-b md:border-b-0 border-slate-100 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-rose-100/60 text-rose-700">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 font-medium text-[11px]">Critical Stock</p>
              <p className="font-bold text-rose-600 text-sm">{stats.criticalCount} SKUs</p>
            </div>
          </div>

          <div className="p-4 border-r border-slate-100 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-amber-100/60 text-amber-700">
              <TrendingDown className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 font-medium text-[11px]">Low Warning</p>
              <p className="font-bold text-amber-600 text-sm">{stats.warningCount} SKUs</p>
            </div>
          </div>

          <div className="p-4 flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-emerald-100/60 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <p className="text-slate-500 font-medium text-[11px]">Filtered Valuation</p>
              <p className="font-bold text-slate-900 text-sm">
                ${stats.totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Search, Filter & Quick Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by SKU, name, supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 bg-slate-50/50 focus:bg-white transition-all"
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

          {/* Filters */}
          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {/* Category Dropdown */}
            <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-600">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-medium text-slate-400">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Tabs */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              {['All', 'critical', 'warning', 'optimal'].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-2.5 py-1 rounded-md capitalize transition-all ${
                    selectedStatus === st
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main SKU Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>SKU & Description</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('category')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Category</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('stock')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100/60 transition-colors min-w-[160px]"
                >
                  <div className="flex items-center space-x-1">
                    <span>Stock Level & Target</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('unitPrice')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100/60 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>Unit Price</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  // Stock Percentage Gauge
                  const stockRatio = Math.min(
                    Math.round((item.stock / item.targetStock) * 100),
                    100
                  );

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* SKU Name & ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {item.id}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium text-[11px]">
                          {item.category}
                        </span>
                      </td>

                      {/* Stock Level & Visual Gauge Bar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-slate-900">
                            {item.stock}{' '}
                            <span className="text-[10px] font-normal text-slate-400">
                              / {item.targetStock}
                            </span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            Min: {item.minThreshold}
                          </span>
                        </div>
                        {/* Progress Bar Gauge */}
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              item.status === 'critical'
                                ? 'bg-rose-500'
                                : item.status === 'warning'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${stockRatio}%` }}
                          />
                        </div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                        ${item.unitPrice.toFixed(2)}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4">
                        {item.status === 'critical' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 animate-pulse" />
                            Critical Low
                          </span>
                        )}
                        {item.status === 'warning' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
                            Low Stock
                          </span>
                        )}
                        {item.status === 'optimal' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                            Optimal
                          </span>
                        )}
                      </td>

                      {/* Supplier */}
                      <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                        <div className="flex items-center">
                          <Building2 className="w-3 h-3 text-slate-400 mr-1.5 shrink-0" />
                          <span className="truncate max-w-[130px]">
                            {item.supplier}
                          </span>
                        </div>
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-4 text-right">
                        {item.stock <= item.minThreshold ? (
                          <button
                            onClick={() => handleOpenPoModal(item)}
                            className="inline-flex items-center bg-blue-600 hover:bg-slate-900 text-white px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors shadow-2xs"
                          >
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Trigger PO
                          </button>
                        ) : (
                          <button
                            onClick={() => showToast(`SKU ${item.id} is healthy. No reorder required.`)}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
                            title="More Actions"
                          >
                            <MoreVertical className="w-4 h-4 ml-auto" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No matching SKUs found</p>
                    <p className="text-xs mt-0.5">Try adjusting your filters or search query.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Summary */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredItems.length}</strong> of{' '}
            <strong className="text-slate-800">{items.length}</strong> total items
          </span>
          <div className="flex items-center space-x-1 text-[11px]">
            <Info className="w-3.5 h-3.5 text-blue-500 mr-1" />
            <span>Items below threshold automatically highlight for Purchase Order triggers.</span>
          </div>
        </div>
      </div>

      {/* --- PURCHASE ORDER TRIGGER MODAL --- */}
      {poModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Trigger Purchase Order</h3>
                  <p className="text-[11px] text-slate-400 font-mono">{poModalItem.id}</p>
                </div>
              </div>
              <button
                onClick={() => setPoModalItem(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreatePoSubmit} className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Item Name:</span>
                  <span className="font-bold text-slate-900">{poModalItem.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Stock:</span>
                  <span className="font-bold text-rose-600">{poModalItem.stock} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Threshold:</span>
                  <span className="font-bold text-slate-700">{poModalItem.targetStock} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Supplier:</span>
                  <span className="font-semibold text-slate-800">{poModalItem.supplier}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reorder Quantity (Units)
                </label>
                <input
                  type="number"
                  min="1"
                  value={poQuantity}
                  onChange={(e) => setPoQuantity(Number(e.target.value))}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
                  required
                />
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                <span className="text-blue-700 font-medium">Estimated PO Cost:</span>
                <span className="font-bold text-blue-900 font-mono text-sm">
                  ${(poQuantity * poModalItem.unitPrice).toFixed(2)}
                </span>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPoModalItem(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs flex items-center"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Send Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}