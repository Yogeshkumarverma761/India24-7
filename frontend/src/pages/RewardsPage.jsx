import React, { useState } from 'react';
import { Trophy, Star, TrendingUp, Gift } from 'lucide-react';
import { rewards, citizens } from '../data/mockData';

const RewardsPage = () => {
  const [tab, setTab] = useState('rewards');
  const userPoints = 1240;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      {/* Hero Profile */}
      <div className="bg-navy text-white pt-10 pb-20 px-4 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-saffron/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-white/10 rounded-full border-4 border-white/20 flex items-center justify-center p-1">
              <div className="w-full h-full bg-saffron rounded-full flex items-center justify-center text-3xl font-bold">
                RS
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-1">Rahul Sharma</h1>
              <p className="text-gray-300 flex items-center gap-2">
                <Trophy size={16} className="text-accent-gold" />
                Silver Reporter Badge
              </p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center md:text-right w-full md:w-auto">
            <p className="text-indigo-100 text-sm font-semibold mb-1 uppercase tracking-wider">Total Impact Points</p>
            <div className="text-5xl font-black text-accent-gold flex items-center justify-center md:justify-end gap-2 drop-shadow-lg">
              <Star size={36} className="fill-current" />
              {userPoints.toLocaleString()}
            </div>
            
            <div className="mt-4 text-left">
              <div className="flex justify-between text-xs text-gray-300 font-medium mb-1">
                <span>Progress to Gold</span>
                <span>1240 / 2000 pts</span>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-accent-gold rounded-full" style={{ width: '62%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        
        {/* Badges Showcase */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-bold text-navy mb-4">Your Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-orange-50 rounded-xl p-4 text-center border-2 border-saffron group cursor-help">
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🥉</div>
              <h3 className="font-bold text-saffron text-sm">Bronze Reporter</h3>
              <p className="text-xs text-orange-800 mt-1">Unlocked</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center border-2 border-gray-300 group cursor-help">
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">🥈</div>
              <h3 className="font-bold text-gray-600 text-sm">Silver Reporter</h3>
              <p className="text-xs text-gray-500 mt-1">Unlocked</p>
            </div>
            <div className="bg-gray-50 opacity-60 rounded-xl p-4 text-center border border-gray-200 grayscale relative group cursor-help">
              <div className="text-4xl mb-2">🥇</div>
              <h3 className="font-bold text-gray-500 text-sm">Gold Reporter</h3>
              <p className="text-xs mt-1">Locked</p>
              <div className="absolute hidden group-hover:block bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-navy text-white text-xs p-2 rounded-lg shadow-lg z-50">
                File 25 genuine complaints to unlock this badge. (14/25)
              </div>
            </div>
            <div className="bg-gray-50 opacity-60 rounded-xl p-4 text-center border border-gray-200 grayscale relative group cursor-help">
              <div className="text-4xl mb-2">🏆</div>
              <h3 className="font-bold text-gray-500 text-sm">Civic Champion</h3>
              <p className="text-xs mt-1">Locked</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          <button 
            onClick={() => setTab('rewards')}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 -mb-px ${tab === 'rewards' ? 'border-saffron text-saffron' : 'border-transparent text-gray-500 hover:text-navy'}`}
          >
            Redeem Rewards
          </button>
          <button 
            onClick={() => setTab('leaderboard')}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 -mb-px ${tab === 'leaderboard' ? 'border-saffron text-saffron' : 'border-transparent text-gray-500 hover:text-navy'}`}
          >
            Leaderboard
          </button>
          <button 
            onClick={() => setTab('howto')}
            className={`px-6 py-3 font-semibold text-sm transition-colors border-b-2 -mb-px ${tab === 'howto' ? 'border-saffron text-saffron' : 'border-transparent text-gray-500 hover:text-navy'}`}
          >
            How it Works
          </button>
        </div>

        {/* Content based on tab */}
        {tab === 'rewards' && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 animate-in fade-in">
            {rewards.map(reward => {
              const canAfford = userPoints >= reward.pts;
              return (
                <div key={reward.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col hover:-translate-y-1 transition-transform">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-inner">
                    {reward.icon}
                  </div>
                  <h3 className="font-bold text-navy text-lg leading-tight mb-2">{reward.title}</h3>
                  <div className="flex items-center gap-1.5 text-accent-gold font-black mb-6">
                    <Star size={16} className="fill-current" />
                    <span>{reward.pts} pts</span>
                  </div>
                  <div className="mt-auto">
                    <button 
                      disabled={!canAfford}
                      className={`w-full py-3 rounded-xl font-bold transition-colors ${canAfford ? 'bg-saffron text-white shadow-md hover:bg-orange-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    >
                      {canAfford ? 'Redeem Now' : 'Not Enough Points'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'leaderboard' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-navy flex items-center gap-2"><TrendingUp size={20}/> Top Citizens of the Month</h3>
              <span className="text-sm font-semibold text-gray-500">Delhi Region</span>
            </div>
            <div className="divide-y divide-gray-50">
              {citizens.map((citizen, idx) => (
                <div key={idx} className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${idx < 3 ? 'bg-orange-50/30' : ''}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                      idx === 0 ? 'bg-yellow-100 text-yellow-600' :
                      idx === 1 ? 'bg-gray-200 text-gray-600' :
                      idx === 2 ? 'bg-orange-200 text-orange-700' : 'bg-gray-100 text-gray-400'
                    }`}>
                      #{citizen.rank}
                    </div>
                    <div>
                      <h4 className="font-bold text-navy">{citizen.name}</h4>
                      <p className="text-xs text-gray-500 font-medium">Joined 4 months ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-2xl" title="Badge">{citizen.badge}</div>
                    <div className="bg-orange-50 text-saffron px-3 py-1 rounded-full font-bold text-sm tracking-wide border border-orange-100">
                      {citizen.points} pts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'howto' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-in fade-in max-w-2xl">
            <h3 className="text-xl font-bold text-navy mb-6">How to Earn Points</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 font-bold mt-1">✅</div>
                <div>
                  <h4 className="font-bold text-gray-800">File a genuine complaint</h4>
                  <p className="text-sm text-gray-500">When your complaint is verified by our AI.</p>
                </div>
                <div className="ml-auto font-black text-india-green bg-green-50 px-3 py-1 rounded">+10 pts</div>
              </li>
              <li className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold mt-1">🎯</div>
                <div>
                  <h4 className="font-bold text-gray-800">Complaint resolved</h4>
                  <p className="text-sm text-gray-500">When the department fixes the issue.</p>
                </div>
                <div className="ml-auto font-black text-india-green bg-green-50 px-3 py-1 rounded">+25 pts</div>
              </li>
              <li className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 font-bold mt-1">👍</div>
                <div>
                  <h4 className="font-bold text-gray-800">Receive 10+ Upvotes</h4>
                  <p className="text-sm text-gray-500">Community agrees your issue is important.</p>
                </div>
                <div className="ml-auto font-black text-india-green bg-green-50 px-3 py-1 rounded">+15 pts</div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 font-bold mt-1">❌</div>
                <div>
                  <h4 className="font-bold text-gray-800">False/Rejected complaint</h4>
                  <p className="text-sm text-gray-500">Submitting fake images or spam.</p>
                </div>
                <div className="ml-auto font-black text-red-600 bg-red-50 px-3 py-1 rounded">-20 pts</div>
              </li>
            </ul>
          </div>
        )}

      </div>
    </div>
  );
};

export default RewardsPage;
