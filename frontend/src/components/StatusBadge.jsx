import React from 'react';

const STYLES = {
  'SUBMITTED':    'bg-[hsl(220_60%_25%)]/10 text-[hsl(220_60%_25%)] border-[hsl(220_60%_25%)]/20',
  'Pending':      'bg-[hsl(220_60%_25%)]/10 text-[hsl(220_60%_25%)] border-[hsl(220_60%_25%)]/20',
  'IN PROGRESS':  'bg-[hsl(24_90%_52%)]/10 text-[hsl(24_90%_52%)] border-[hsl(24_90%_52%)]/20',
  'In Progress':  'bg-[hsl(24_90%_52%)]/10 text-[hsl(24_90%_52%)] border-[hsl(24_90%_52%)]/20',
  'Assigned':     'bg-[hsl(24_90%_52%)]/10 text-[hsl(24_90%_52%)] border-[hsl(24_90%_52%)]/20',
  'Under Inspection': 'bg-[hsl(24_90%_52%)]/10 text-[hsl(24_90%_52%)] border-[hsl(24_90%_52%)]/20',
  'RESOLVED':     'bg-[hsl(160_60%_40%)]/10 text-[hsl(160_60%_40%)] border-[hsl(160_60%_40%)]/20',
  'Resolved':     'bg-[hsl(160_60%_40%)]/10 text-[hsl(160_60%_40%)] border-[hsl(160_60%_40%)]/20',
};

export default function StatusBadge({ status }) {
  const cls = STYLES[status] || 'bg-[hsl(210_15%_95%)] text-[hsl(220_10%_45%)] border-[hsl(220_13%_90%)]';
  const label = status === 'Pending' ? 'SUBMITTED' : status === 'In Progress' || status === 'Assigned' || status === 'Under Inspection' ? 'IN PROGRESS' : status === 'Resolved' ? 'RESOLVED' : status?.toUpperCase();
  
  return (
    <span className={`font-inter text-[10px] uppercase font-semibold tracking-wider px-2.5 py-0.5 rounded-full border ${cls}`}>
      {label}
    </span>
  );
}
