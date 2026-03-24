import React from 'react';

const STEPS = ['Filed', 'Review', 'Assigned', 'Work', 'Resolved'];

export default function ProgressTimeline({ step = 1 }) {
  return (
    <div className="flex items-center w-full max-w-2xl mt-4 font-inter">
      {STEPS.map((label, i) => {
        const completed = i < step;
        const active = i === step;
        const isLast = i === STEPS.length - 1;

        let dotCls = 'bg-white border text-[hsl(220_10%_45%)] border-[hsl(220_13%_90%)]';
        let labelCls = 'text-[hsl(220_10%_45%)]';
        let icon = null;

        const checkIcon = (color = 'text-white') => (
          <svg className={`w-3.5 h-3.5 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        );

        if (completed) {
          dotCls = 'bg-[hsl(220_60%_25%)] border-transparent text-white';
          labelCls = 'text-[hsl(220_30%_10%)] font-medium';
          icon = checkIcon();
        } else if (active) {
          if (label === 'Resolved') {
            dotCls = 'bg-[hsl(160_60%_40%)] border-transparent text-white shadow-sm';
            labelCls = 'text-[hsl(160_60%_40%)] font-bold';
            icon = checkIcon('text-white');
          } else {
            dotCls = 'bg-[hsl(24_90%_52%)] border-transparent shadow-[0_0_0_4px_hsla(24,90%,52%,0.15)] text-white';
            labelCls = 'text-[hsl(24_90%_52%)] font-bold';
            icon = <div className="w-1.5 h-1.5 bg-white rounded-full" />;
          }
        } else {
          icon = <span className="text-[10px] text-[hsl(220_10%_45%)] font-medium">{i + 1}</span>;
        }

        return (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2 relative z-10 w-6">
              <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center transition-all ${dotCls}`}>
                {icon}
              </div>
              <span className={`text-[11px] absolute top-8 whitespace-nowrap ${labelCls}`}>
                {label}
              </span>
            </div>
            {!isLast && (
              <div className={`h-[2px] flex-1 mx-2 -mt-6 ${completed ? 'bg-[hsl(220_60%_25%)]' : 'bg-[hsl(220_13%_90%)]'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
