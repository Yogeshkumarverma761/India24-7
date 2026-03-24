import React from 'react';

const STYLES = {
  'SUBMITTED':    'bg-[#EFF6FF] text-[#3B82F6]',
  'Pending':      'bg-[#EFF6FF] text-[#3B82F6]',
  'IN PROGRESS':  'bg-[#FFF7ED] text-[#F4A261]',
  'In Progress':  'bg-[#FFF7ED] text-[#F4A261]',
  'Assigned':     'bg-[#FFF7ED] text-[#F4A261]',
  'Under Inspection': 'bg-[#FFF7ED] text-[#F4A261]',
  'RESOLVED':     'bg-[#F0FDF4] text-[#22A06B]',
  'Resolved':     'bg-[#F0FDF4] text-[#22A06B]',
};

export default function StatusBadge({ status }) {
  const cls = STYLES[status] || 'bg-gray-100 text-gray-500';
  const label = status === 'Pending' ? 'SUBMITTED' : status === 'In Progress' || status === 'Assigned' || status === 'Under Inspection' ? 'IN PROGRESS' : status === 'Resolved' ? 'RESOLVED' : status?.toUpperCase();
  return (
    <span className={`font-sora text-[10px] uppercase font-[800] tracking-wider px-3 py-1 rounded-md ${cls}`}>
      {label}
    </span>
  );
}
