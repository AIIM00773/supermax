import React, { useState, useMemo } from 'react';
import {
  Truck,
  PackageCheck,
  ClipboardCheck,
  AlertCircle,
  CheckCircle2,
  Plus,
  Search,
  X,
  Building2,
  Calendar,
  DollarSign,
  ShieldCheck,
  Package,
  FileText,
  Clock,
  MapPin,
  AlertTriangle
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_SHIPMENTS = [
  {
    poNumber: 'PO-2026-9041',
    supplier: 'Kiambu Dairy Coop',
    sku: 'SKU-8821',
    itemName: 'Fresh Whole Milk (1L)',
    category: 'Dairy',
    qtyExpected: 100,
    qtyReceived: 0,
    unitCost: 1.80,
    expectedDate: '2026-09-28',
    status: 'In Transit',
    warehouseBin: 'Aisle 2 - Bay B',
  },
  {
    poNumber: 'PO-2026-9038',
    supplier: 'Highland Prime Meats',
    sku: 'SKU-7731',
    itemName: 'Lean Ground Beef (500g)',
    category: 'Meat & Poultry',
    qtyExpected: 75,
    qtyReceived: 75,
    unitCost: 5.50,
    expectedDate: '2026-09-28',
    status: 'In QC',
    warehouseBin: 'Cold Storage - Rack 1',
  },
  {
    poNumber: 'PO-2026-9030',
    supplier: 'Metro Bakers Ltd',
    sku: 'SKU-4402',
    itemName: 'Artisan Wheat Bread (500g)',
    category: 'Bakery',
    qtyExpected: 50,
    qtyReceived: 50,
    unitCost: 2.40,
    expectedDate: '2026-09-27',
    status: 'Received',
    warehouseBin: 'Bakery Rack - Sec A',
  },
  {
    poNumber: 'PO-2026-9022',
    supplier: 'Mediterranean Imports',
    sku: 'SKU-5110',
    itemName: 'Extra Virgin Olive Oil (750ml)',
    category: 'Pantry',
    qtyExpected: 40,
    qtyReceived: 32,
    unitCost: 9.20,
    expectedDate: '2026-09-26',
    status: 'Discrepancy',
    warehouseBin: 'Dry Pantry - Bin 04',
  },
];

export default function InboundShipments() {
  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Modal states
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  // New Shipment Form State
  const [formData, setFormData] = useState({
    poNumber: '',
    supplier: '',
    itemName: '',
    sku: '',
    qtyExpected: '',
    unitCost: '',
    expectedDate: '',
    warehouseBin: '',
  });

  // --- STATS CALCULATIONS ---
  const stats = useMemo(() => {
    const inTransit = shipments.filter((s) => s.status === 'In Transit').length;
    const inQC = shipments.filter((s) => s.status === 'In QC').length;
    const discrepancies = shipments.filter((s) => s.status === 'Discrepancy').length;
    const totalValue = shipments.reduce((acc, s) => acc + s.qtyExpected * s.unitCost, 0);

    return { inTransit, inQC, discrepancies, totalValue };
  }, [shipments]);

  // --- FILTERING ---
  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      const matchesSearch =
        s.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.supplier.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = selectedStatus === 'All' || s.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [shipments, searchQuery, selectedStatus]);

  // --- HANDLERS ---
  const handleOpenProcessModal = (shipment) => {
    setSelectedShipment(shipment);
    setShowReceiveModal(true);
  };

  const handleCloseModal = () => {
    setShowReceiveModal(false);
    setSelectedShipment(null);
    setFormData({
      poNumber: '',
      supplier: '',
      itemName: '',
      sku: '',
      qtyExpected: '',
      unitCost: '',
      expectedDate: '',
      warehouseBin: '',
    });
  };

  const handleCreateShipment = (e) => {
    e.preventDefault();
    const newShipment = {
      ...formData,
      poNumber: formData.poNumber || `PO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      sku: formData.sku || `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      qtyExpected: Number(formData.qtyExpected) || 1,
      qtyReceived: 0,
      unitCost: Number(formData.unitCost) || 0,
      status: 'In Transit',
    };

    setShipments([newShipment, ...shipments]);
    handleCloseModal();
  };

  const handleCompleteIntake = (poNumber) => {
    setShipments((prev) =>
      prev.map((s) =>
        s.poNumber === poNumber
          ? { ...s, qtyReceived: s.qtyExpected, status: 'Received' }
          : s
      )
    );
    handleCloseModal();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-50 min-h-screen font-sans">
      
      {/* 1. Header & Primary CTA */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center">
            <Truck className="w-5 h-5 mr-2 text-blue-600" /> Inbound Shipments & Stock Intake
          </h2>
          <p className="text-xs text-slate-500">
            Log incoming inventory from suppliers and post updates directly to the ledger.
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedShipment(null);
            setShowReceiveModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center shrink-0 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Log New Inbound Shipment
        </button>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">In Transit</p>
            <p className="text-base font-bold text-slate-900">{stats.inTransit} Shipments</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">In QC Check</p>
            <p className="text-base font-bold text-slate-900">{stats.inQC} Shipments</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Discrepancies</p>
            <p className="text-base font-bold text-rose-600">{stats.discrepancies} Flagged</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Value</p>
            <p className="text-base font-bold text-slate-900">
              ${stats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search PO#, supplier, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>

        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-medium w-full sm:w-auto overflow-x-auto">
          {['All', 'In Transit', 'In QC', 'Received', 'Discrepancy'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-md transition-all shrink-0 cursor-pointer ${
                selectedStatus === st
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Main Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">PO & Item Details</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4">Expected Date</th>
                <th className="py-3.5 px-4">Intake Status</th>
                <th className="py-3.5 px-4">Assigned Bin</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredShipments.length > 0 ? (
                filteredShipments.map((shipment) => (
                  <tr key={shipment.poNumber} className="hover:bg-slate-50/60 transition-colors">
                    {/* Item & PO */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{shipment.itemName}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {shipment.poNumber} • {shipment.sku}
                      </div>
                    </td>

                    {/* Supplier */}
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      <div className="flex items-center">
                        <Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                        {shipment.supplier}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                        {shipment.expectedDate}
                      </div>
                    </td>

                    {/* Qty Progress */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                      {shipment.qtyReceived} / {shipment.qtyExpected} units
                    </td>

                    {/* Bin */}
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 shrink-0" />
                        {shipment.warehouseBin || 'Unassigned'}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">
                      {shipment.status === 'In Transit' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <Clock className="w-3 h-3 mr-1 text-blue-500 animate-spin" /> In Transit
                        </span>
                      )}
                      {shipment.status === 'In QC' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <ShieldCheck className="w-3 h-3 mr-1 text-amber-500" /> In QC Check
                        </span>
                      )}
                      {shipment.status === 'Received' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" /> Posted
                        </span>
                      )}
                      {shipment.status === 'Discrepancy' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertTriangle className="w-3 h-3 mr-1 text-rose-500" /> Discrepancy
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {shipment.status === 'Received' ? (
                        <span className="text-[11px] font-medium text-slate-400 inline-flex items-center">
                          <FileText className="w-3.5 h-3.5 mr-1" /> On Ledger
                        </span>
                      ) : (
                        <button
                          onClick={() => handleOpenProcessModal(shipment)}
                          className="bg-blue-600 hover:bg-slate-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-xs cursor-pointer"
                        >
                          Process Intake
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-slate-600">No shipments found</p>
                    <p className="text-xs mt-0.5">Try adjusting your filters or search terms.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredShipments.length}</strong> inbound shipments
          </span>
          <span className="text-[11px] text-slate-400">All inventory updates sync live with ledger.</span>
        </div>
      </div>

      {/* 5. Inbound / Process Intake Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    {selectedShipment ? `Receive Stock: ${selectedShipment.poNumber}` : 'Log New Inbound Shipment'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {selectedShipment
                      ? 'Confirm physical dock quantities and post to ledger.'
                      : 'Register a new inbound delivery from a supplier.'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            {selectedShipment ? (
              <div className="p-5 space-y-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Item Description:</span>
                    <span className="font-bold text-slate-900">{selectedShipment.itemName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Expected Quantity:</span>
                    <span className="font-bold text-blue-600">{selectedShipment.qtyExpected} units</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-slate-700 space-y-1">
                  <p className="font-semibold">Supplier: {selectedShipment.supplier}</p>
                  <p>Target Bin: <span className="font-mono">{selectedShipment.warehouseBin}</span></p>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCompleteIntake(selectedShipment.poNumber)}
                    className="px-4 py-2 bg-blue-600 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Post Full Stock to Ledger
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateShipment} className="p-5 space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Supplier Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Metro Bakers Ltd"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Item Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Artisan Wheat Bread (500g)"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Expected Qty</label>
                    <input
                      type="number"
                      placeholder="100"
                      value={formData.qtyExpected}
                      onChange={(e) => setFormData({ ...formData, qtyExpected: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Unit Cost ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="2.50"
                      value={formData.unitCost}
                      onChange={(e) => setFormData({ ...formData, unitCost: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Expected Date</label>
                    <input
                      type="date"
                      value={formData.expectedDate}
                      onChange={(e) => setFormData({ ...formData, expectedDate: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Target Storage Bin</label>
                    <input
                      type="text"
                      placeholder="e.g. Aisle 1 - Bay A"
                      value={formData.warehouseBin}
                      onChange={(e) => setFormData({ ...formData, warehouseBin: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Save Inbound Shipment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}