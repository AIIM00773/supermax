


import React, { useState } from 'react';
import { FileSpreadsheet, Download, TrendingUp, Calendar } from 'lucide-react';

const STATEMENT_DATA = [
  { lineItem: 'Gross POS Revenue', Q1: 142500, Q2: 158000, Q3: 164200, isHeader: false },
  { lineItem: 'Cost of Goods Sold (COGS)', Q1: -62000, Q2: -68500, Q3: -71000, isHeader: false },
  { lineItem: 'Gross Profit', Q1: 80500, Q2: 89500, Q3: 93200, isHeader: true },
  { lineItem: 'Payroll & Wages Expense', Q1: -28450, Q2: -29100, Q3: -28450, isHeader: false },
  { lineItem: 'Utilities & Cold Storage Overhead', Q1: -5400, Q2: -5800, Q3: -6100, isHeader: false },
  { lineItem: 'Spoilage & Shrinkage Losses', Q1: -1850, Q2: -1400, Q3: -1250, isHeader: false },
  { lineItem: 'Net Operating Income (EBITDA)', Q1: 44800, Q2: 53200, Q3: 57400, isHeader: true },
];

export default function ReportsTab() {
  const [selectedPeriod, setSelectedPeriod] = useState('2026-YTD');

  return (
    <div className="space-y-6">
      {/* Header & Export Actions */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center">
            <FileSpreadsheet className="w-5 h-5 mr-2 text-[#1E3A5F]" />
            Profit & Loss (P&L) Quarterly Statement
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Audited income statement aggregated from general ledger entries</p>
        </div>

        <div className="flex items-center space-x-2">
          <select 
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="py-1.5 px-3 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 font-medium"
          >
            <option value="2026-YTD">FY2026 YTD</option>
            <option value="2025-FULL">FY2025 Full Year</option>
          </select>

          <button className="flex items-center text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer">
            <Download className="w-4 h-4 mr-1.5" /> Export Excel
          </button>
        </div>
      </div>

      {/* Financial Statement Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Financial Category</th>
                <th className="py-3 px-4 text-right">Q1 2026</th>
                <th className="py-3 px-4 text-right">Q2 2026</th>
                <th className="py-3 px-4 text-right">Q3 2026 (MTD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {STATEMENT_DATA.map((row, idx) => (
                <tr key={idx} className={row.isHeader ? 'bg-slate-50/80 font-bold text-slate-900' : 'hover:bg-slate-50 text-slate-700'}>
                  <td className="py-3 px-4">{row.lineItem}</td>
                  <td className={`py-3 px-4 text-right ${row.Q1 < 0 ? 'text-slate-500' : ''}`}>
                    ${Math.abs(row.Q1).toLocaleString()}
                  </td>
                  <td className={`py-3 px-4 text-right ${row.Q2 < 0 ? 'text-slate-500' : ''}`}>
                    ${Math.abs(row.Q2).toLocaleString()}
                  </td>
                  <td className={`py-3 px-4 text-right ${row.Q3 < 0 ? 'text-slate-500' : 'text-emerald-700 font-semibold'}`}>
                    ${Math.abs(row.Q3).toLocaleString()}
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