

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  UserCheck,
  Users,
  Shuffle,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  X,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  MapPin,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';

// Mock Roster & Duty Data
const INITIAL_ROSTER = [
  {
    id: 'rst-101',
    staffName: 'Maya Davis',
    role: 'Senior Cashier',
    avatar: 'MD',
    shiftWindow: 'morning',
    timeRange: '06:00 AM - 02:00 PM',
    hours: 8.0,
    duty: 'Main Checkout #1 & Morning Register Float Reconciliation',
    station: 'Front End',
    status: 'on-duty',
    swapRequested: false
  },
  {
    id: 'rst-102',
    staffName: 'David Kim',
    role: 'Floor Supervisor',
    avatar: 'DK',
    shiftWindow: 'morning',
    timeRange: '06:00 AM - 02:30 PM',
    hours: 8.5,
    duty: 'Morning Store Opening, Perishable Cold-Chain Inspection',
    station: 'Sales Floor',
    status: 'on-duty',
    swapRequested: false
  },
  {
    id: 'rst-103',
    staffName: 'Elena Rostova',
    role: 'General Manager',
    avatar: 'ER',
    shiftWindow: 'morning',
    timeRange: '08:00 AM - 04:30 PM',
    hours: 8.5,
    duty: 'Weekly Vendor Audit & Staffing Operations Review',
    station: 'Admin Office',
    status: 'on-duty',
    swapRequested: false
  },
  {
    id: 'rst-104',
    staffName: 'Marcus Vance',
    role: 'Inventory Lead',
    avatar: 'MV',
    shiftWindow: 'afternoon',
    timeRange: '01:30 PM - 09:30 PM',
    hours: 8.0,
    duty: 'Afternoon Pallet Intake & Stockroom Rack Organization',
    station: 'Stockroom',
    status: 'scheduled',
    swapRequested: true,
    swapDetails: 'Requested swap with Carlos S.'
  },
  {
    id: 'rst-105',
    staffName: 'Carlos Santini',
    role: 'Inventory Specialist',
    avatar: 'CS',
    shiftWindow: 'closing',
    timeRange: '03:00 PM - 11:30 PM',
    hours: 8.5,
    duty: 'Perishables Count & Nightly Stockroom Lockup Procedure',
    station: 'Receiving Dock',
    status: 'scheduled',
    swapRequested: false
  },
  {
    id: 'rst-106',
    staffName: 'Aisha Patel',
    role: 'Cashier Lead',
    avatar: 'AP',
    shiftWindow: 'closing',
    timeRange: '03:30 PM - 11:30 PM',
    hours: 8.0,
    duty: 'Express Register #3 & Store Closing Cash Vault Drop',
    station: 'Front End',
    status: 'scheduled',
    swapRequested: false
  }
];

export default function StaffRoster() {
  const [roster, setRoster] = useState(INITIAL_ROSTER);
  const [selectedShiftWindow, setSelectedShiftWindow] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State for Adding New Shift
  const [newStaffName, setNewStaffName] = useState('');
  const [newRole, setNewRole] = useState('Cashier');
  const [newShiftWindow, setNewShiftWindow] = useState('morning');
  const [newTimeRange, setNewTimeRange] = useState('08:00 AM - 04:00 PM');
  const [newDuty, setNewDuty] = useState('');
  const [newStation, setNewStation] = useState('Front End');

  // Filter Logic
  const filteredRoster = useMemo(() => {
    return roster.filter((item) => {
      const matchesWindow = selectedShiftWindow === 'all' || item.shiftWindow === selectedShiftWindow;
      const matchesRole =
        selectedRole === 'all' || item.role.toLowerCase().includes(selectedRole.toLowerCase());
      const matchesSearch =
        item.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.duty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.station.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesWindow && matchesRole && matchesSearch;
    });
  }, [roster, selectedShiftWindow, selectedRole, searchQuery]);

  // Metric Aggregates
  const onDutyCount = roster.filter((r) => r.status === 'on-duty').length;
  const totalHoursToday = roster.reduce((acc, r) => acc + r.hours, 0);
  const swapRequestsCount = roster.filter((r) => r.swapRequested).length;

  // Handlers
  const handleApproveSwap = (id) => {
    setRoster((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, swapRequested: false, swapDetails: null } : item
      )
    );
    showToast('Shift swap request approved successfully');
  };

  const handleAddShift = (e) => {
    e.preventDefault();
    if (!newStaffName.trim() || !newDuty.trim()) return;

    const initials = newStaffName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newShift = {
      id: `rst-${Date.now()}`,
      staffName: newStaffName,
      role: newRole,
      avatar: initials || 'ST',
      shiftWindow: newShiftWindow,
      timeRange: newTimeRange,
      hours: 8.0,
      duty: newDuty,
      station: newStation,
      status: 'scheduled',
      swapRequested: false
    };

    setRoster([...roster, newShift]);
    setIsModalOpen(false);
    resetForm();
    showToast(`Shift assigned to ${newStaffName}`);
  };

  const resetForm = () => {
    setNewStaffName('');
    setNewRole('Cashier');
    setNewShiftWindow('morning');
    setNewTimeRange('08:00 AM - 04:00 PM');
    setNewDuty('');
    setNewStation('Front End');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 w-7xl px-4 py-4 ">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-lg shadow-xl flex items-center space-x-3 border border-slate-700 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Metric Cards Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active On Duty Now</p>
            <div className="flex items-center space-x-2 mt-0.5">
              <p className="text-2xl font-extrabold text-slate-900">{onDutyCount}</p>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" /> Live
              </span>
            </div>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scheduled Hours Today</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{totalHoursToday} hrs</p>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Shift Swap Requests</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-0.5">{swapRequestsCount} Pending</p>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Roster Table Container */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col">
        {/* Controls Toolbar */}
        <div className="p-4 border-b border-slate-200/80 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/50 rounded-t-xl">
          
          {/* Day Navigator & Shift Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-blue-600 mr-1" />
              <span>Today, Sep 28, 2026</span>
            </div>

            {/* Shift Window Filter Tabs */}
            <div className="flex bg-slate-200/60 p-0.5 rounded-lg">
              {[
                { id: 'all', label: 'All Shifts' },
                { id: 'morning', label: 'Morning' },
                { id: 'afternoon', label: 'Afternoon' },
                { id: 'closing', label: 'Closing' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedShiftWindow(tab.id)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                    selectedShiftWindow === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Role Filter Dropdown */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Roles</option>
              <option value="cashier">Cashiers</option>
              <option value="inventory">Inventory</option>
              <option value="supervisor">Supervisors</option>
              <option value="manager">Management</option>
            </select>
          </div>

          {/* Search & Action CTA */}
          <div className="flex items-center space-x-3">
            <div className="relative flex-1 sm:w-52">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search staff or duty..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Assign Shift</span>
            </button>
          </div>
        </div>

        {/* Staff Shift Roster List */}
        <div className="divide-y divide-slate-100">
          {filteredRoster.length > 0 ? (
            filteredRoster.map((item) => (
              <div key={item.id} className="p-4 sm:p-5 hover:bg-slate-50/60 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left: Staff Identity & Role */}
                  <div className="flex items-start space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                      {item.avatar}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        <h3 className="text-sm font-bold text-slate-900">{item.staffName}</h3>
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 text-slate-700">
                          {item.role}
                        </span>
                        
                        {item.status === 'on-duty' ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> On Duty
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-50 text-blue-700">
                            Scheduled
                          </span>
                        )}

                        {item.swapRequested && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-900 flex items-center gap-1">
                            <ArrowRightLeft className="w-3 h-3" /> Swap Requested
                          </span>
                        )}
                      </div>

                      {/* Assigned Station & Shift Timings */}
                      <div className="flex items-center space-x-4 text-xs text-slate-500 flex-wrap gap-y-1">
                        <span className="flex items-center gap-1 text-slate-700 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> Station: {item.station}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-slate-400" /> {item.timeRange} ({item.hours} hrs)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Duty Assignment Box & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-3 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {/* Duty Callout */}
                    <div className="bg-slate-50 border border-slate-200/80 px-3 py-2 rounded-lg text-xs max-w-xs">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Assigned Duty</span>
                      <p className="text-slate-800 font-medium truncate">{item.duty}</p>
                    </div>

                    {/* Swap Action or More */}
                    {item.swapRequested ? (
                      <button
                        type="button"
                        onClick={() => handleApproveSwap(item.id)}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1 flex-shrink-0"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve Swap
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Shift Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Roster Entries Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No scheduled shifts match your current filters or search term.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Shift Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Assign New Shift & Duty</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddShift} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Employee Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="e.g. Maya Davis"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Role & Title
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Cashier">Cashier</option>
                    <option value="Senior Cashier">Senior Cashier</option>
                    <option value="Inventory Specialist">Inventory Specialist</option>
                    <option value="Floor Supervisor">Floor Supervisor</option>
                    <option value="Bakery Lead">Bakery Lead</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Duty Station
                  </label>
                  <select
                    value={newStation}
                    onChange={(e) => setNewStation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="Front End">Front End Checkout</option>
                    <option value="Sales Floor">Sales Floor</option>
                    <option value="Stockroom">Stockroom / Warehouse</option>
                    <option value="Receiving Dock">Receiving Dock</option>
                    <option value="Admin Office">Admin Office</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Shift Window
                  </label>
                  <select
                    value={newShiftWindow}
                    onChange={(e) => setNewShiftWindow(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="morning">Morning Shift</option>
                    <option value="afternoon">Afternoon Shift</option>
                    <option value="closing">Closing Shift</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Shift Time Range
                  </label>
                  <input
                    type="text"
                    required
                    value={newTimeRange}
                    onChange={(e) => setNewTimeRange(e.target.value)}
                    placeholder="e.g. 06:00 AM - 02:00 PM"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Duty & Task Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={newDuty}
                  onChange={(e) => setNewDuty(e.target.value)}
                  placeholder="Describe specific assigned tasks for this shift..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Assign Shift</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}