import React, { useState } from 'react';
import { 
  Receipt, Search, Filter, CheckCircle2, AlertCircle, 
  ArrowUpRight, ArrowDownRight, Download 
} from 'lucide-react';

const INITIAL_TRANSACTIONS = [
  { id: 'TRX-9104', timestamp: 'Today, 14:32', description: 'POS Terminal Batch Settlement (Reg 1-5)', category: 'Revenue', type: 'credit', amount: 14280.00, status: 'Reconciled' },
  { id: 'TRX-9103', timestamp: 'Today, 11:15', description: 'PO-2026-901 Dairy Supplier Stock Intake', category: 'Inventory Cost', type: 'debit', amount: 4250.00, status: 'Reconciled' },
  { id: 'TRX-9102', timestamp: 'Today, 09:40', description: 'Freezer Unit 3 Meat Spoilage Write-Off', category: 'Spoilage Loss', type: 'debit', amount: 620.00, status: 'Pending Review' },
  { id: 'TRX-9101', timestamp: 'Yesterday', description: 'Utility Bill Settlement (Water & Cold Storage)', category: 'Overhead', type: 'debit', amount: 1850.00, status: 'Reconciled' },
  { id: 'TRX-9100', timestamp: 'Yesterday', description: 'Mid-Month Advance Payout (Staff #102)', category: 'Payroll Advance', type: 'debit', amount: 350.00, status: 'Reconciled' },
];

export default function LedgerTab() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const filtered = INITIAL_TRANSACTIONS.filter((trx) => {
    const matchesSearch = trx.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          trx.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || trx.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Mini Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs font-medium text-slate-400">Total Credits (MTD)</p>
          <p className="text-xl font-bold text-emerald-600 mt-1">+$14,280.00</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs font-medium text-slate-400">Total Debits (MTD)</p>
          <p className="text-xl font-bold text-slate-900 mt-1">-$7,070.00</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <p className="text-xs font-medium text-slate-400">Pending Approvals</p>
          <p className="text-xl font-bold text-amber-600 mt-1">1 Item ($620.00)</p>
        </div>
      </div>

      {/* Main Ledger Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center">
              <Receipt className="w-5 h-5 mr-2 text-[#1E3A5F]" />
              General Financial Ledger
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Real-time immutable debit/credit entries synced across departments</p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search description or ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-600 bg-white w-48 sm:w-56"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="py-1.5 px-2.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:outline-hidden"
            >
              <option value="All">All Categories</option>
              <option value="Revenue">Revenue</option>
              <option value="Inventory Cost">Inventory Cost</option>
              <option value="Spoilage Loss">Spoilage Loss</option>
              <option value="Overhead">Overhead</option>
            </select>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">TRX Reference & Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-900">{trx.description}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{trx.id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {trx.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">{trx.timestamp}</td>
                  <td className="py-3.5 px-4 font-bold">
                    <span className={trx.type === 'credit' ? 'text-emerald-600' : 'text-slate-900'}>
                      {trx.type === 'credit' ? '+' : '-'}${trx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {trx.status === 'Reconciled' ? (
                      <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Reconciled
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600" /> Pending Sign-off
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

