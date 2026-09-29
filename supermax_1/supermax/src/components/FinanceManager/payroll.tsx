



import React, { useState } from 'react';
import { Users, Play, Clock, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

const INITIAL_ROSTER = [
  { id: 'EMP-101', name: 'Marcus Vance', role: 'Head Store Manager', rate: '$28.00/hr', hours: 160, gross: '$4,480.00', status: 'Ready' },
  { id: 'EMP-102', name: 'Sarah Jenkins', role: 'Inventory Specialist', rate: '$22.00/hr', hours: 152, gross: '$3,344.00', status: 'Advance Issued' },
  { id: 'EMP-103', name: 'David Chen', role: 'POS Cashier Lead', rate: '$19.50/hr', hours: 145, gross: '$2,827.50', status: 'Ready' },
  { id: 'EMP-104', name: 'Aisha Patel', role: 'Cold Storage Operator', rate: '$21.00/hr', hours: 160, gross: '$3,360.00', status: 'Ready' },
];

export default function PayrollTab() {
  const [isRunning, setIsRunning] = useState(false);
  const [lastExecuted, setLastExecuted] = useState(null);

  const handleRunPayroll = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setLastExecuted(new Date().toLocaleTimeString());
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Celery Controller Banner */}
      <div className="bg-[#1E3A5F] rounded-xl text-white p-5 shadow-xs border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Users className="w-5 h-5 text-blue-300" />
            <h3 className="text-base font-bold">Celery Payroll Cron Engine</h3>
            <span className="text-[10px] font-mono bg-blue-500/20 text-blue-200 px-2 py-0.5 rounded border border-blue-400/30">
              celery-beat active
            </span>
          </div>
          <p className="text-xs text-blue-200">
            Calculates hours × wage rates and posts pending payouts automatically on the 1st of every month.
          </p>
        </div>

        <button
          onClick={handleRunPayroll}
          disabled={isRunning}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer shrink-0"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isRunning ? 'Processing Celery Task...' : 'Execute Manual Payroll Run'}</span>
        </button>
      </div>

      {lastExecuted && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
          Batch payroll task executed successfully at {lastExecuted}. Ledger debits queued.
        </div>
      )}

      {/* Roster & Payout Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Active Monthly Payroll Roster (20 Staff)</h3>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
            Total Est. Payout: $28,450.00
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Base Rate</th>
                <th className="py-3 px-4">Logged Hours</th>
                <th className="py-3 px-4">Gross Payout</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {INITIAL_ROSTER.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900">{emp.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{emp.role} • {emp.id}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{emp.rate}</td>
                  <td className="py-3 px-4 text-slate-600">{emp.hours} hrs</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{emp.gross}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      emp.status === 'Advance Issued' 
                        ? 'bg-amber-100 text-amber-800' 
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {emp.status}
                    </span>
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