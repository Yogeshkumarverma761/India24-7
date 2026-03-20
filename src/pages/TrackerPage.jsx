import React, { useState } from 'react';
import { Search, AlertTriangle, UserCircle, Star } from 'lucide-react';

const TrackerPage = () => {
  const [searchId, setSearchId] = useState('IND-2026-04821');
  const [tracked, setTracked] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchId.trim()) {
      setTracked(true);
    }
  };

  const steps = [
    { label: "Complaint Filed", time: "18 Mar, 09:30 AM", status: "completed" },
    { label: "Sent to Department", desc: "Roads Dept, North Delhi", status: "completed" },
    { label: "Junior Officer Notified", desc: "Officer Sharma assigned", status: "completed" },
    { label: "Under Inspection", desc: "Officer on the way", status: "current" },
    { label: "Repair Scheduled", desc: "Scheduled for: 22 Mar, 10:00 AM", status: "upcoming" },
    { label: "Work Started", status: "upcoming" },
    { label: "Work Completed", status: "upcoming" },
    { label: "Complaint Closed", status: "upcoming" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-navy mb-4 text-center">Track Your Complaint</h1>
          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto">
            <div className="relative flex-1">
              <input 
                type="text" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Complaint ID (e.g. IND-2026-12345)" 
                className="w-full pl-12 pr-4 py-3 border-[1.5px] border-gray-200 rounded-xl focus:border-saffron outline-none text-navy font-semibold focus:ring-1 focus:ring-saffron transition-all uppercase"
              />
              <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            </div>
            <button type="submit" className="btn-primary flex items-center gap-2">
              Track
            </button>
          </form>
        </div>

        {/* Tracker Result */}
        {tracked ? (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-orange-100 text-saffron px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Roads</span>
                  <span className="text-gray-400 font-mono text-sm"># {searchId}</span>
                </div>
                <h2 className="text-xl font-bold text-navy mb-1">Large pothole causing traffic</h2>
                <p className="text-gray-500 text-sm">📍 Lajpat Nagar Crossing</p>
              </div>
              <div className="text-right">
                <div className="inline-block bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-2">
                  Status: Under Inspection
                </div>
                <p className="text-xs text-gray-400">Filed 2 days ago</p>
              </div>
            </div>

            {/* Escalation Warning */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-4">
              <AlertTriangle className="text-saffron shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-orange-800">Escalated to L2 Officer</h4>
                <p className="text-orange-700 text-sm">This complaint was automatically escalated because L1 action was delayed by 24 hours.</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              
              {/* Tracker Timeline */}
              <div className="md:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-navy mb-6">Live Progress</h3>
                
                <div className="relative pl-6 space-y-6">
                  {/* Vertical Line */}
                  <div className="absolute left-[11px] top-2 bottom-4 w-0.5 bg-gray-100"></div>
                  
                  {steps.map((step, idx) => (
                    <div key={idx} className="relative z-10">
                      <div className={`absolute -left-6 w-4 h-4 rounded-full border-2 bg-white ${
                        step.status === 'completed' ? 'border-india-green bg-india-green text-white flex items-center justify-center' :
                        step.status === 'current' ? 'border-saffron before:absolute before:inset-[-4px] before:rounded-full before:bg-orange-100 before:-z-10 before:animate-ping' :
                        'border-gray-200'
                      }`}>
                        {step.status === 'completed' && <span className="text-[10px] font-bold">✓</span>}
                      </div>
                      
                      <div className={`pl-4 ${step.status === 'upcoming' ? 'opacity-40' : ''}`}>
                        <h4 className={`font-semibold ${step.status === 'current' ? 'text-saffron' : 'text-navy'}`}>
                          {step.label}
                        </h4>
                        {step.time && <p className="text-xs text-gray-500 mt-1">{step.time}</p>}
                        {step.desc && <p className="text-sm text-gray-600 mt-1 font-medium">{step.desc}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Assigned Officer</h3>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl mb-3">
                      <UserCircle size={40} className="text-blue-500" />
                    </div>
                    <h4 className="font-bold text-navy">Officer Sharma</h4>
                    <p className="text-xs text-gray-500 mb-2">Junior Engineer • North Delhi</p>
                    
                    <div className="flex items-center gap-1 text-accent-gold mb-3">
                      <Star size={14} className="fill-current" /><Star size={14} className="fill-current" /><Star size={14} className="fill-current" /><Star size={14} className="fill-current" /><Star size={14} className="text-gray-200" />
                      <span className="text-xs text-gray-600 font-semibold ml-1">4.2</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 w-full mt-2 border-t border-gray-100 pt-4">
                      <div>
                        <p className="text-xs text-gray-400">Resolution Rate</p>
                        <p className="font-bold text-india-green">87%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Avg Time</p>
                        <p className="font-bold text-navy">18 hrs</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-2xl p-6 text-center">
                  <p className="text-sm text-gray-600 mb-4 font-medium">Issue marked resolved but not fixed?</p>
                  <button className="btn-outline w-full py-2 bg-white">Reopen Complaint</button>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Search size={64} className="mb-4 text-gray-200 opacity-50" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No Tracking Info</h3>
            <p className="text-sm">Enter a valid Complaint ID to view its live status</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackerPage;
