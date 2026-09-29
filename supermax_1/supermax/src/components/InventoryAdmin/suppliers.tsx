


import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  Plus,
  Star,
  Phone,
  Mail,
  MapPin,
  Package,
  Clock,
  ShieldCheck,
  TrendingUp,
  X,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

// --- MOCK SUPPLIER DATA ---
const INITIAL_SUPPLIERS = [
  {
    id: 'sup-1',
    name: 'Kiambu Dairy Coop',
    category: 'Dairy & Fresh Produce',
    contactPerson: 'David Karanja',
    email: 'orders@kiambudairy.co.ke',
    phone: '+254 712 345 678',
    location: 'Kiambu, Kenya',
    status: 'Verified',
    rating: 4.9,
    onTimeDelivery: '98.5%',
    avgLeadTime: '1-2 Days',
    activeSKUs: 12,
    totalOrders: 142,
  },
  {
    id: 'sup-2',
    name: 'Highland Prime Meats',
    category: 'Meat & Poultry',
    contactPerson: 'Sarah Jenkins',
    email: 'sales@highlandmeats.com',
    phone: '+254 722 987 654',
    location: 'Nairobi, Kenya',
    status: 'Verified',
    rating: 4.8,
    onTimeDelivery: '96.2%',
    avgLeadTime: '2 Days',
    activeSKUs: 8,
    totalOrders: 89,
  },
  {
    id: 'sup-3',
    name: 'Metro Bakers Ltd',
    category: 'Bakery & Confectionery',
    contactPerson: 'Alex Mercer',
    email: 'supply@metrobakers.com',
    phone: '+254 733 112 233',
    location: 'Thika, Kenya',
    status: 'Verified',
    rating: 4.7,
    onTimeDelivery: '99.1%',
    avgLeadTime: '1 Day',
    activeSKUs: 15,
    totalOrders: 210,
  },
  {
    id: 'sup-4',
    name: 'Mediterranean Imports',
    category: 'Pantry & Specialty',
    contactPerson: 'Elena Rossi',
    email: 'elena@medimports.com',
    phone: '+254 788 445 566',
    location: 'Mombasa, Kenya',
    status: 'Under Review',
    rating: 4.3,
    onTimeDelivery: '91.0%',
    avgLeadTime: '4-5 Days',
    activeSKUs: 6,
    totalOrders: 34,
  },
  {
    id: 'sup-5',
    name: 'Fresh Harvest Distro',
    category: 'Fruits & Vegetables',
    contactPerson: 'Joseph Omondi',
    email: 'j.omondi@freshharvest.co.ke',
    phone: '+254 701 554 433',
    location: 'Naivasha, Kenya',
    status: 'Verified',
    rating: 4.9,
    onTimeDelivery: '97.8%',
    avgLeadTime: '1 Day',
    activeSKUs: 22,
    totalOrders: 175,
  },
];

export default function SupplierNetwork({ inventoryItems = [] }) {
  // Populate suppliers from inventory items if passed, else fallback to rich default mock data
  const [suppliers, setSuppliers] = useState(() => {
    if (inventoryItems && inventoryItems.length > 0) {
      const uniqueNames = Array.from(new Set(inventoryItems.map((i) => i.supplier)));
      return uniqueNames.map((name, index) => ({
        id: `sup-derived-${index}`,
        name: name || 'Unassigned Supplier',
        category: 'General Supplier',
        contactPerson: 'Vendor Support',
        email: `contact@${(name || 'supplier').toLowerCase().replace(/\s+/g, '')}.com`,
        phone: '+254 700 000 000',
        location: 'Central Distribution',
        status: 'Verified',
        rating: 4.8,
        onTimeDelivery: '97.0%',
        avgLeadTime: '2 Days',
        activeSKUs: inventoryItems.filter((item) => item.supplier === name).length || 1,
        totalOrders: 15,
      }));
    }
    return INITIAL_SUPPLIERS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSupplierSKUs, setSelectedSupplierSKUs] = useState(null);

  // Form state for adding new supplier
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    category: 'General',
    contactPerson: '',
    email: '',
    phone: '',
    location: '',
    avgLeadTime: '2 Days',
  });

  // --- STATS CALCULATIONS ---
  const stats = useMemo(() => {
    const totalCount = suppliers.length;
    const verifiedCount = suppliers.filter((s) => s.status === 'Verified').length;
    const totalSKUsSupplied = suppliers.reduce((acc, s) => acc + (s.activeSKUs || 0), 0);
    const avgRating = (
      suppliers.reduce((acc, s) => acc + Number(s.rating || 5), 0) / (totalCount || 1)
    ).toFixed(1);

    return { totalCount, verifiedCount, totalSKUsSupplied, avgRating };
  }, [suppliers]);

  // --- FILTERING ---
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(suppliers.map((s) => s.category)))];
  }, [suppliers]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [suppliers, searchQuery, selectedCategory]);

  // --- HANDLERS ---
  const handleAddSupplierSubmit = (e) => {
    e.preventDefault();
    if (!newSupplier.name) return;

    const created = {
      ...newSupplier,
      id: `sup-${Date.now()}`,
      status: 'Verified',
      rating: 5.0,
      onTimeDelivery: '100%',
      activeSKUs: 0,
      totalOrders: 0,
    };

    setSuppliers([created, ...suppliers]);
    setShowAddModal(false);
    setNewSupplier({
      name: '',
      category: 'General',
      contactPerson: '',
      email: '',
      phone: '',
      location: '',
      avgLeadTime: '2 Days',
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-slate-50 min-h-screen font-sans">
      
      {/* 1. Header & Action CTA */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-blue-600" /> Active Supplier Network
          </h2>
          <p className="text-xs text-slate-500">
            Manage verified logistics vendors, monitor supply reliability metrics, and track active SKU coverage.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center shrink-0 transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add New Supplier
        </button>
      </div>

      {/* 2. Key Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Active Vendors</p>
            <p className="text-base font-bold text-slate-900">{stats.totalCount} Companies</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Verified Rate</p>
            <p className="text-base font-bold text-emerald-600">
              {Math.round((stats.verifiedCount / (stats.totalCount || 1)) * 100)}% Verified
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">SKUs Supplied</p>
            <p className="text-base font-bold text-slate-900">{stats.totalSKUsSupplied} Items</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Avg Network Score</p>
            <p className="text-base font-bold text-slate-900">{stats.avgRating} / 5.0</p>
          </div>
        </div>
      </div>

      {/* 3. Search & Category Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search vendor name, contact, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-medium w-full sm:w-auto overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-md transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Suppliers Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSuppliers.length > 0 ? (
          filteredSuppliers.map((supplier) => (
            <div
              key={supplier.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                        {supplier.name}
                      </h3>
                      {supplier.status === 'Verified' ? (
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" title="Verified Vendor" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" title="Under Review" />
                      )}
                    </div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      {supplier.category}
                    </span>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center space-x-1 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md text-[11px] font-bold text-amber-800">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                    <span>{supplier.rating}</span>
                  </div>
                </div>

                {/* Performance Metrics Row */}
                <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-center">
                  <div>
                    <span className="block text-[10px] text-slate-400 font-medium">SKUs</span>
                    <span className="font-bold text-xs text-slate-800">{supplier.activeSKUs}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-medium">On-Time</span>
                    <span className="font-bold text-xs text-emerald-600">{supplier.onTimeDelivery}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-medium">Lead Time</span>
                    <span className="font-bold text-xs text-slate-800">{supplier.avgLeadTime}</span>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center">
                    <Building2 className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                    <span className="font-medium text-slate-800">{supplier.contactPerson}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                    <a href={`mailto:${supplier.email}`} className="hover:underline text-blue-600 truncate">
                      {supplier.email}
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-2 text-slate-400 shrink-0" />
                    <span>{supplier.location}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">
                  {supplier.totalOrders} total purchase orders
                </span>
                <button
                  onClick={() => setSelectedSupplierSKUs(supplier)}
                  className="text-blue-600 hover:text-slate-900 font-bold flex items-center transition-colors cursor-pointer"
                >
                  View Details <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white p-12 rounded-xl border border-slate-200 text-center">
            <Building2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700">No suppliers found</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting your search query or category filter.</p>
          </div>
        )}
      </div>

      {/* 5. Add New Supplier Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">Register New Supplier</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSupplierSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Fresh Produce Co."
                  value={newSupplier.name}
                  onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Dairy, Meats, Oils"
                    value={newSupplier.category}
                    onChange={(e) => setNewSupplier({ ...newSupplier, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    value={newSupplier.contactPerson}
                    onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="orders@company.com"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+254 700 000000"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location / Hub</label>
                  <input
                    type="text"
                    placeholder="e.g. Nairobi, Kenya"
                    value={newSupplier.location}
                    onChange={(e) => setNewSupplier({ ...newSupplier, location: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Lead Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 1-2 Days"
                    value={newSupplier.avgLeadTime}
                    onChange={(e) => setNewSupplier({ ...newSupplier, avgLeadTime: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-colors shadow-xs flex items-center cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Vendor Detail / SKU Catalog Drawer */}
      {selectedSupplierSKUs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{selectedSupplierSKUs.name}</h3>
                  <p className="text-[11px] text-slate-500">{selectedSupplierSKUs.category} Vendor Profile</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSupplierSKUs(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact Person:</span>
                  <span className="font-bold text-slate-800">{selectedSupplierSKUs.contactPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Logistics Rating:</span>
                  <span className="font-bold text-amber-600">{selectedSupplierSKUs.rating} / 5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">On-Time SLA:</span>
                  <span className="font-bold text-emerald-600">{selectedSupplierSKUs.onTimeDelivery}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-blue-900">
                <p className="font-semibold mb-1">Active Procurement Line</p>
                <p className="text-[11px] text-blue-700">
                  This vendor actively supplies {selectedSupplierSKUs.activeSKUs} catalog SKUs with an average lead time of {selectedSupplierSKUs.avgLeadTime}.
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedSupplierSKUs(null)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}