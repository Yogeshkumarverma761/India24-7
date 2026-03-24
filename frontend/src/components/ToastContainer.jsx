import React, { useState, useEffect } from 'react';

const STYLES = {
  warning: { border: '#F4A261', icon: '⚠️' },
  success: { border: '#22A06B', icon: '✅' },
  error:   { border: '#E63946', icon: '❌' },
  info:    { border: '#3B82F6', icon: 'ℹ️' },
};

function Toast({ type = 'info', title, message, onClose }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const s = STYLES[type] || STYLES.info;

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 10);
    const start = Date.now();
    const t2 = setInterval(() => {
      const p = Math.max(0, 100 - ((Date.now() - start) / 4000) * 100);
      setProgress(p);
      if (p === 0) clearInterval(t2);
    }, 30);
    return () => { clearTimeout(t1); clearInterval(t2); };
  }, []);

  return (
    <div style={{
      position: 'relative', backgroundColor: '#fff', borderRadius: 12,
      borderLeft: `4px solid ${s.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      padding: '16px 16px 20px', minWidth: 320, maxWidth: 400, overflow: 'hidden',
      transform: visible ? 'translateX(0)' : 'translateX(110%)', opacity: visible ? 1 : 0,
      transition: 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
      display: 'flex', alignItems: 'flex-start', gap: 12,
    }}>
      <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{s.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="font-sora" style={{ margin: '0 0 4px', fontWeight: 700, fontSize: 14, color: '#111827' }}>{title}</p>
        <p className="font-dm" style={{ margin: 0, fontWeight: 400, fontSize: 13, color: '#4b5563', lineHeight: 1.5 }}>{message}</p>
      </div>
      <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 16, padding: 0 }}>✕</button>
      <div style={{ position: 'absolute', bottom: 0, left: 0, height: 3, backgroundColor: '#f3f4f6', right: 0 }}>
        <div style={{ height: '100%', width: `${progress}%`, backgroundColor: s.border, transition: 'width 0.03s linear', borderRadius: '0 0 0 12px' }} />
      </div>
    </div>
  );
}

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <Toast {...t} onClose={() => onRemove(t.id)} />
        </div>
      ))}
    </div>
  );
}
