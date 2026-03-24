import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';

const ISSUE_TYPES = [
  { id: 'Pothole', icon: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Hole.png', label: 'Pothole' },
  { id: 'Broken Streetlight', icon: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Light%20Bulb.png', label: 'Broken Streetlight' },
  { id: 'Garbage', icon: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Wastebasket.png', label: 'Garbage' },
  { id: 'Water Logging', icon: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Droplet.png', label: 'Water Logging' },
  { id: 'Other', icon: 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Memo.png', label: 'Other / Specify Below' },
];

export default function ReportModal({ open, onClose, onSubmit, locationName, submitting }) {
  const [issueType, setIssueType] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  if (!open) return null;

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (!issueType || !title || !description) return;
    onSubmit({ issueType, title, description, photoFile, photoPreview });
    // Reset
    setIssueType(''); setTitle(''); setDescription(''); setPhotoPreview(null); setPhotoFile(null);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center md:p-4 font-inter" onClick={onClose}>
      <div className="bg-white rounded-t-xl md:rounded-xl shadow-lg w-full md:max-w-[500px] p-6 md:p-8 modal-slide-up no-scrollbar overflow-y-auto max-h-[92vh] md:max-h-[90vh] border border-[hsl(220_13%_90%)]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[20px] font-semibold text-[hsl(220_30%_10%)] tracking-tight">File a New Report</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-[hsl(210_15%_95%)] text-[hsl(220_10%_45%)] hover:bg-[hsl(220_13%_90%)] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Issue Type */}
          <div>
            <label className="text-[12px] font-semibold text-[hsl(220_30%_10%)] mb-3 block">ISSUE TYPE</label>
            <div className="grid grid-cols-2 gap-3">
              {ISSUE_TYPES.map(t => (
                <button key={t.id} onClick={() => setIssueType(t.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                    t.id === 'Other' ? 'col-span-2' : ''
                  } ${issueType === t.id
                    ? 'border-[hsl(220_60%_25%)] bg-[hsl(210_15%_95%)] bg-opacity-30 shadow-sm'
                    : 'border-[hsl(220_13%_90%)] hover:border-[hsl(220_10%_45%)] bg-white'
                  }`}>
                  <img src={t.icon} alt={t.label} className="w-8 h-8 object-contain mb-2 drop-shadow-sm" />
                  <span className="text-[13px] font-medium text-[hsl(220_30%_10%)] leading-none">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-[12px] font-semibold text-[hsl(220_30%_10%)] mb-2 block">REPORT TITLE</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Broken Streetlight on Main Road" className="input-field" />
          </div>

          {/* Description */}
          <div>
            <label className="text-[12px] font-semibold text-[hsl(220_30%_10%)] mb-2 block">DESCRIPTION</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="w-full h-[120px] p-3 rounded-xl bg-transparent border border-[hsl(220_13%_90%)] text-[hsl(220_30%_10%)] text-[14px] placeholder:text-[hsl(220_10%_45%)] outline-none focus:border-[hsl(220_60%_25%)] focus:ring-1 focus:ring-[hsl(220_60%_25%)] transition-all resize-none" />
          </div>

          {/* Photo */}
          <div>
            <label className="text-[12px] font-semibold text-[hsl(220_30%_10%)] mb-2 block">PHOTO EVIDENCE</label>
            <input type="file" accept="image/*" id="photo-upload" className="hidden" onChange={handlePhoto} />
            {photoPreview ? (
              <div className="relative w-full h-[140px] rounded-xl overflow-hidden border border-[hsl(220_13%_90%)] group">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => { setPhotoPreview(null); setPhotoFile(null); document.getElementById('photo-upload').value = ''; }}
                    className="bg-white text-[hsl(0_84%_60%)] px-4 py-2 rounded-full text-[13px] font-semibold shadow-sm flex items-center gap-2">
                    <X className="w-4 h-4" /> Remove Photo
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => document.getElementById('photo-upload').click()}
                className="w-full h-[110px] rounded-xl border-2 border-dashed border-[hsl(220_13%_90%)] bg-[hsl(210_15%_95%)] bg-opacity-50 flex flex-col items-center justify-center hover:bg-[hsl(210_15%_95%)] hover:border-[hsl(220_10%_45%)] transition-all group">
                <Upload className="w-[24px] h-[24px] text-[hsl(220_10%_45%)] mb-2.5 group-hover:scale-110 transition-transform" />
                <span className="text-[14px] font-medium text-[hsl(220_30%_10%)] mb-1">Click to upload photo</span>
                <span className="text-[11px] text-[hsl(220_10%_45%)]">Camera or gallery · Location auto-captured</span>
              </button>
            )}
          </div>

          {/* Location Tag */}
          <div className="flex items-center gap-2 justify-center py-2 bg-[hsl(210_15%_95%)] rounded-xl border border-[hsl(220_13%_90%)]">
            <div className="w-2 h-2 rounded-full bg-[hsl(160_60%_40%)]" />
            <span className="text-[13px] font-medium text-[hsl(220_10%_45%)]">
              Location auto-tagged near <strong className="text-[hsl(220_30%_10%)] font-semibold">{locationName?.split(',')[0] || 'Detecting...'}</strong>
            </span>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={submitting || !issueType || !title || !description}
            className={`w-full h-[44px] rounded-md text-[14px] font-medium transition-colors flex items-center justify-center gap-2 ${
              submitting ? 'bg-[hsl(24_90%_52%)]/60 text-white cursor-not-allowed' : 'bg-[hsl(24_90%_52%)] hover:bg-[hsl(24_90%_45%)] text-white shadow-sm'
            }`}>
            {submitting ? (
              <>
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Submitting...
              </>
            ) : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
}
