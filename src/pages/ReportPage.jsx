import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Send, MapPin, Search } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';

const ISSUE_CATEGORIES = [
  { id: 'road', name: 'Pothole / Road Damage', icon: '🕳️' },
  { id: 'garbage', name: 'Garbage Not Collected', icon: '🗑️' },
  { id: 'water', name: 'Water Leakage / Sewer', icon: '💧' },
  { id: 'light', name: 'Broken Streetlight', icon: '💡' },
  { id: 'park', name: 'Park / Public Space', icon: '🌳' },
  { id: 'other', name: 'Other Issue', icon: '✏️' }
];

const ReportPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [messages, setMessages] = useState([
    { isBot: true, text: "Namaste! 🙏 I'm India247 Assistant. I'll help you file your complaint in under 60 seconds. What civic issue are you facing today?" }
  ]);
  const [formData, setFormData] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [reportText, setReportText] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [aiVerifying, setAiVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, aiVerifying]);

  const addBotMessage = (text, delay = 800) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { isBot: true, text }]);
    }, delay);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { isBot: false, text }]);
  };

  // Step 1 handler
  const handleCategorySelect = (category) => {
    setFormData({ ...formData, category: category.name });
    addUserMessage(category.name);
    setStep(2);
    addBotMessage("Can you describe the issue in a bit more detail? (e.g., how big is the pothole, since how long has garbage not been collected, etc.)");
  };

  // Step 2 handler
  const handleDescriptionSubmit = (e) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    
    setFormData({ ...formData, description: reportText });
    addUserMessage(reportText);
    setReportText('');
    setStep(3);
    addBotMessage("Please upload a photo of the issue. This helps our AI verify your complaint and speeds up resolution! 📸");
  };

  // Step 3 handler
  const handlePhotoClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handlePhotoUpload = (e) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploadingImage(true);
    // Simulate upload delay
    setTimeout(() => {
      setUploadingImage(false);
      setMessages(prev => [...prev, { isBot: false, text: "Image uploaded ✓", isImage: true }]);
      handleAIVerification();
    }, 1500);
  };

  // Step 4 handler (AI Verification)
  const handleAIVerification = () => {
    setStep(4);
    setAiVerifying(true);
    
    // Simulate 4 steps of AI verification
    const runVerification = async () => {
      for(let i=1; i<=4; i++) {
        await new Promise(r => setTimeout(r, 1200));
        setVerificationStep(i);
      }
      await new Promise(r => setTimeout(r, 1000));
      setAiVerifying(false);
      setStep(5);
      setFormData(prev => ({ ...prev, verified: true }));
      addBotMessage(`Great! AI has confirmed this looks like a genuine ${formData.category || 'civic'} issue 🎉. Now, can you share your location? This helps assign your complaint to the right ward.`);
    };
    
    runVerification();
  };

  // Step 5
  const handleLocationSubmit = (type) => {
    addUserMessage(type === 'gps' ? "📍 Current Location" : "Delhi, Connaught Place");
    setFormData({ ...formData, location: "Delhi, Connaught Place" });
    setStep(6);
    addBotMessage("One last thing — do you want to keep your identity anonymous? Your complaint will still be filed and tracked, but officials won't see your name or contact details.");
  };

  // Step 6 -> 7
  const handleAnonymousSubmit = (isAnonymous) => {
    addUserMessage(isAnonymous ? "🔒 Yes, keep me anonymous" : "👤 No, use my name");
    setStep(7);
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, { isBot: true, text: "🎉 Your complaint has been successfully filed!" }]);
    }, 1000);
  };

  const stepsList = [
    { num: 1, text: "Select Issue" },
    { num: 2, text: "Describe Issue" },
    { num: 3, text: "Upload Photo" },
    { num: 4, text: "AI Verification" },
    { num: 5, text: "Add Location" },
    { num: 6, text: "Confirm & Submit" }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop Only */}
      <div className="hidden md:block w-80 bg-white border-r border-gray-100 p-8 h-[calc(100vh-64px)] overflow-y-auto sticky top-16">
        <h2 className="text-xl font-bold text-navy mb-8">Filing Complaint</h2>
        <div className="space-y-6">
          {stepsList.map((s) => {
            const isCompleted = step > s.num || (s.num === 7);
            const isActive = step === s.num;
            return (
              <div key={s.num} className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isCompleted ? 'bg-green-100 text-india-green' : 
                  isActive ? 'bg-orange-100 text-saffron ring-2 ring-orange-200' : 'bg-gray-100 text-gray-400'
                }`}>
                  {isCompleted ? '✓' : isActive && s.num === 4 ? '⟳' : isActive ? '○' : '○'}
                </div>
                <span className={`font-semibold ${
                  isCompleted ? 'text-gray-800' : isActive ? 'text-navy' : 'text-gray-400'
                }`}>
                  {s.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-[calc(100vh-64px)] relative">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            {/* Messages */}
            {messages.map((msg, idx) => (
              <ChatBubble key={idx} isBot={msg.isBot} message={msg.text}>
                {msg.isImage && (
                  <div className="mt-2 w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center border-2 border-white">
                    📸 Photo
                  </div>
                )}
              </ChatBubble>
            ))}

            {isTyping && (
              <ChatBubble isBot={true}>
                <div className="flex space-x-1 items-center h-4">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </ChatBubble>
            )}

            {/* AI Verification Animation Card */}
            {aiVerifying && (
              <div className="ml-12 mr-4 max-w-sm card mb-4 border border-indigo-100 bg-indigo-50/50">
                <div className="flex items-center gap-3 font-semibold text-navy mb-4">
                  <Search className="text-indigo-600 animate-pulse" size={20} />
                  <span>AI Verification in Progress</span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    {verificationStep > 0 ? <span className="text-green-600 font-bold">✓</span> : <span className="opacity-0">✓</span>}
                    <span className={verificationStep >= 1 ? 'text-gray-800' : 'text-gray-400'}>Analyzing uploaded image...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {verificationStep > 1 ? <span className="text-green-600 font-bold">✓</span> : <span className="opacity-0">✓</span>}
                    <span className={verificationStep >= 2 ? 'text-gray-800' : 'text-gray-400'}>Detecting issue category...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {verificationStep > 2 ? <span className="text-green-600 font-bold">✓</span> : <span className="opacity-0">✓</span>}
                    <span className={verificationStep >= 3 ? 'text-gray-800' : 'text-gray-400'}>Verifying location authenticity...</span>
                  </div>
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-indigo-100/50">
                    {verificationStep > 3 ? (
                      <span className="text-india-green font-bold flex items-center gap-2">
                        ✅ Complaint verified successfully!
                      </span>
                    ) : (
                      <div className="h-1.5 w-full bg-indigo-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-1/2 animate-pulse rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Confirmation Card */}
            {step === 7 && !isTyping && (
              <div className="ml-12 mr-4 max-w-sm card mb-8 border-2 border-green-100 bg-green-50/30 text-center py-8">
                <div className="w-16 h-16 bg-india-green rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in text-white text-3xl">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-navy mb-2">Complaint Filed!</h3>
                <div className="bg-white rounded-lg p-3 inline-block mb-4 shadow-sm border border-gray-100">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Tracking ID</p>
                  <p className="font-mono font-bold text-lg text-saffron">IND-2026-{Math.floor(10000 + Math.random() * 90000)}</p>
                </div>
                <div className="text-sm text-gray-600 mb-6 space-y-1">
                  <p><span className="font-semibold text-gray-800">Category:</span> {formData.category}</p>
                  <p><span className="font-semibold text-gray-800">Status:</span> <span className="text-orange-600 font-medium">Pending Update</span></p>
                </div>
                <div className="flex flex-col gap-3 px-4">
                  <button onClick={() => navigate('/tracker')} className="btn-primary py-2.5">
                    Track My Complaint
                  </button>
                  <button onClick={() => window.location.reload()} className="text-saffron font-semibold text-sm hover:underline">
                    Report Another Issue
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        {(!aiVerifying && step !== 7 && !isTyping) && (
          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <div className="max-w-3xl mx-auto">
              
              {step === 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {ISSUE_CATEGORIES.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat)}
                      className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 hover:border-saffron hover:bg-orange-50 hover:text-saffron transition-colors text-sm font-semibold text-gray-600"
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <span className="truncate">{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {step === 2 && (
                <form onSubmit={handleDescriptionSubmit} className="flex gap-2 relative">
                  <input 
                    type="text" 
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="Describe the issue here..." 
                    className="flex-1 input-field"
                    autoFocus
                  />
                  <button 
                    type="submit" 
                    disabled={!reportText.trim()}
                    className="bg-navy text-white rounded-xl px-5 hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={20} />
                  </button>
                </form>
              )}

              {step === 3 && (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group" onClick={handlePhotoClick}>
                  <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                  {uploadingImage ? (
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 border-4 border-saffron border-t-transparent rounded-full animate-spin mb-3"></div>
                      <p className="text-saffron font-semibold">Uploading photo...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-orange-50 text-saffron rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Camera size={28} />
                      </div>
                      <p className="font-semibold text-gray-700 mb-1">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-500">Supports JPG, PNG (Max 5MB)</p>
                    </div>
                  )}
                </div>
              )}

              {step === 5 && (
                <div className="flex flex-col md:flex-row gap-3">
                  <button 
                    onClick={() => handleLocationSubmit('gps')}
                    className="flex-1 flex items-center justify-center gap-2 btn-primary !bg-saffron"
                  >
                    <MapPin size={18} />
                    <span>Use My Current Location</span>
                  </button>
                  <div className="flex items-center justify-center font-medium text-gray-400">or</div>
                  <div className="flex-1 flex gap-2">
                    <input type="text" placeholder="Type My Address" className="input-field flex-1" />
                    <button onClick={() => handleLocationSubmit('text')} className="bg-gray-200 text-gray-700 rounded-xl px-4 font-semibold hover:bg-gray-300">
                      Submit
                    </button>
                  </div>
                </div>
              )}

              {step === 6 && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => handleAnonymousSubmit(true)}
                    className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-200 font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    🔒 Yes, keep me anonymous
                  </button>
                  <button 
                    onClick={() => handleAnonymousSubmit(false)}
                    className="flex-1 py-3 px-4 rounded-xl border-2 border-saffron bg-orange-50 font-semibold text-saffron hover:bg-orange-100 transition-colors"
                  >
                    👤 No, use my name
                  </button>
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
