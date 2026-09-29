import React, { useState } from 'react';
import { User, Lock, Shield, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useUser } from '../contexts/user';

export default function LoginPage() {
  const { login, roles, authentication_state, authentication_error } = useUser();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: '' as USERROLE | '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role) return;
    
    login(
      formData.username, 
      formData.password, 
      formData.role as USERROLE
    );
  };

  const isLoading = authentication_state === 'validating' || authentication_state === 'loading';

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center items-center space-x-3 mb-3">
          <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="8" width="14" height="32" rx="2" fill="#2563EB" />
            <rect x="26" y="8" width="14" height="14" rx="2" fill="#60A5FA" />
            <rect x="26" y="26" width="14" height="14" rx="2" fill="#94A3B8" />
          </svg>
          <span className="text-3xl font-extrabold text-white tracking-tight">Supermax</span>
        </div>
        <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold">
          Retail Enterprise Platform
        </p>
      </div>

      {/* Main Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-200">
          
          {/* Authentication Error Banner */}
          {authentication_error && (
            <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start space-x-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{authentication_error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Username
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  className="focus:ring-2 focus:ring-blue-600 focus:border-blue-600 block w-full pl-9 pr-3 text-sm border-slate-300 rounded-lg py-2.5 border outline-none transition-colors bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400"
                  placeholder="e.g. admin_david"
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  className="focus:ring-2 focus:ring-blue-600 focus:border-blue-600 block w-full pl-9 pr-3 text-sm border-slate-300 rounded-lg py-2.5 border outline-none transition-colors bg-slate-50 focus:bg-white text-slate-900 placeholder-slate-400"
                  placeholder="••••••••"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {/* Role Selection Dropdown */}
            <div>
              <label htmlFor="role" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                System Role
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-4 w-4 text-slate-400" />
                </div>
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  className="focus:ring-2 focus:ring-blue-600 focus:border-blue-600 block w-full pl-9 pr-3 text-sm border-slate-300 rounded-lg py-2.5 border outline-none appearance-none transition-colors bg-slate-50 focus:bg-white text-slate-900"
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as USERROLE })}
                >
                  <option value="" disabled>
                    Select operational role...
                  </option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-[#1E3A5F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    Access Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Protected by Supermax RBAC Security & System Audit Policy
        </p>
      </div>

    </div>
  );
}