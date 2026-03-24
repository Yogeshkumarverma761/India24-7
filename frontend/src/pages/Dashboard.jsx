import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, BarChart3, ThumbsUp, Share2, Trash2, ChevronDown, Menu, X, Info } from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import ProgressTimeline from '../components/ProgressTimeline';
import ReportModal from '../components/ReportModal';
import ReportDetailModal from '../components/ReportDetailModal';
import ToastContainer from '../components/ToastContainer';
import { complaintService } from '../services/api';

/* ──── Issue Icon Helper ────────────────────────────────────────── */
function getIcon(cat) {
  const c = (cat || '').toLowerCase();
  if (c.includes('road') || c.includes('pothole')) return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Hole.png';
  if (c.includes('electric') || c.includes('light')) return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Light%20Bulb.png';
  if (c.includes('garbage') || c.includes('waste')) return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Wastebasket.png';
  if (c.includes('water')) return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Droplet.png';
  if (c.includes('park') || c.includes('safety')) return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Memo.png';
  return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Memo.png';
}

function getProgressStep(status) {
  if (status === 'Resolved' || status === 'RESOLVED') return 4;
  if (status === 'In Progress' || status === 'IN PROGRESS' || status === 'Under Inspection') return 3;
  if (status === 'Assigned') return 2;
  return 1;
}

/* ──── Trust Score Calculation ──────────────────────────────── */
function calcTrustScore(reports, userName) {
  if (!reports?.length || !userName) return 0;
  let score = 0;
  for (const r of reports) {
    if (r.user?.name !== userName) continue;
    score += 5; // base for filing
    if (r.status === 'Resolved' || r.status === 'RESOLVED') score += 15;
    score += 2 * (r.upvotes || 0);
  }
  return Math.max(0, score);
}

/* ──── MAIN DASHBOARD ──────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();
  
  // Data
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // User
  const [currentUser, setCurrentUser] = useState(null);
  
  // UI State
  const [activeTab, setActiveTab] = useState('Community Feed');
  const [filter, setFilter] = useState('All Issues');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Sort: Recent First');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [locationName, setLocationName] = useState('Detecting location...');
  const [userCoords, setUserCoords] = useState(null);
  
  // Modals
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showTrustInfo, setShowTrustInfo] = useState(false);
  
  // Toasts
  const [toasts, setToasts] = useState([]);
  const toast = (type, title, message) => {
    const id = Date.now();
    setToasts(t => [...t, { id, type, title, message }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4500);
  };

  // Upvoted set (stored locally)
  const [upvotedIds, setUpvotedIds] = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('india247_upvoted') || '[]')); }
    catch { return new Set(); }
  });

  const sortRef = useRef(null);
  const trustRef = useRef(null);
  
  // Load user
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('india247_user'));
      if (u) setCurrentUser(u);
    } catch {}
  }, []);
  
  // Load complaints from backend
  useEffect(() => {
    setLoading(true);
    complaintService.getAll()
      .then(data => {
        if (Array.isArray(data)) setComplaints(data);
        else if (data?.complaints) setComplaints(data.complaints);
        else setComplaints([]);
      })
      .catch(() => {
        // Fallback to mock data
        import('../data/mockData').then(m => setComplaints(m.mockComplaints));
      })
      .finally(() => setLoading(false));
  }, []);

  // Detect location
  useEffect(() => {
    if (!navigator.geolocation) { setLocationName('Location unavailable'); return; }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserCoords({ lat, lng });
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`, {
            headers: { 'User-Agent': 'India247 App' }
          });
          const data = await res.json();
          const addr = data.address || {};
          const district = addr.district || addr.state_district || addr.county;
          const city = addr.city || addr.town || addr.village;
          const state = addr.state;
          if (district && state) setLocationName(`${district}, ${state}`);
          else if (city && state) setLocationName(`${city}, ${state}`);
          else if (data.display_name) { 
            const parts = data.display_name.split(',').map(s => s.trim());
            setLocationName(parts.length >= 2 ? `${parts[0]}, ${parts[1]}` : parts[0]);
          } else setLocationName('Delhi, India');
        } catch { setLocationName('Location unavailable'); }
      },
      () => setLocationName('Location unavailable'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target)) setShowSortDropdown(false);
      if (trustRef.current && !trustRef.current.contains(e.target)) setShowTrustInfo(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  
  // Save upvoted to localStorage
  useEffect(() => {
    localStorage.setItem('india247_upvoted', JSON.stringify([...upvotedIds]));
  }, [upvotedIds]);

  // Trust score
  const trustScore = useMemo(() => calcTrustScore(complaints, currentUser?.name), [complaints, currentUser]);
  const trustPercent = useMemo(() => Math.min(100, (trustScore / 100) * 100), [trustScore]);

  // My reports count
  const myReportsCount = useMemo(() =>
    currentUser ? complaints.filter(c => c.user?.name === currentUser.name).length : 0
  , [complaints, currentUser]);
  
  // Filtered and sorted complaints
  const filteredComplaints = useMemo(() => {
    let list = [...complaints];

    // Tab filter
    if (activeTab === 'My Reports' && currentUser) {
      list = list.filter(c => c.user?.name === currentUser.name);
    }

    // Status filter
    if (filter === 'Submitted') list = list.filter(c => c.status === 'Pending' || c.status === 'SUBMITTED');
    else if (filter === 'In Progress') list = list.filter(c => ['In Progress', 'IN PROGRESS', 'Assigned', 'Under Inspection'].includes(c.status));
    else if (filter === 'Resolved') list = list.filter(c => c.status === 'Resolved' || c.status === 'RESOLVED');

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c =>
        c.title?.toLowerCase().includes(q) ||
        c.location?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'Sort: Most Upvoted') list.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
    
    return list;
  }, [complaints, activeTab, filter, searchQuery, sortBy, currentUser]);

  // Upvote handler
  const handleUpvote = (id) => {
    if (!currentUser) { toast('warning', 'Sign In Required', 'Please sign in to upvote reports'); navigate('/login'); return; }
    const wasUpvoted = upvotedIds.has(id);
    setComplaints(prev => prev.map(c =>
      c.id === id ? { ...c, upvotes: (c.upvotes || 0) + (wasUpvoted ? -1 : 1) } : c
    ));
    setUpvotedIds(prev => {
      const next = new Set(prev);
      wasUpvoted ? next.delete(id) : next.add(id);
      return next;
    });
    // Update selected report if open
    if (selectedReport?.id === id) {
      setSelectedReport(prev => ({ ...prev, upvotes: (prev.upvotes || 0) + (wasUpvoted ? -1 : 1) }));
    }
    toast(wasUpvoted ? 'info' : 'success', wasUpvoted ? 'Upvote Removed' : 'Upvoted!', wasUpvoted ? 'Your upvote has been removed.' : 'Your upvote has been added.');
  };

  // Share handler
  const handleShare = (complaint) => {
    const url = `${window.location.origin}?reportId=${complaint.id}`;
    navigator.clipboard.writeText(url);
    toast('info', 'Link Copied!', 'Report link copied to clipboard');
  };

  // Delete handler
  const handleDelete = (complaint) => {
    if (!currentUser) return;
    setComplaints(prev => prev.filter(c => c.id !== complaint.id));
    if (selectedReport?.id === complaint.id) setSelectedReport(null);
    toast('success', 'Report Deleted', `"${complaint.title}" has been removed.`);
  };

  // Submit report handler
  const handleReportSubmit = async (data) => {
    if (!currentUser) { toast('warning', 'Sign In Required', 'Please sign in to file a report'); navigate('/login'); return; }
    setSubmitting(true);
    try {
      const trackingId = `IND-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const newComplaint = {
        id: trackingId,
        category: data.issueType,
        title: data.title,
        description: data.description,
        location: locationName,
        lat: userCoords?.lat || 28.6139,
        lng: userCoords?.lng || 77.2090,
        status: 'Pending',
        upvotes: 0,
        comments: 0,
        timestamp: 'Just now',
        user: { name: currentUser.name, avatar: currentUser.name?.[0]?.toUpperCase() || 'U' },
      };
      
      // Try backend
      try {
        const created = await complaintService.create(newComplaint);
        setComplaints(prev => [created, ...prev]);
      } catch (e) {
        setComplaints(prev => [newComplaint, ...prev]);
      }
      
      setReportModalOpen(false);
      setActiveTab('My Reports');
      toast('success', 'Report Submitted!', 'Your report is now live. You\'ll be notified as it progresses.');
    } catch (e) {
      toast('error', 'Submission Failed', e?.message || 'Failed to submit report.');
    } finally {
      setSubmitting(false);
    }
  };

  // Stats
  const stats = useMemo(() => ({
    total: complaints.length,
    inProgress: complaints.filter(c => ['In Progress', 'IN PROGRESS', 'Assigned', 'Under Inspection'].includes(c.status)).length,
    resolved: complaints.filter(c => c.status === 'Resolved' || c.status === 'RESOLVED').length,
    pending: complaints.filter(c => c.status === 'Pending' || c.status === 'SUBMITTED').length,
  }), [complaints]);

  // Issue breakdown for sidebar
  const issueBreakdown = useMemo(() => {
    const counts = {};
    complaints.forEach(c => { const cat = c.category || 'Other'; counts[cat] = (counts[cat] || 0) + 1; });
    const items = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const max = items[0]?.[1] || 1;
    const colors = ['bg-red', 'bg-warm-orange', 'bg-blue', 'bg-green'];
    return items.map(([label, count], i) => ({ label, count, color: colors[i] || 'bg-gray-400', width: `${(count / max) * 100}%` }));
  }, [complaints]);

  const navItems = [
    { label: 'Community Feed', icon: <BarChart3 className="w-5 h-5" /> },
    { label: 'Issue Map', icon: <MapPin className="w-5 h-5" /> },
    { label: 'My Reports', icon: <Search className="w-5 h-5" />, badge: myReportsCount > 0 ? myReportsCount : null },
  ];

  return (
    <div className="flex h-screen w-full bg-page-bg font-sora overflow-hidden text-charcoal relative">

      {/* Mobile overlay */}
      {drawerOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setDrawerOpen(false)} />}

      {/* ───── LEFT SIDEBAR ───── */}
      <aside className={`fixed md:relative top-0 left-0 h-full w-[260px] shrink-0 bg-teal-dark flex flex-col items-stretch pt-6 pb-6 shadow-xl z-50 md:z-20 transition-transform duration-300 ease-in-out ${
        drawerOpen ? 'translate-x-0 drawer-slide-in' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Brand */}
        <div className="px-6 mb-8">
          <p className="font-sora text-warm-orange text-[14px] font-[800] tracking-widest leading-none mb-1">भारत 24/7</p>
          <h1 className="font-sora text-white text-[32px] font-[800] tracking-[-0.5px] leading-none mb-1">India247</h1>
          <p className="font-sora text-[#94A3B8] text-[11px] font-[600] tracking-wide">Apna Shehar, Apni Zimmedari</p>
        </div>

        {/* File a Report button */}
        <div className="px-6 mb-6">
          <button onClick={() => {
            if (!currentUser) { toast('warning', 'Sign In Required', 'Please sign in to file a report'); navigate('/login'); return; }
            setReportModalOpen(true); setDrawerOpen(false);
          }} className="font-sora w-full bg-warm-orange hover:bg-warm-orange-hover text-white rounded-[12px] py-3.5 px-4 text-[14px] font-[800] flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all">
            <span className="text-[18px] leading-none">+</span> File a Report
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(item => {
            const active = activeTab === item.label;
            return (
              <button key={item.label} onClick={() => {
                if (item.label === 'My Reports' && !currentUser) {
                  toast('warning', 'Sign In Required', 'Please sign in to view your reports');
                  navigate('/login'); return;
                }
                setActiveTab(item.label); setDrawerOpen(false);
              }} className={`w-full flex items-center justify-between px-3 py-[10px] rounded-[10px] text-left transition-all ${
                active ? 'bg-teal text-white' : 'text-[#94A3B8] hover:bg-[#0B2F30] hover:text-white'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={active ? 'text-white' : 'text-teal-mid'}>{item.icon}</span>
                  <span className={`font-sora text-[14px] ${active ? 'font-[700]' : 'font-[600]'}`}>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="font-sora bg-warm-orange text-white text-[10px] font-[800] w-5 h-5 rounded-full flex items-center justify-center">{item.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="px-4 mt-auto border-t border-white/5 pt-4">
          {currentUser ? (
            <div ref={trustRef} className="relative">
              <div className="flex items-center gap-3 rounded-xl hover:bg-white/5 p-2 transition-colors -mx-2">
                <div className="w-10 h-10 rounded-full bg-warm-orange text-white font-[800] text-lg flex items-center justify-center shadow-inner shrink-0">
                  {currentUser.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-sora text-white text-[14px] font-[800] truncate">{currentUser.name}</p>
                  <button onClick={() => { localStorage.removeItem('india247_user'); setCurrentUser(null); toast('info', 'Signed Out', 'You have been signed out.'); }}
                    className="font-sora text-warm-orange hover:text-white transition-colors text-[10px] font-[800] mt-1">Sign Out</button>
                  <div className="mt-1.5">
                    <div className="flex items-center gap-1">
                      <span className="font-sora text-[#94A3B8] text-[10px] font-[600]">Trust Score: {trustScore}</span>
                      <button onClick={(e) => { e.stopPropagation(); setShowTrustInfo(!showTrustInfo); }} className="p-0.5 rounded hover:bg-white/10 transition-colors">
                        <Info className="w-3 h-3 text-[#94A3B8]" />
                      </button>
                    </div>
                    <div className="mt-1 h-1 w-full rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-teal-mid transition-all" style={{ width: `${trustPercent}%` }} />
                    </div>
                  </div>
                </div>
              </div>
              {/* Trust Score Info */}
              {showTrustInfo && (
                <div className="absolute bottom-full left-0 right-0 mb-2 w-[260px] bg-white rounded-[16px] shadow-lg border border-gray-100 z-50 text-left max-h-[320px] overflow-y-auto">
                  <div className="p-5">
                    <h3 className="font-sora text-[16px] font-[800] text-charcoal tracking-tight mb-2">Trust Score</h3>
                    <p className="font-sora text-[12px] text-slate font-[600] leading-relaxed mb-4">Reflects how reliable and helpful your reports are to the community.</p>
                    <p className="font-sora text-[11px] font-[800] text-charcoal uppercase tracking-wider mb-2">How you earn points</p>
                    <ul className="font-sora text-[12px] text-charcoal font-[600] space-y-2 mb-4">
                      <li className="flex items-start gap-2"><span className="text-green font-[800] shrink-0">+10</span> Report with photo</li>
                      <li className="flex items-start gap-2"><span className="text-green font-[800] shrink-0">+5</span> Report without photo</li>
                      <li className="flex items-start gap-2"><span className="text-green font-[800] shrink-0">+15</span> Report resolved</li>
                      <li className="flex items-start gap-2"><span className="text-green font-[800] shrink-0">+2</span> Someone upvotes your report</li>
                    </ul>
                    <p className="font-sora text-[11px] font-[800] text-charcoal uppercase tracking-wider mb-2">Trust Levels</p>
                    <div className="space-y-1.5">
                      <div className="font-sora text-[12px] font-[600] text-charcoal py-1.5 px-2.5 rounded-lg bg-[#F1F5F9]">New Member (0–99)</div>
                      <div className="font-sora text-[12px] font-[600] text-charcoal py-1.5 px-2.5 rounded-lg bg-[#F0FDF4] border border-[#bbf7d0]">Active Citizen (100–299)</div>
                      <div className="font-sora text-[12px] font-[600] text-charcoal py-1.5 px-2.5 rounded-lg bg-teal-light border border-[#99D4D4]">Trusted Reporter (300+)</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl hover:bg-white/5 p-2 transition-colors cursor-pointer -mx-2" onClick={() => navigate('/login')}>
              <div className="w-10 h-10 rounded-full bg-gray-600 text-white font-[800] text-lg flex items-center justify-center shadow-inner shrink-0">?</div>
              <div className="flex-1 overflow-hidden">
                <p className="font-sora text-white text-[14px] font-[800] truncate">Guest Mode</p>
                <div className="font-sora text-warm-orange hover:text-white transition-colors text-[10px] font-[800] mt-1">Sign In</div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ───── MAIN CONTENT ───── */}
      <main className="flex-1 flex flex-col h-full relative z-10 md:min-w-0 border-r border-gray-200 shadow-sm overflow-hidden">
        {/* Header */}
        <header className="h-[60px] md:h-[80px] shrink-0 border-b border-gray-200 flex items-center gap-3 md:gap-6 px-4 md:px-8 bg-white z-10">
          <button className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-page-bg text-teal-dark shrink-0" onClick={() => setDrawerOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="font-sora text-[16px] md:text-[20px] font-[800] text-charcoal tracking-[-0.5px] leading-none whitespace-nowrap">
              {activeTab === 'My Reports' ? 'My Reports' : activeTab === 'Issue Map' ? 'City Issue Map' : 'Community Feed'}
            </h2>
            <p className="font-sora text-[11px] md:text-[13px] text-slate font-[600] mt-0.5 truncate">
              {activeTab === 'My Reports' ? 'Your filed issues' : activeTab === 'Issue Map' ? `Live map of reported issues in ${locationName.split(',')[0]}` : 'Civic issues near you'}
            </p>
          </div>
          {(activeTab === 'Community Feed' || activeTab === 'My Reports') && (
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-gray-400" />
              <input type="text" placeholder="Search reports, locations..."
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="font-sora w-full h-11 pl-11 pr-4 bg-page-bg border border-gray-200 rounded-full text-[14px] text-charcoal outline-none focus:border-teal-mid focus:bg-white transition-all placeholder:text-gray-400" />
            </div>
          )}
        </header>

        {/* Feed / Map content */}
        {(activeTab === 'Community Feed' || activeTab === 'My Reports') && (
          <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-8 pb-20 md:pb-8 bg-page-bg">
            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-white rounded-[12px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100">
                <p className="font-sora text-[28px] font-[800] text-teal-dark leading-none mb-1.5 tracking-[-0.5px]">{stats.total}</p>
                <p className="font-sora text-[10px] font-[800] text-slate uppercase tracking-wider">Total Reports</p>
                <p className="font-sora text-[12px] font-[800] text-green mt-3">↑ {Math.min(12, stats.total)} this week</p>
              </div>
              <div className="bg-white rounded-[12px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100">
                <p className="font-sora text-[28px] font-[800] text-warm-orange leading-none mb-1.5 tracking-[-0.5px]">{stats.inProgress}</p>
                <p className="font-sora text-[10px] font-[800] text-slate uppercase tracking-wider">In Progress</p>
                <p className="font-sora text-[12px] font-[800] text-warm-orange mt-3">Active cases</p>
              </div>
              <div className="bg-white rounded-[12px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100">
                <p className="font-sora text-[28px] font-[800] text-teal-dark leading-none mb-1.5 tracking-[-0.5px]">{stats.resolved}</p>
                <p className="font-sora text-[10px] font-[800] text-slate uppercase tracking-wider">Resolved</p>
                <p className="font-sora text-[12px] font-[800] text-green mt-3">{stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% rate</p>
              </div>
              <div className="bg-white rounded-[12px] p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100">
                <p className="font-sora text-[28px] font-[800] text-teal-dark leading-none mb-1.5 tracking-[-0.5px]">{stats.pending}</p>
                <p className="font-sora text-[10px] font-[800] text-slate uppercase tracking-wider">Pending</p>
                <p className="font-sora text-[12px] font-[600] text-slate mt-3">Awaiting action</p>
              </div>
            </div>

            {/* Filters & Sort */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                {['All Issues', 'Submitted', 'In Progress', 'Resolved'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} className={`font-sora px-4 md:px-5 py-2 rounded-full text-[12px] md:text-[13px] font-[800] transition-all whitespace-nowrap shrink-0 ${
                    filter === f ? 'bg-teal text-white shadow-md border border-teal' : 'bg-white text-charcoal border border-gray-200 hover:bg-gray-50 shadow-sm'
                  }`}>{f}</button>
                ))}
              </div>
              <div ref={sortRef} className="relative">
                <button onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="font-sora h-10 px-4 bg-white border border-gray-200 text-charcoal text-[13px] font-[700] rounded-lg shadow-sm min-w-[180px] flex items-center justify-between whitespace-nowrap hover:border-teal-mid">
                  {sortBy} <ChevronDown className="w-4 h-4 shrink-0 ml-1" />
                </button>
                {showSortDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    <button onClick={() => { setSortBy('Sort: Recent First'); setShowSortDropdown(false); }}
                      className="font-sora w-full px-4 py-2.5 text-left text-[13px] font-[700] text-charcoal hover:bg-teal-mid hover:text-white transition-colors">Sort: Recent First</button>
                    <button onClick={() => { setSortBy('Sort: Most Upvoted'); setShowSortDropdown(false); }}
                      className="font-sora w-full px-4 py-2.5 text-left text-[13px] font-[700] text-charcoal hover:bg-teal-mid hover:text-white transition-colors">Sort: Most Upvoted</button>
                  </div>
                )}
              </div>
            </div>

            {/* Report Cards */}
            <div className="space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 mb-4 animate-pulse">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="font-sora text-[16px] font-[800] text-charcoal mb-1">Loading reports...</h3>
                </div>
              ) : filteredComplaints.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 mb-4">
                    <Search className="w-6 h-6 text-gray-400" />
                  </div>
                  <h3 className="font-sora text-[16px] font-[800] text-charcoal mb-1">No reports found</h3>
                  <p className="font-sora text-[13px] text-slate font-[600]">Try adjusting your search or filters.</p>
                </div>
              ) : (
                filteredComplaints.map(c => {
                  const icon = getIcon(c.category);
                  const step = getProgressStep(c.status);
                  return (
                    <div key={c.id} className="bg-white rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden flex flex-col cursor-pointer hover:shadow-lg transition-shadow group"
                      onClick={() => setSelectedReport(c)}>
                      <div className="p-5 pb-4 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-[12px] bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform overflow-hidden">
                          <img src={icon} alt="" className="w-8 h-8 object-contain drop-shadow-sm" />
                        </div>
                        <div className="flex-1 pt-0.5">
                          <div className="flex items-center justify-between mb-0.5">
                            <h3 className="font-sora text-[16px] font-[800] text-charcoal tracking-[-0.5px] leading-tight group-hover:text-teal-mid transition-colors">{c.title}</h3>
                            <StatusBadge status={c.status} />
                          </div>
                          <p className="font-sora text-[12px] text-slate font-[600]">
                            by {c.user?.name || 'Citizen'} <span className="mx-1.5">•</span> {c.timestamp || 'Recently'}
                          </p>
                        </div>
                      </div>

                      {/* Pattern background with icon */}
                      <div className="w-full h-[180px] bg-teal-light relative overflow-hidden flex items-center justify-center border-y border-gray-100">
                        <div className="absolute inset-0 opacity-10" style={{
                          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #0B2F30 19px, #0B2F30 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #0B2F30 19px, #0B2F30 20px)'
                        }} />
                        <img src={icon} alt="" className="w-12 h-12 object-contain drop-shadow-lg z-10 animate-pulse" />
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-1.5 mb-3">
                          <MapPin className="w-[14px] h-[14px] text-red" />
                          <span className="font-sora text-[12px] font-[800] text-teal-mid group-hover:underline">{c.location}</span>
                        </div>
                        <p className="font-sora text-[14px] text-charcoal/80 leading-relaxed font-[600] mb-6 max-w-3xl line-clamp-2">{c.description}</p>
                        <p className="font-sora text-[11px] font-[800] text-slate tracking-wider uppercase mb-1">Report Progress</p>
                        <ProgressTimeline step={step} />
                      </div>

                      <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-3">
                          <button onClick={(e) => { e.stopPropagation(); handleUpvote(c.id); }}
                            className={`font-sora flex items-center gap-2 border rounded-full px-4 py-1.5 text-[13px] font-[800] transition-all ${
                              upvotedIds.has(c.id) ? 'bg-teal-mid border-teal-mid text-white shadow-md scale-[1.02]' : 'bg-[#F1F5F9] hover:bg-[#E2E8F0] border-gray-200 text-charcoal'
                            }`}>
                            <ThumbsUp className={`w-4 h-4 transition-all ${upvotedIds.has(c.id) ? 'fill-white text-white' : 'fill-teal-mid text-teal-mid'}`} />
                            {c.upvotes || 0}
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleShare(c); }}
                            className="font-sora flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 text-[13px] font-[800] text-charcoal transition-colors">
                            <Share2 className="w-4 h-4 text-slate" /> Share
                          </button>
                        </div>
                        <span className="font-sora text-[12px] font-[700] text-slate">Click for full details →</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Map Tab */}
        {activeTab === 'Issue Map' && (
          <div className="flex-1 p-2 md:p-8 pb-20 md:pb-8 bg-[#f5f9f9] flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl bg-white rounded-[24px] p-10 shadow-lg border border-gray-100 text-center">
              <MapPin className="w-16 h-16 text-warm-orange mx-auto mb-4" />
              <h2 className="font-sora text-[24px] font-[800] text-charcoal tracking-tight mb-2">City Issue Map</h2>
              <p className="font-sora text-[14px] text-slate font-[600] mb-6">Live map of reported issues in {locationName.split(',')[0]}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#f8fafc] p-6 rounded-[16px] border border-gray-100">
                  <p className="font-sora text-[32px] font-[800] text-charcoal mb-1">3.4 Days</p>
                  <p className="font-sora text-[12px] font-[700] text-slate uppercase tracking-wider">Avg. Resolution Time</p>
                </div>
                <div className="bg-[#f0fdf4] p-6 rounded-[16px] border border-[#bbf7d0]">
                  <p className="font-sora text-[32px] font-[800] text-green mb-1">94%</p>
                  <p className="font-sora text-[12px] font-[700] text-slate uppercase tracking-wider">Issues Verified</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ───── RIGHT SIDEBAR (desktop) ───── */}
      <aside className="hidden lg:flex w-[320px] shrink-0 bg-white h-full overflow-y-auto no-scrollbar flex-col">
        <div className="px-6 pt-6 pb-5 border-b border-gray-100">
          <div className="h-10 px-4 flex items-center gap-2 bg-page-bg border border-gray-200 rounded-full cursor-pointer hover:bg-gray-100 transition-colors mb-3">
            <MapPin className="w-4 h-4 text-red" />
            <span className="font-sora text-[13px] font-[800] text-teal-mid truncate max-w-[200px]">{locationName}</span>
          </div>
          <button onClick={() => {
            if (!currentUser) { toast('warning', 'Sign In Required', 'Please sign in to file a report'); navigate('/login'); return; }
            setReportModalOpen(true);
          }} className="font-sora w-full h-11 bg-teal hover:bg-[#0c3132] text-white rounded-[12px] text-[14px] font-[800] flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all">
            <span className="text-[18px] leading-none font-[600]">+</span> File a Report
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-6 px-6">
          {/* Issue Map Preview */}
          <div className="mb-8">
            <h3 className="font-sora text-[11px] font-[800] text-charcoal tracking-widest uppercase flex items-center gap-2 mb-4">
              <MapPin className="w-3.5 h-3.5 text-red" /> ISSUE MAP — {locationName.split(',')[0]?.toUpperCase()}
            </h3>
            <div className="w-full h-[180px] bg-teal-light rounded-[16px] relative overflow-hidden mb-3 cursor-pointer" onClick={() => setActiveTab('Issue Map')}>
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #0B2F30 19px, #0B2F30 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #0B2F30 19px, #0B2F30 20px)'
              }} />
              <div className="absolute inset-0 flex items-center justify-center"><MapPin className="w-8 h-8 text-teal-mid opacity-40" /></div>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-lg py-2 px-3 shadow-lg flex items-center gap-2 border border-gray-100 z-20">
                <div className="w-2.5 h-2.5 rounded-full bg-green" />
                <span className="font-sora text-[11px] font-[800] text-teal-mid">{complaints.length} active reports</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-sora text-[10px] font-[800] text-slate">
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red" /> High Priority</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-warm-orange" /> In Progress</span>
              <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green" /> Resolved</span>
            </div>
          </div>

          {/* Issue Breakdown */}
          <div className="mb-8 p-1">
            <h3 className="font-sora text-[11px] font-[800] text-charcoal tracking-widest uppercase flex items-center gap-2 mb-4">
              <BarChart3 className="w-3.5 h-3.5" /> ISSUE BREAKDOWN
            </h3>
            <div className="space-y-4">
              {issueBreakdown.map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-sora text-[12px] font-[800] text-charcoal">{item.label}</span>
                    <span className="font-sora text-[12px] font-[800] text-slate">{item.count}</span>
                  </div>
                  <div className="w-full h-[3px] bg-gray-100 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: item.width }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* ───── MODALS ───── */}
      <ReportModal open={reportModalOpen} onClose={() => setReportModalOpen(false)} onSubmit={handleReportSubmit} locationName={locationName} submitting={submitting} />
      
      <ReportDetailModal complaint={selectedReport} onClose={() => setSelectedReport(null)}
        onUpvote={handleUpvote} onShare={handleShare} onDelete={handleDelete}
        isUpvoted={selectedReport ? upvotedIds.has(selectedReport.id) : false}
        currentUser={currentUser?.name} />

      {/* Toast notifications */}
      <ToastContainer toasts={toasts} onRemove={id => setToasts(t => t.filter(x => x.id !== id))} />

      {/* ───── MOBILE BOTTOM NAV ───── */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t border-gray-200 z-30 flex items-stretch">
        {navItems.map(item => {
          const active = activeTab === item.label;
          return (
            <button key={item.label} onClick={() => {
              if (item.label === 'My Reports' && !currentUser) {
                toast('warning', 'Sign In Required', 'Please sign in');
                navigate('/login'); return;
              }
              setActiveTab(item.label);
            }} className={`flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-[800] font-sora transition-colors relative ${
              active ? 'text-teal-dark' : 'text-[#94A3B8]'
            }`}>
              {active && <span className="absolute top-0 left-[20%] right-[20%] h-[3px] bg-teal-dark rounded-b-full" />}
              <span className={active ? 'text-teal-dark' : 'text-[#94A3B8]'}>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && <span className="absolute top-1.5 right-[22%] bg-warm-orange text-white text-[8px] font-[800] w-4 h-4 rounded-full flex items-center justify-center">{item.badge}</span>}
            </button>
          );
        })}
        <button onClick={() => {
          if (!currentUser) { toast('warning', 'Sign In Required', 'Please sign in'); navigate('/login'); return; }
          setReportModalOpen(true);
        }} className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-[800] font-sora text-warm-orange">
          <span className="w-8 h-8 bg-warm-orange rounded-full flex items-center justify-center text-white text-[20px] leading-none font-[600] mb-0.5">+</span>
          <span>Report</span>
        </button>
      </nav>
    </div>
  );
}
