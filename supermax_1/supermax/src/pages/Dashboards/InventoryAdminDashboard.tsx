import React, { useState } from 'react';
import {
  BarChart3,
  Layers,
  AlertTriangle,
  Truck,
  Building2,
  Menu,
  Plus,
  Search,
  Bell,
  X,
  Package,
  CheckCircle2
} from 'lucide-react';

import Sider from '../../components/InventoryAdmin/sider';
import Overview from '../../components/InventoryAdmin/overview';
import SkuStockMatrix from '../../components/InventoryAdmin/stock';
import LowStockAlerts from '../../components/InventoryAdmin/lowstock';
import InboundShipments from '../../components/InventoryAdmin/shipments';
import SupplierNetwork from '../../components/InventoryAdmin/suppliers';

import { useUser } from '../../contexts/user';

export default function InventoryAdminDashboard() {
  const { user, is_authenticated } = useUser();

  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Stock intake form state
  const [receiveFormData, setReceiveFormData] = useState({
    skuId: '',
    quantity: '',
    supplier: '',
    poNumber: ''
  });

  const tabsList = [
    { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
    { id: 'stock', label: 'SKU Stock Matrix', icon: Layers },
    { id: 'reorder', label: 'Low Stock Alerts', icon: AlertTriangle, count: 2 },
    { id: 'receiving', label: 'Receive Inbound Stock', icon: Truck },
    { id: 'suppliers', label: 'Supplier Network', icon: Building2 }
  ];

  // Master Inventory State
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 'SKU-8821',
      name: 'Fresh Whole Milk (1L)',
      category: 'Dairy',
      stock: 14,
      minThreshold: 50,
      unitPrice: 1.8,
      supplier: 'Kiambu Dairy Coop',
      status: 'critical'
    },
    {
      id: 'SKU-4402',
      name: 'Artisan Wheat Bread (500g)',
      category: 'Bakery',
      stock: 22,
      minThreshold: 30,
      unitPrice: 2.4,
      supplier: 'Metro Bakers Ltd',
      status: 'warning'
    },
    {
      id: 'SKU-1092',
      name: 'Organic Bananas (1kg)',
      category: 'Produce',
      stock: 140,
      minThreshold: 60,
      unitPrice: 1.1,
      supplier: 'Fresh Harvest Distro',
      status: 'optimal'
    },
    {
      id: 'SKU-7731',
      name: 'Lean Ground Beef (500g)',
      category: 'Meat & Poultry',
      stock: 8,
      minThreshold: 25,
      unitPrice: 5.5,
      supplier: 'Highland Prime Meats',
      status: 'critical'
    },
    {
      id: 'SKU-3329',
      name: 'Sparkling Mineral Water (1.5L)',
      category: 'Beverages',
      stock: 310,
      minThreshold: 100,
      unitPrice: 0.9,
      supplier: 'Clear Springs Co',
      status: 'optimal'
    }
  ]);

  const handleReceiveStockSubmit = (e) => {
    e.preventDefault();
    if (!receiveFormData.skuId || !receiveFormData.quantity) return;

    setInventoryItems((prev) =>
      prev.map((item) => {
        if (item.id.toLowerCase() === receiveFormData.skuId.toLowerCase()) {
          const newStock = item.stock + Number(receiveFormData.quantity);
          const newStatus = newStock < item.minThreshold ? 'warning' : 'optimal';
          return { ...item, stock: newStock, status: newStatus };
        }
        return item;
      })
    );

    setReceiveFormData({ skuId: '', quantity: '', supplier: '', poNumber: '' });
    setShowReceiveModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased text-slate-800">
      {/* Sidebar Navigation */}
      <Sider
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        tabsList={tabsList}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar Header */}
        <header className="bg-white border-b border-slate-200 h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block w-64 lg:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Quick search inventory, SKUs, vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowReceiveModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Receive Stock</span>
            </button>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <button className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 relative transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
            </button>
          </div>
        </header>

        {/* Dynamic Tab Views */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'overview' && (
            <Overview
              inventoryItems={inventoryItems}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'stock' && (
            <SkuStockMatrix
              inventoryItems={inventoryItems}
              setInventoryItems={setInventoryItems}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'reorder' && (
            <LowStockAlerts
              inventoryItems={inventoryItems}
              setInventoryItems={setInventoryItems}
            />
          )}

          {activeTab === 'receiving' && (
            <InboundShipments
              inventoryItems={inventoryItems}
              onReceiveSuccess={handleReceiveStockSubmit}
            />
          )}

          {activeTab === 'suppliers' && (
            <SupplierNetwork inventoryItems={inventoryItems} />
          )}
        </div>
      </main>

      {/* Global Quick Receive Stock Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  Quick Receive Stock
                </h3>
              </div>
              <button
                onClick={() => setShowReceiveModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleReceiveStockSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Select Target SKU
                </label>
                <select
                  value={receiveFormData.skuId}
                  onChange={(e) =>
                    setReceiveFormData({ ...receiveFormData, skuId: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  required
                >
                  <option value="">Select SKU item...</option>
                  {inventoryItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.id} - {item.name} (Current: {item.stock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Quantity Received
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 50"
                    value={receiveFormData.quantity}
                    onChange={(e) =>
                      setReceiveFormData({ ...receiveFormData, quantity: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    PO Number
                  </label>
                  <input
                    type="text"
                    placeholder="PO-2026-XXXX"
                    value={receiveFormData.poNumber}
                    onChange={(e) =>
                      setReceiveFormData({ ...receiveFormData, poNumber: e.target.value })
                    }
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Supplier / Logistics Vendor
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kiambu Dairy Coop"
                  value={receiveFormData.supplier}
                  onChange={(e) =>
                    setReceiveFormData({ ...receiveFormData, supplier: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowReceiveModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors shadow-xs flex items-center"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Commit Intake
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}