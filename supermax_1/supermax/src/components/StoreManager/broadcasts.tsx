import React, { useState, useMemo } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  Pin,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Send,
  Archive,
  MoreVertical,
  Bell,
  Sparkles,
  X,
  ChevronRight,
  Filter,
  ShieldAlert
} from 'lucide-react';

// Mock Broadcasts Initial Data
const INITIAL_BROADCASTS = [
  {
    id: 'bc-101',
    title: 'POS Terminal System Maintenance Tonight',
    priority: 'urgent',
    audience: 'all-staff',
    audienceLabel: 'All Store Staff',
    author: 'Elena Rostova (General Manager)',
    timeAgo: '45 min ago',
    pinned: true,
    status: 'active',
    content: 'All register terminals will undergo a software patch tonight between 11:30 PM and 01:00 AM. Please ensure all cash drawer balancing and batch cut-offs are completed before 11:15 PM sharp.',
    stats: {
      targeted: 28,
      read: 22,
      acknowledged: 19
    },
    requiresAck: true
  },
  {
    id: 'bc-102',
    title: 'Revised Produce Department Cold-Chain Guidelines',
    priority: 'normal',
    audience: 'inventory-team',
    audienceLabel: 'Inventory & Floor Team',
    author: 'David Kim (Floor Lead)',
    timeAgo: '3 hours ago',
    pinned: false,
    status: 'active',
    content: 'Effective immediately, all cold-chain logs for cooler #2 and #4 must be logged bi-hourly instead of every 4 hours due to high summer ambient temperatures.',
    stats: {
      targeted: 8,
      read: 8,
      acknowledged: 7
    },
    requiresAck: true
  },
  {
    id: 'bc-103',
    title: 'Q3 Customer Experience Recognition & Rewards',
    priority: 'low',
    audience: 'all-staff',
    audienceLabel: 'All Store Staff',
    author: 'Marcus Vance (Shift Supervisor)',
    timeAgo: 'Yesterday',
    pinned: false,
    status: 'active',
    content: 'Shoutout to the evening shift cashiers for achieving a 98% customer satisfaction rating this week! Gift cards have been added to your breakroom lockers.',
    stats: {
      targeted: 28,
      read: 26,
      acknowledged: 20
    },
    requiresAck: false
  },
  {
    id: 'bc-104',
    title: 'Emergency Drill Schedule for Friday Morning',
    priority: 'urgent',
    audience: 'shift-leads',
    audienceLabel: 'Shift Leads & Supervisors',
    author: 'Elena Rostova (General Manager)',
    timeAgo: '2 days ago',
    pinned: false,
    status: 'archived',
    content: 'Fire alarm testing and evacuation walk-through will take place Friday at 07:15 AM prior to store doors opening. Please review duty assignments in the binder.',
    stats: {
      targeted: 6,
      read: 6,
      acknowledged: 6
    },
    requiresAck: true
  }
];

export default function StoreBroadcasts() {
  const [broadcasts, setBroadcasts] = useState(INITIAL_BROADCASTS);
  const [selectedAudience, setSelectedAudience] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New Broadcast Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('normal');
  const [newAudience, setNewAudience] = useState('all-staff');
  const [newContent, setNewContent] = useState('');
  const [newPinned, setNewPinned] = useState(false);
  const [newRequiresAck, setNewRequiresAck] = useState(true);

  // Filter Logic
  const filteredBroadcasts = useMemo(() => {
    return broadcasts.filter((item) => {
      const matchesAudience = selectedAudience === 'all' || item.audience === selectedAudience;
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesAudience && matchesStatus && matchesSearch;
    });
  }, [broadcasts, selectedAudience, selectedStatus, searchQuery]);

  // Aggregate Metrics
  const activeCount = broadcasts.filter((b) => b.status === 'active').length;
  const urgentCount = broadcasts.filter((b) => b.status === 'active' && b.priority === 'urgent').length;
  const avgReadRate = useMemo(() => {
    const activeBroadcasts = broadcasts.filter((b) => b.status === 'active');
    if (!activeBroadcasts.length) return 0;
    const totalRates = activeBroadcasts.reduce(
      (acc, b) => acc + (b.stats.read / b.stats.targeted) * 100,
      0
    );
    return Math.round(totalRates / activeBroadcasts.length);
  }, [broadcasts]);

  // Handlers
  const handleTogglePin = (id) => {
    setBroadcasts((prev) =>
      prev.map((b) => (b.id === id ? { ...b, pinned: !b.pinned } : b))
    );
    showToast('Broadcast pin status updated');
  };

  const handleToggleArchive = (id) => {
    setBroadcasts((prev) =>
      prev.map((b) =>
        b.id === id
          ? { ...b, status: b.status === 'active' ? 'archived' : 'active' }
          : b
      )
    );
    showToast('Broadcast status changed');
  };

  const handleCreateBroadcast = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const audienceMap = {
      'all-staff': 'All Store Staff',
      'inventory-team': 'Inventory & Floor Team',
      'shift-leads': 'Shift Leads & Supervisors',
      cashiers: 'Front-End Cashiers'
    };

    const createdItem = {
      id: `bc-${Date.now()}`,
      title: newTitle,
      priority: newPriority,
      audience: newAudience,
      audienceLabel: audienceMap[newAudience] || 'Targeted Team',
      author: 'Elena Rostova (General Manager)',
      timeAgo: 'Just now',
      pinned: newPinned,
      status: 'active',
      content: newContent,
      stats: {
        targeted: newAudience === 'all-staff' ? 28 : 10,
        read: 1,
        acknowledged: 1
      },
      requiresAck: newRequiresAck
    };

    setBroadcasts([createdItem, ...broadcasts]);
    setIsComposerOpen(false);
    resetComposer();
    showToast('New Store Broadcast published');
  };

  const resetComposer = () => {
    setNewTitle('');
    setNewPriority('normal');
    setNewAudience('all-staff');
    setNewContent('');
    setNewPinned(false);
    setNewRequiresAck(true);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 w-7xl px-4 py-4">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-lg shadow-xl flex items-center space-x-3 border border-slate-700 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Broadcasts</p>
            <p className="text-2xl font-extrabold text-slate-900 mt-0.5">{activeCount}</p>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
            <Megaphone className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Urgent Alerts</p>
            <p className="text-2xl font-extrabold text-rose-600 mt-0.5">{urgentCount}</p>
          </div>
          <div className="p-2.5 bg-rose-50 text-rose-600 rounded-lg">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Staff Read Rate</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-0.5">{avgReadRate}%</p>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Broadcasts List Container */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50 rounded-t-xl">
          
          {/* Status Tabs & Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex bg-slate-200/60 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setSelectedStatus('active')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  selectedStatus === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('archived')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  selectedStatus === 'archived' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Archived
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatus('all')}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                  selectedStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
            </div>

            {/* Audience Dropdown Select */}
            <select
              value={selectedAudience}
              onChange={(e) => setSelectedAudience(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="all">All Audiences</option>
              <option value="all-staff">All Store Staff</option>
              <option value="inventory-team">Inventory Team</option>
              <option value="shift-leads">Shift Leads</option>
            </select>
          </div>

          {/* Search & New Broadcast CTA */}
          <div className="flex items-center space-x-3">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search broadcasts..."
                className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsComposerOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>New Broadcast</span>
            </button>
          </div>
        </div>

        {/* Broadcast Cards Feed */}
        <div className="divide-y divide-slate-100">
          {filteredBroadcasts.length > 0 ? (
            filteredBroadcasts.map((item) => {
              const readPercent = Math.round((item.stats.read / item.stats.targeted) * 100);
              const ackPercent = Math.round((item.stats.acknowledged / item.stats.targeted) * 100);

              return (
                <div
                  key={item.id}
                  className={`p-5 transition-colors ${
                    item.pinned ? 'bg-amber-50/20' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    
                    {/* Main Content Info */}
                    <div className="space-y-2 min-w-0 flex-1">
                      <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                        {item.pinned && (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-900 flex items-center gap-1">
                            <Pin className="w-3 h-3 fill-amber-700" /> Pinned
                          </span>
                        )}

                        {item.priority === 'urgent' ? (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-rose-100 text-rose-800 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Urgent
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100 text-slate-700">
                            {item.priority} Priority
                          </span>
                        )}

                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 text-blue-700 flex items-center gap-1">
                          <Users className="w-3 h-3" /> {item.audienceLabel}
                        </span>

                        {item.status === 'archived' && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-200 text-slate-600">
                            Archived
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                        {item.content}
                      </p>

                      <div className="flex items-center space-x-3 text-xs text-slate-400 pt-1">
                        <span>Posted by <strong className="text-slate-600 font-medium">{item.author}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" /> {item.timeAgo}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleTogglePin(item.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          item.pinned
                            ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                        }`}
                        title={item.pinned ? 'Unpin' : 'Pin to top'}
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => handleToggleArchive(item.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        title={item.status === 'active' ? 'Archive' : 'Restore'}
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Read & Acknowledgment Engagement Stats */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                    {/* Read Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-medium">
                        <span className="text-slate-500">Read Receipts</span>
                        <span className="text-slate-800 font-bold">{item.stats.read}/{item.stats.targeted} ({readPercent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${readPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Acknowledgment Bar */}
                    {item.requiresAck && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-medium">
                          <span className="text-slate-500">Staff Acknowledged</span>
                          <span className="text-emerald-700 font-bold">{item.stats.acknowledged}/{item.stats.targeted} ({ackPercent}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${ackPercent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                <Megaphone className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800">No Broadcasts Found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No store broadcasts match your current filter or search criteria.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Broadcast Composer Modal Drawer */}
      {isComposerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">New Store Broadcast</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateBroadcast} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Broadcast Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Mandatory Staff Safety Briefing"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Audience
                  </label>
                  <select
                    value={newAudience}
                    onChange={(e) => setNewAudience(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="all-staff">All Store Staff</option>
                    <option value="inventory-team">Inventory & Floor Team</option>
                    <option value="shift-leads">Shift Leads & Supervisors</option>
                    <option value="cashiers">Front-End Cashiers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="low">Low Priority</option>
                    <option value="normal">Normal Priority</option>
                    <option value="urgent">Urgent / Alert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message Body
                </label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Write clear instructions for store staff..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Checkbox Options */}
              <div className="flex items-center space-x-6 pt-1">
                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newPinned}
                    onChange={(e) => setNewPinned(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                  />
                  <span>Pin to top of feed</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newRequiresAck}
                    onChange={(e) => setNewRequiresAck(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                  />
                  <span>Require staff acknowledgment</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsComposerOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}