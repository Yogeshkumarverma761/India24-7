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
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center md:p-4 font-inter" onClick={onClose}>
      <div className="bg-white rounded-t-xl md:rounded-xl shadow-lg w-full md:max-w-[550px] p-6 md:p-8 modal-slide-up no-scrollbar overflow-y-auto max-h-[92vh] md:max-h-[90vh] flex flex-col border border-[hsl(220_13%_90%)]" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[18px] font-semibold text-[hsl(220_30%_10%)] tracking-tight flex items-center gap-2">
            <img src={icon} alt="" className="w-6 h-6 object-contain" /> Report Detail
          </h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-[hsl(210_15%_95%)] text-[hsl(220_10%_45%)] hover:bg-[hsl(220_13%_90%)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <h2 className="text-[20px] font-bold text-[hsl(220_30%_10%)] leading-tight mb-3">{complaint.title}</h2>
        
        <div className="flex flex-wrap items-center gap-3 mb-5 border-b border-[hsl(220_13%_90%)] pb-5">
          <StatusBadge status={complaint.status} />
          <span className="text-[12px] font-medium text-[hsl(220_10%_45%)]">
            by {complaint.user?.name || 'Citizen'} <span className="mx-1">•</span> {complaint.timestamp || 'Recently'} <span className="mx-1">•</span> ID: #{complaint.id}
          </span>
        </div>

        <p className="text-[14px] text-[hsl(220_10%_45%)] font-normal leading-relaxed mb-4">{complaint.description}</p>

        <div className="flex items-center gap-1.5 mb-8">
          <MapPin className="w-[14px] h-[14px] text-[hsl(220_60%_25%)]" />
          <span className="text-[13px] font-semibold text-[hsl(220_60%_25%)]">{complaint.location}</span>
        </div>

        {/* Timeline */}
        <div className="bg-[hsl(210_20%_98%)] rounded-xl p-6 mb-8 border border-[hsl(220_13%_90%)]">
          <p className="text-[11px] font-bold text-[hsl(220_10%_45%)] tracking-widest uppercase mb-6">Full Progress Timeline</p>
          <div className="relative border-l border-dashed border-[hsl(220_13%_90%)] ml-[11px] space-y-8 pb-2">
            {timelineSteps.map((s, i) => {
              const done = i < step;
              const current = i === step;
              return (
                <div key={i} className="relative pl-6">
                  <div className={`absolute -left-[12px] top-0.5 w-[24px] h-[24px] rounded-full flex items-center justify-center border-2 bg-white z-10 ${
                    done ? 'border-[hsl(220_60%_25%)]' : current ? 'border-[hsl(24_90%_52%)]' : 'border-[hsl(220_13%_90%)]'
                  }`}>
                    {done ? (
                      <div className="w-full h-full bg-[hsl(220_60%_25%)] rounded-full flex items-center justify-center text-white text-[12px]">✓</div>
                    ) : current ? (
                      <span className="text-[12px] font-semibold text-[hsl(24_90%_52%)]">→</span>
                    ) : (
                      <span className="text-[12px] font-medium text-[hsl(220_10%_45%)]">{i + 1}</span>
                    )}
                  </div>
                  <h4 className={`text-[13px] font-semibold ${done || current ? 'text-[hsl(220_30%_10%)]' : 'text-[hsl(220_10%_45%)]'}`}>{s.label}</h4>
                  <p className="text-[12px] font-medium text-[hsl(220_10%_45%)] mb-2">{done ? 'Completed' : current ? 'In progress' : 'Pending'}</p>
                  {(done || current) && (
                    <div className="bg-white border text-[12px] border-[hsl(220_13%_90%)] rounded-md p-3 text-[hsl(220_30%_10%)] shadow-sm font-medium">
                      {s.detail}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[hsl(220_13%_90%)]">
          <button onClick={() => onUpvote?.(complaint.id)}
            className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 text-[13px] font-semibold transition-all ${
              isUpvoted ? 'bg-[hsl(220_60%_25%)] text-white shadow-sm' : 'bg-[hsl(210_15%_95%)] hover:bg-[hsl(220_13%_90%)] text-[hsl(220_60%_25%)]'
            }`}>
            <ThumbsUp className={`w-4 h-4 ${isUpvoted ? 'fill-white text-white' : 'fill-[hsl(220_60%_25%)]'}`} />
            {isUpvoted ? 'Upvoted' : 'Upvote'} ({complaint.upvotes || 0})
          </button>
          <button onClick={() => onShare?.(complaint)}
            className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-[hsl(210_15%_95%)] border border-[hsl(220_13%_90%)] text-[hsl(220_30%_10%)] rounded-md px-4 py-2 text-[13px] font-semibold transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
          {canDelete && (
            <button onClick={() => onDelete?.(complaint)}
              className="flex items-center justify-center gap-2 bg-[hsl(0_84%_60%)]/10 hover:bg-[hsl(0_84%_60%)]/20 border border-[hsl(0_84%_60%)]/20 text-[hsl(0_84%_60%)] rounded-md px-4 py-2 text-[13px] font-semibold transition-colors">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
