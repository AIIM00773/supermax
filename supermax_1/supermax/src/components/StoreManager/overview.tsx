import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Bell, 
  ArrowUpRight,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';

// Initial Mock Data
const INITIAL_APPROVALS = [
  {
    id: 'po-881',
    category: 'Inventory Order',
    code: 'PO-2026-881',
    title: 'Bulk Dairy Supplier Order Request ($4,250.00)',
    subtitle: 'Submitted by Inventory Admin • Exceeds $2,000 auto-approval limit',
    badgeStyle: 'bg-purple-100 text-purple-800',
  },
  {
    id: 'hr-042',
    category: 'Payroll & Staffing',
    code: 'HR-STF-042',
    title: 'Role Elevation & Wage Adjustment — Senior Cashier',
    subtitle: 'Promoting M. Davis from $14.50/hr to $17.00/hr',
    badgeStyle: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'inc-890',
    category: 'Spoilage Write-Off',
    code: 'INC-890',
    title: 'Freezer Unit 3 Defrost — $620 Meat Loss',
    subtitle: 'Write-off requires manager signature to post to ledger',
    badgeStyle: 'bg-rose-100 text-rose-800',
  },
];

const DEPARTMENTS = [
  { name: 'Fresh Produce', revenue: '$8,410.00', percent: 85, color: 'bg-emerald-500', text: 'text-emerald-600' },
  { name: 'Packaged Grocery', revenue: '$12,180.00', percent: 92, color: 'bg-blue-600', text: 'text-blue-600' },
  { name: 'Bakery & Cold Foods', revenue: '$4,260.00', percent: 64, color: 'bg-amber-500', text: 'text-amber-600' },
];

export default function Overview() {
  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMessage, setActionMessage] = useState(null);

  // Handle Approvals Queue Actions
  const handleAction = (id, actionType) => {
    setApprovals((prev) => prev.filter((item) => item.id !== id));
    
    // Quick notification banner
    setActionMessage(`Item ${actionType === 'approve' ? 'Approved' : 'Rejected'} successfully.`);
    setTimeout(() => setActionMessage(null), 3000);
  };

  // Filtered Queue based on Search
  const filteredApprovals = useMemo(() => {
    if (!searchQuery.trim()) return approvals;
    const query = searchQuery.toLowerCase();
    return approvals.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query)
    );
  }, [approvals, searchQuery]);

  return (
    <div className="space-y-6 w-7xl px-6 py-4 ">
      {/* Top Header Bar */}
      <header className="bg-white border border-slate-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center space-x-3">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Manager Operations Center
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Store #104 — Central
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Real-time daily KPI summary and authorization queue</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search authorizations..."
              className="w-full pl-9 pr-4 py-1.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <button 
            type="button" 
            className="relative p-2 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {approvals.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
            )}
          </button>
        </div>
      </header>

      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="p-3 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-lg flex items-center justify-between animate-fade-in">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Executive KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Daily Revenue</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">$24,850.00</p>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs font-semibold text-emerald-600">
            <ArrowUpRight className="w-4 h-4 mr-0.5" />
            <span>12.4% vs target</span>
            <span className="text-slate-400 font-normal ml-1.5">($22.1k base)</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Profit Margin</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">18.6%</p>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">After payroll & spoilage deductions</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Staff On-Duty</p>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">16 / 20</p>
            </div>
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-indigo-600 mt-3 font-medium">4 Cashiers, 3 Stockers active now</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High Risk Alerts</p>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">{approvals.length} Pending</p>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">Requires executive sign-off</p>
        </div>
      </div>

      {/* Actionable Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Approvals Queue */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col">
          <div className="p-5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                Manager Authorization Queue
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">High-impact operational overrides</p>
            </div>
            <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md border border-blue-200">
              {approvals.length} Pending
            </span>
          </div>

          <ul className="divide-y divide-slate-100 flex-1">
            {filteredApprovals.length > 0 ? (
              filteredApprovals.map((item) => (
                <li key={item.id} className="p-5 hover:bg-slate-50/80 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${item.badgeStyle}`}>
                          {item.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{item.code}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                      <p className="text-xs text-slate-500">{item.subtitle}</p>
                    </div>
                    <div className="flex items-center space-x-2 self-end sm:self-center flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleAction(item.id, 'approve')}
                        className="flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(item.id, 'reject')}
                        className="flex items-center text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <XCircle className="w-4 h-4 mr-1" /> Reject
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="p-8 text-center">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-slate-800">Queue completely clear!</p>
                <p className="text-xs text-slate-400 mt-1">No pending manager authorizations require action right now.</p>
              </li>
            )}
          </ul>
        </div>

        {/* Department Efficiency Summary */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">Department Efficiency</h3>
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            </div>

            <div className="space-y-4">
              {DEPARTMENTS.map((dept) => (
                <div key={dept.name} className="p-3 bg-slate-50 rounded-lg border border-slate-200/60">
                  <div className="flex justify-between items-baseline">
                    <p className="text-xs font-medium text-slate-600">{dept.name}</p>
                    <p className="text-sm font-bold text-slate-900">{dept.revenue}</p>
                  </div>
                  <div className="w-full bg-slate-200/80 h-1.5 rounded-full mt-2.5 overflow-hidden">
                    <div className={`${dept.color} h-full transition-all duration-500`} style={{ width: `${dept.percent}%` }} />
                  </div>
                  <span className={`text-[10px] font-semibold ${dept.text} mt-1.5 block`}>
                    {dept.percent}% daily target reached
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">Store Efficiency Score: <span className="text-emerald-600 font-bold">81%</span></p>
          </div>
        </div>

      </div>
    </div>
  );
}