import React, { useState, useMemo } from 'react';
import {
  Package,
  AlertTriangle,
  TrendingDown,
  Truck,
  DollarSign,
  Layers,
  Search,
  Filter,
  FileText,
  RefreshCw,
  Clock,
} from 'lucide-react';

export default function Overview({ inventoryItems = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamically filter items by name, ID (SKU), or category
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return inventoryItems;
    const query = searchQuery.toLowerCase();
    return inventoryItems.filter(
      (item) =>
        item.name?.toLowerCase().includes(query) ||
        item.id?.toString().toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
    );
  }, [inventoryItems, searchQuery]);

  // Derived KPI metrics from incoming props
  const criticalItemsCount = useMemo(() => {
    return inventoryItems.filter(
      (item) => item.status === 'critical' || item.stock < item.minThreshold
    ).length;
  }, [inventoryItems]);

  const totalValuation = useMemo(() => {
    return inventoryItems.reduce(
      (acc, item) => acc + (item.stock || 0) * (item.unitPrice || 0),
      0
    );
  }, [inventoryItems]);

  return (
    <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-slate-50 min-h-screen">
      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Active SKUs
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {inventoryItems.length > 0
                  ? inventoryItems.length.toLocaleString()
                  : '1,428'}
              </p>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            Across 8 main departments
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Critical Thresholds
              </p>
              <p className="text-2xl font-extrabold text-rose-600 mt-1">
                {criticalItemsCount}{' '}
                {criticalItemsCount === 1 ? 'Item' : 'Items'}
              </p>
            </div>
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-rose-600 mt-3 font-medium flex items-center">
            <TrendingDown className="w-3.5 h-3.5 mr-1" /> Reorder required
            immediately
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Inbound Shipments
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                2 Pending
              </p>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            ETA: Today before 4:00 PM
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Valuation at Cost
              </p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                {totalValuation > 0
                  ? `$${totalValuation.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                  : '$114,820'}
              </p>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            Auto-synced with Financial Ledger
          </p>
        </div>
      </div>

      {/* Main Stock Table & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stock Matrix (Left 2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center">
                <Layers className="w-5 h-5 mr-2 text-[#1E3A5F]" />
                Live SKU Inventory Matrix
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time stock quantities vs. automated minimum reorder targets
              </p>
            </div>

            {/* Table Filters & Search */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter SKU or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50 focus:bg-white w-40 sm:w-48 transition-all"
                />
              </div>
              <button
                type="button"
                className="p-1.5 border border-slate-300 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
                title="Filter options"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SKU Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">SKU Code & Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">In Stock</th>
                  <th className="py-3 px-4">Min Target</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {item.id} • ${item.unitPrice}/unit
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.category}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {item.stock} units
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {item.minThreshold} units
                      </td>
                      <td className="py-3 px-4">
                        {item.status === 'critical' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                            <AlertTriangle className="w-3 h-3 mr-1" /> Critical
                            Low
                          </span>
                        )}
                        {item.status === 'warning' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                            Low Stock
                          </span>
                        )}
                        {item.status === 'optimal' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Optimal
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {item.stock < item.minThreshold ? (
                          <button
                            type="button"
                            className="bg-blue-600 hover:bg-[#1E3A5F] text-white px-2.5 py-1 rounded text-[11px] font-semibold transition-colors"
                          >
                            Trigger PO
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[11px] font-medium">
                            —
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-slate-400 text-xs"
                    >
                      No inventory items found matching your filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar: Audit Log & Inbound Delivery */}
        <div className="space-y-6">
          {/* Receiving Audit Log */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-blue-600" />
                Receiving & Ledger Audit Log
              </h3>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Receiving stock automatically executes a backend atomic transaction (`transaction.atomic()`) posting cost to the Financial Ledger.
            </p>

            <ul className="space-y-3">
              <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-slate-900">
                    +200 Crate Eggs (L)
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    TRX-9012
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500">
                  <span>Supplier: Kiambu Farmers</span>
                  <span className="font-bold text-slate-700">
                    -$640.00 Expense
                  </span>
                </div>
              </li>

              <li className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-slate-900">
                    +50 Boxes Cooking Oil (3L)
                  </span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                    TRX-8984
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2 text-[11px] text-slate-500">
                  <span>Supplier: Pwani Oil Distro</span>
                  <span className="font-bold text-slate-700">
                    -$1,120.00 Expense
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Pending Delivery ETA */}
          <div className="bg-[#1E3A5F] rounded-xl text-white p-5 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <Truck className="w-5 h-5 text-blue-300" />
              <h3 className="text-sm font-bold">Inbound Shipment ETA</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-[#2A4B7C] p-3 rounded-lg">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-blue-100">
                    PO-2026-904
                  </span>
                  <span className="text-emerald-300 font-medium">
                    In Transit
                  </span>
                </div>
                <p className="text-xs text-blue-200">
                  Fresh Produce Shipment (350 kg)
                </p>
                <div className="mt-2 text-[11px] text-blue-300 flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> Expected arrival: 2:30 PM
                  Today
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}