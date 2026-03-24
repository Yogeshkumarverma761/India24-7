import React from 'react';

const STEPS = ['Filed', 'Review', 'Assigned', 'Work', 'Resolved'];

export default function ProgressTimeline({ step = 1 }) {
  return (
    <div className="flex items-center w-full max-w-2xl mt-4">
      {STEPS.map((label, i) => {
        const completed = i < step;
        const active = i === step;
        const isLast = i === STEPS.length - 1;

        let dotCls = 'bg-white border-2 border-gray-200 text-gray-300';
        let labelCls = 'text-gray-400';
        let icon = null;

        const checkIcon = (color = 'text-white') => (
          <svg className={`w-3.5 h-3.5 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        );

        if (completed) {
          dotCls = 'bg-[#22A06B] border-none';
          labelCls = 'text-charcoal';
          icon = checkIcon();
        } else if (active) {
          if (label === 'Resolved') {
            dotCls = 'bg-white border-2 border-[#22A06B]';
            labelCls = 'text-[#22A06B]';
            icon = checkIcon('text-[#22A06B]');
          } else {
            dotCls = 'bg-white border-2 border-[#F4A261] shadow-[0_0_0_4px_rgba(244,162,97,0.15)]';
            labelCls = 'text-[#F4A261]';
            icon = <div className="w-1.5 h-1.5 bg-[#F4A261] rounded-full" />;
          }
        } else {
          icon = <span className="text-[10px] text-gray-400 font-bold">{i + 1}</span>;
        }

        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2 relative z-10 w-6">
              <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center transition-all ${dotCls}`}>
                {icon}
              </div>
              <span className={`font-sora text-[11px] font-[800] absolute top-8 whitespace-nowrap ${labelCls}`}>
                {label}
              </span>
            </div>
            {!isLast && (
              <div className={`h-[2px] flex-1 mx-2 -mt-6 ${completed ? 'bg-[#22A06B]' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
