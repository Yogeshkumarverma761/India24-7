import React from 'react';
import { X, ThumbsUp, Share2, Trash2, MapPin } from 'lucide-react';
import StatusBadge from './StatusBadge';

function getProgressStep(status) {
  if (status === 'Resolved' || status === 'RESOLVED') return 4;
  if (status === 'In Progress' || status === 'IN PROGRESS' || status === 'Under Inspection') return 3;
  if (status === 'Assigned') return 2;
  return 1;
}

function getIcon(complaint) {
  const cat = complaint.category?.toLowerCase() || '';
  if (cat.includes('road') || cat.includes('pothole'))  return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Hole.png';
  if (cat.includes('electric') || cat.includes('light')) return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Light%20Bulb.png';
  if (cat.includes('garbage') || cat.includes('waste'))  return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Wastebasket.png';
  if (cat.includes('water'))  return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Droplet.png';
  return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Memo.png';
}

export default function ReportDetailModal({ complaint, onClose, onUpvote, onShare, onDelete, isUpvoted, currentUser }) {
  if (!complaint) return null;
  const step = getProgressStep(complaint.status);
  const icon = getIcon(complaint);
  const canDelete = currentUser && (complaint.user?.name === currentUser);

  const timelineSteps = [
    { label: 'Report Filed', detail: `Submitted by ${complaint.user?.name || 'Citizen'} with evidence.` },
    { label: 'Under Review by Authority', detail: `Sent to Municipal Corporation. Awaiting acknowledgement.` },
    { label: 'Assigned to Department', detail: 'Work force designated' },
    { label: 'Work Order Issued', detail: 'Work initiated on ground' },
    { label: 'Issue Resolved', detail: 'Case closed and verified' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center md:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-[24px] md:rounded-[16px] shadow-2xl w-full md:max-w-[550px] p-6 md:p-8 modal-slide-up no-scrollbar overflow-y-auto max-h-[92vh] md:max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-sora text-[20px] font-[800] text-charcoal tracking-[-0.5px] flex items-center gap-2">
            <img src={icon} alt="" className="w-6 h-6 object-contain" /> Report Detail
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <h2 className="font-sora text-[22px] font-[800] text-charcoal leading-tight mb-3">{complaint.title}</h2>
        
        <div className="flex flex-wrap items-center gap-3 mb-5 border-b border-gray-100 pb-5">
          <StatusBadge status={complaint.status} />
          <span className="font-sora text-[12px] font-[600] text-slate">
            by {complaint.user?.name || 'Citizen'} <span className="mx-1">•</span> {complaint.timestamp || 'Recently'} <span className="mx-1">•</span> ID: #{complaint.id}
          </span>
        </div>

        <p className="font-sora text-[14px] text-charcoal/80 font-[600] leading-relaxed mb-4">{complaint.description}</p>

        <div className="flex items-center gap-1.5 mb-8">
          <MapPin className="w-[14px] h-[14px] text-teal-mid" />
          <span className="font-sora text-[13px] font-[800] text-teal-mid">{complaint.location}</span>
        </div>

        {/* Timeline */}
        <div className="bg-[#FAF9F6] rounded-[16px] p-6 mb-8 border border-[#F0EBE1]">
          <p className="font-sora text-[11px] font-[800] text-slate tracking-widest uppercase mb-6">Full Progress Timeline</p>
          <div className="relative border-l-2 border-dashed border-[#E2E8F0] ml-3.5 space-y-8 pb-2">
            {timelineSteps.map((s, i) => {
              const done = i < step;
              const current = i === step;
              return (
                <div key={i} className="relative pl-8">
                  <div className={`absolute -left-[11px] top-0.5 w-[20px] h-[20px] rounded-full flex items-center justify-center border-2 bg-white z-10 ${
                    done ? 'border-teal-mid' : current ? 'border-warm-orange' : 'border-gray-200'
                  }`}>
                    {done ? (
                      <div className="w-full h-full bg-teal-mid rounded-full flex items-center justify-center text-white text-[10px]">✓</div>
                    ) : current ? (
                      <span className="text-[10px]">→</span>
                    ) : (
                      <span className="text-[10px] text-gray-400">{i + 1}</span>
                    )}
                  </div>
                  <h4 className={`font-sora text-[14px] font-[800] ${done || current ? 'text-charcoal' : 'text-[#94A3B8]'}`}>{s.label}</h4>
                  <p className="font-sora text-[12px] font-[600] text-[#94A3B8] mb-2">{done ? 'Completed' : current ? 'In progress' : 'Pending'}</p>
                  {(done || current) && (
                    <div className="bg-white border text-[13px] border-[#E2E8F0] rounded-[8px] p-3 text-charcoal shadow-sm font-sora font-[600]">
                      {s.detail}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100">
          <button onClick={() => onUpvote?.(complaint.id)}
            className={`font-sora flex-1 flex items-center justify-center gap-2 rounded-full px-4 py-3.5 text-[15px] font-[800] transition-all ${
              isUpvoted ? 'bg-teal-mid text-white shadow-md' : 'bg-teal-light hover:bg-[#d1e6e2] text-teal-mid'
            }`}>
            <ThumbsUp className={`w-4 h-4 ${isUpvoted ? 'fill-white text-white' : 'fill-teal-mid'}`} />
            {isUpvoted ? 'Upvoted' : 'Upvote'} ({complaint.upvotes || 0})
          </button>
          <button onClick={() => onShare?.(complaint)}
            className="font-sora flex-1 flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border-2 border-teal-mid text-teal-mid rounded-full px-4 py-3.5 text-[15px] font-[800] transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
          {canDelete && (
            <button onClick={() => onDelete?.(complaint)}
              className="font-sora flex items-center justify-center gap-2 bg-[#FEF2F2] hover:bg-[#FEE2E2] border-2 border-[#FECACA] text-red rounded-full px-5 py-3.5 text-[15px] font-[800] transition-colors">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
