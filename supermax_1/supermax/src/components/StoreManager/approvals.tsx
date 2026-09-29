import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Filter,
  Sparkles,
  CheckSquare,
  Square,
  FileText
} from 'lucide-react';

// Mock Approvals Master Data
const INITIAL_APPROVALS = [
  {
    id: 'po-881',
    category: 'inventory',
    categoryLabel: 'Inventory Order',
    code: 'PO-2026-881',
    title: 'Bulk Dairy & Refrigerated Goods Order',
    amount: 4250.00,
    requestedBy: 'Elena Rostova (Inventory Lead)',
    timeAgo: '22 min ago',
    riskLevel: 'high',
    reason: 'Exceeds standard store auto-approval threshold ($2,000.00).',
    details: {
      supplier: 'FreshDairy Logistics Co.',
      deliveryDate: 'Tomorrow, 06:00 AM',
      items: [
        { name: 'Whole Milk 1Gal (Case of 6)', qty: 40, cost: '$840.00' },
        { name: 'Greek Yogurt Assorted (Case of 12)', qty: 25, cost: '$1,120.00' },
        { name: 'Artisan Cheeses & Butter Stock', qty: 1, cost: '$2,290.00' }
      ]
    }
  },
  {
    id: 'hr-042',
    category: 'payroll',
    categoryLabel: 'Payroll & Staffing',
    code: 'HR-STF-042',
    title: 'Role Elevation & Wage Adjustment — Senior Cashier',
    amount: 1240.00, // Monthly impact estimate
    requestedBy: 'Marcus Vance (Shift Supervisor)',
    timeAgo: '1 hour ago',
    riskLevel: 'medium',
    reason: 'Off-cycle wage increase request from $14.50/hr to $17.00/hr.',
    details: {
      employee: 'Maya Davis (ID: #4092)',
      tenure: '1 year, 4 months',
      justification: 'Passed Senior Cashier certification and assigned lead register closing duties.'
    }
  },
  {
    id: 'inc-890',
    category: 'spoilage',
    categoryLabel: 'Spoilage Write-Off',
    code: 'INC-890',
    title: 'Freezer Unit #3 Defrost Loss Write-off',
    amount: 620.00,
    requestedBy: 'David Kim (Floor Manager)',
    timeAgo: '3 hours ago',
    riskLevel: 'high',
    reason: 'Requires store manager sign-off to write off damaged perishables to ledger.',
    details: {
      unitId: 'FRZ-03 (Meat & Poultry)',
      duration: '45 mins out of spec (Temp spiked to 48°F)',
      actionTaken: 'Compressor reset by tech; damaged stock pulled and logged.'
    }
  },
  {
    id: 'po-884',
    category: 'inventory',
    categoryLabel: 'Inventory Order',
    code: 'PO-2026-884',
    title: 'Emergency Bakery Packaging Supplies',
    amount: 890.00,
    requestedBy: 'Elena Rostova (Inventory Lead)',
    timeAgo: '5 hours ago',
    riskLevel: 'low',
    reason: 'Expedited shipping surcharge added due to stockout risk.',
    details: {
      supplier: 'EcoPack Solutions Inc.',
      deliveryDate: 'Today, 04:00 PM',
      items: [
        { name: 'Biodegradable Cake Boxes (500ct)', qty: 2, cost: '$540.00' },
        { name: 'Custom Printed Pastry Bags', qty: 5, cost: '$350.00' }
      ]
    }
  }
];



export default function Approvals() {
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Filter Logic
  const filteredApprovals = useMemo(() => {
    return approvals.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [approvals, selectedCategory, searchQuery]);

  // Total pending dollar value calculation
  const totalPendingValue = useMemo(() => {
    return approvals.reduce((sum, item) => sum + item.amount, 0);
  }, [approvals]);

  // Multi-select handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredApprovals.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredApprovals.map((i) => i.id));
    }
  };

  const toggleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Actions
  const handleSingleAction = (id, actionType) => {
    setApprovals((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((i) => i !== id));
    showToast(`Request ${actionType === 'approve' ? 'Approved' : 'Rejected'} successfully.`);
  };

  const handleBulkAction = (actionType) => {
    setApprovals((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    showToast(`${selectedIds.length} Requests ${actionType === 'approve' ? 'Approved' : 'Rejected'} in bulk.`);
    setSelectedIds([]);
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

      {/* Top Header & Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Authorizations</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{approvals.length}</p>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Capital Value</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">
              ${totalPendingValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High Risk Overrides</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-0.5">
              {approvals.filter((a) => a.riskLevel === 'high').length} Urgent
            </p>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Approvals Card */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col">
        {/* Controls Toolbar */}
        <div className="p-4 border-b border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-50/50 rounded-t-xl">
          
          {/* Category Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-2 sm:pb-0">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'inventory', label: 'Inventory' },
              { id: 'payroll', label: 'HR & Payroll' },
              { id: 'spoilage', label: 'Spoilage' }
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === tab.id
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by code, title, staff..."
              className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Bulk Action Header Bar (Triggers when items selected) */}
        {selectedIds.length > 0 && (
          <div className="bg-blue-50/80 px-4 py-2.5 border-b border-blue-100 flex items-center justify-between animate-fade-in">
            <span className="text-xs font-semibold text-blue-900">
              {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} selected
            </span>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleBulkAction('approve')}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Bulk Approve
              </button>
              <button
                type="button"
                onClick={() => handleBulkAction('reject')}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1"
              >
                <XCircle className="w-3.5 h-3.5" /> Bulk Reject
              </button>
            </div>
          </div>
        )}

        {/* Approval Items List */}
        <div className="divide-y divide-slate-100">
          {filteredApprovals.length > 0 ? (
            filteredApprovals.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const isExpanded = expandedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`transition-colors ${
                    isSelected ? 'bg-blue-50/30' : 'hover:bg-slate-50/60'
                  }`}
                >
                  {/* Primary Row Content */}
                  <div className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4">
                    <div className="flex items-start space-x-3 min-w-0">
                      
                      {/* Select Checkbox */}
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(item.id)}
                        className="mt-0.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300" />
                        )}
                      </button>

                      {/* Info & Badges */}
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100 text-slate-700">
                            {item.categoryLabel}
                          </span>
                          <span className="text-xs font-mono text-slate-400">{item.code}</span>
                          
                          {item.riskLevel === 'high' && (
                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-100 text-rose-800 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> High Risk
                            </span>
                          )}
                        </div>

                        <h3 className="text-sm font-semibold text-slate-900 truncate">
                          {item.title}
                        </h3>

                        <div className="flex items-center space-x-3 text-xs text-slate-500 flex-wrap">
                          <span>By <strong className="text-slate-700 font-medium">{item.requestedBy}</strong></span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> {item.timeAgo}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Amount & Actions */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-extrabold text-slate-900">
                          ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <button
                          type="button"
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center justify-end gap-0.5 mt-0.5"
                        >
                          {isExpanded ? 'Hide details' : 'Inspect'}
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => handleSingleAction(item.id, 'approve')}
                          className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSingleAction(item.id, 'reject')}
                          className="p-1.5 text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Inspection Drawer */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 bg-slate-50/80 border-t border-slate-100 text-xs text-slate-600 space-y-3 animate-fade-in">
                      <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-lg text-amber-900">
                        <strong className="font-semibold">Authorization Rationale:</strong> {item.reason}
                      </div>

                      {/* Extended Inspector Breakdown */}
                      {item.details.items && (
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-700">Line Items Breakdown:</p>
                          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden divide-y divide-slate-100">
                            {item.details.items.map((line, idx) => (
                              <div key={idx} className="px-3 py-2 flex justify-between">
                                <span>{line.name} (x{line.qty})</span>
                                <span className="font-semibold text-slate-900">{line.cost}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.details.employee && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-3 rounded-lg border border-slate-200">
                          <div><span className="text-slate-400">Employee:</span> {item.details.employee}</div>
                          <div><span className="text-slate-400">Tenure:</span> {item.details.tenure}</div>
                          <div className="col-span-1 sm:col-span-2"><span className="text-slate-400">Notes:</span> {item.details.justification}</div>
                        </div>
                      )}

                      {item.details.unitId && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-3 rounded-lg border border-slate-200">
                          <div><span className="text-slate-400">Unit ID:</span> {item.details.unitId}</div>
                          <div><span className="text-slate-400">Duration:</span> {item.details.duration}</div>
                          <div className="col-span-1 sm:col-span-2"><span className="text-slate-400">Incident Action:</span> {item.details.actionTaken}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            /* Clean Empty State */
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">All Clear!</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                There are currently no pending authorization requests matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}