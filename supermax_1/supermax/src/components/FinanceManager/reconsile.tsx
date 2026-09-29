import React, { useState } from 'react';
import { Scale, ShieldCheck, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const UNRECONCILED_ITEMS = [
  { id: 'REC-301', date: 'Today, 09:40', source: 'Inventory Subsystem', item: 'Freezer Unit 3 Meat Spoilage', amount: '$620.00', reason: 'Threshold Exceeded ($500 max auto-approve)' },
  { id: 'REC-302', date: 'Yesterday, 18:10', source: 'POS Terminal 2', item: 'Cash Register Variance Shortage', amount: '$45.50', reason: 'Physical Cash vs Terminal Ledger Mismatch' },
];

export default function ReconciliationTab() {
  const [items, setItems] = useState(UNRECONCILED_ITEMS);

  const handleAction = (id, action) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* ACID System Integrity Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-start space-x-4">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">PostgreSQL Atomic Transaction Context</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            All inventory movements and POS settlements commit inside isolation level <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono text-[10px]">REPEATABLE READ</code>. Discrepancies are held in an unreconciled buffer requiring manager signature.
          </p>
        </div>
      </div>

      {/* Pending Approval Queue */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <Scale className="w-4 h-4 mr-2 text-amber-600" />
            Pending Reconciliation Approvals ({items.length})
          </h3>
        </div>

        {items.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            All transactions reconciled. Ledger balance verified.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{item.item}</span>
                    <span className="text-[10px] font-mono text-slate-400">({item.id})</span>
                    <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded font-semibold">
                      {item.amount}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{item.reason}</p>
                  <p className="text-[10px] text-slate-400">Source: {item.source} • {item.date}</p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button 
                    onClick={() => handleAction(item.id, 'approve')}
                    className="flex items-center px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Sign Off
                  </button>
                  <button 
                    onClick={() => handleAction(item.id, 'reject')}
                    className="flex items-center px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1 text-slate-500" /> Dispute
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}