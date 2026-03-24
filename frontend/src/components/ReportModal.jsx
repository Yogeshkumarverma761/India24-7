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
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-end md:items-center justify-center md:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-[24px] md:rounded-[16px] shadow-2xl w-full md:max-w-[500px] p-6 md:p-8 modal-slide-up no-scrollbar overflow-y-auto max-h-[92vh] md:max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-sora text-[22px] font-[800] text-charcoal tracking-[-0.5px]">File a New Report</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Issue Type */}
          <div>
            <label className="font-sora text-[11px] font-[800] text-charcoal tracking-widest uppercase mb-3 block">Issue Type</label>
            <div className="grid grid-cols-2 gap-3">
              {ISSUE_TYPES.map(t => (
                <button key={t.id} onClick={() => setIssueType(t.id)}
                  className={`font-sora flex flex-col items-center justify-center p-4 rounded-[12px] border transition-all ${
                    t.id === 'Other' ? 'col-span-2' : ''
                  } ${issueType === t.id
                    ? 'border-teal-mid bg-teal-light shadow-[0_0_0_1px_rgba(31,122,122,0.1)]'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}>
                  <img src={t.icon} alt={t.label} className="w-8 h-8 object-contain mb-2 drop-shadow-sm" />
                  <span className="text-[13px] font-[700] text-charcoal leading-none">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="font-sora text-[11px] font-[800] text-charcoal tracking-widest uppercase mb-2 block">Report Title</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Broken Streetlight on Main Road" className="input-field" />
          </div>

          {/* Description */}
          <div>
            <label className="font-sora text-[11px] font-[800] text-charcoal tracking-widest uppercase mb-2 block">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="font-sora w-full h-[120px] p-4 rounded-[12px] bg-[#F8FAFC] border border-gray-200 text-charcoal text-[14px] placeholder:text-gray-400 outline-none focus:border-teal-mid focus:bg-white transition-all resize-none" />
          </div>

          {/* Photo */}
          <div>
            <label className="font-sora text-[11px] font-[800] text-charcoal tracking-widest uppercase mb-2 block">Photo Evidence</label>
            <input type="file" accept="image/*" id="photo-upload" className="hidden" onChange={handlePhoto} />
            {photoPreview ? (
              <div className="relative w-full h-[140px] rounded-[16px] overflow-hidden border border-gray-200 group">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => { setPhotoPreview(null); setPhotoFile(null); document.getElementById('photo-upload').value = ''; }}
                    className="font-sora bg-white text-red px-4 py-2 rounded-full text-[13px] font-[800] shadow-md flex items-center gap-2">
                    <X className="w-4 h-4" /> Remove Photo
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => document.getElementById('photo-upload').click()}
                className="w-full h-[110px] rounded-[16px] border-[2px] border-dashed border-teal-mid/40 bg-teal-light flex flex-col items-center justify-center hover:bg-[#d1e6e2] hover:border-teal-mid/60 transition-all group">
                <Upload className="w-[28px] h-[28px] text-teal-mid mb-2.5 group-hover:scale-110 transition-transform" />
                <span className="font-sora text-[14px] font-[800] text-teal-mid mb-1">Click to upload photo</span>
                <span className="font-sora text-[11px] text-slate font-[600]">Camera or gallery · Location auto-captured</span>
              </button>
            )}
          </div>

          {/* Location Tag */}
          <div className="flex items-center gap-2 justify-center py-2 bg-gray-50 rounded-[12px] border border-gray-100">
            <div className="w-2.5 h-2.5 rounded-full bg-green" />
            <span className="font-sora text-[12px] font-[700] text-slate">
              Location auto-tagged near <strong className="text-charcoal">{locationName?.split(',')[0] || 'Detecting...'}</strong>
            </span>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={submitting || !issueType || !title || !description}
            className={`font-sora w-full h-[52px] rounded-[12px] text-[15px] font-[800] shadow-md transition-all flex items-center justify-center gap-2 ${
              submitting ? 'bg-warm-orange/60 text-white cursor-not-allowed' : 'bg-warm-orange hover:bg-warm-orange-hover text-white hover:shadow-lg'
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
