import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Receipt, 
  FileSpreadsheet, 
  Bell, 
  Menu, 
  CreditCard,
  Scale,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';

import Sider from "../../components/FinanceManager/sider"; 

// Import Tab Components
import LedgerTab from '../../components/FinanceManager/overview';
import PayrollTab from '../../components/FinanceManager/payroll';
import ReconciliationTab from '../../components/FinanceManager/reconsile';
import ReportsTab from '../../components/FinanceManager/reports';



export default function FinanceManagerDashboard() {
  const [activeTab, setActiveTab] = useState('ledger');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Shared tabs configuration array
  const tabsList = [
    { id: 'ledger', label: 'Financial Ledger', icon: Receipt },
    { id: 'payroll', label: 'Automated Payroll Engine', icon: Users, count: 'Due 1st' },
    { id: 'reconciliation', label: 'ACID Audit Trail', icon: Scale },
    { id: 'reports', label: 'P&L Statements', icon: FileSpreadsheet },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar Navigation */}
      <Sider 
        tabsList={tabsList}
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              aria-label="Open mobile navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-slate-900">
              Financial Accounting & Ledger Controller
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg transition-colors border border-slate-200 cursor-pointer">
              <FileSpreadsheet className="w-4 h-4 mr-1.5 text-slate-500" /> Export CSV Ledger
            </button>
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 rounded-lg border border-slate-200 cursor-pointer">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Workspace */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Financial KPI Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Monthly Cash Flow</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">+$48,920.00</p>
                </div>
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-emerald-600 mt-3 font-medium flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> +8.2% gross margin vs last month
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pending Monthly Payroll</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">$28,450.00</p>
                </div>
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 font-medium">Celery Cron triggers in 4 days</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inventory Outlay (MTD)</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">$32,180.00</p>
                </div>
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <CreditCard className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 font-medium">Auto-deducted via atomic stock intake</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unreconciled Items</p>
                  <p className="text-2xl font-extrabold text-amber-600 mt-1">1 Item</p>
                </div>
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-lg">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-3 font-medium">$620 Meat Loss pending Manager sign-off</p>
            </div>
          </div>

          {/* Dynamic Tab Navigation Bar */}
          <div className="bg-white rounded-xl border border-slate-200 px-4 sm:px-6 shadow-xs">
            <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
              {tabsList.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer
                      ${isActive 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                      }
                    `}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                    {tab.count && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Conditional Tab Rendering Workspace */}
          <div className="min-h-[400px]">
            {activeTab === 'ledger' && <LedgerTab />}
            {activeTab === 'payroll' && <PayrollTab />}
            {activeTab === 'reconciliation' && <ReconciliationTab />}
            {activeTab === 'reports' && <ReportsTab />}
          </div>

        </div>
      </main>
    </div>
  );
}
