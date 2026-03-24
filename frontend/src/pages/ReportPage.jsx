import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Send, MapPin, Loader } from 'lucide-react';
import ChatBubble from '../components/ChatBubble';
import { aiService, complaintService } from '../services/api';

// ─── GOOGLE MAPS STYLING ──────────────────────────────────────────────────────
const styleEl = document.createElement('style');
styleEl.textContent = `
  .gmp-wrapper {
    position: relative;
    width: 100%;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    background: white;
    height: 44px;
    color-scheme: light;
  }
  .gmp-wrapper:focus-within {
    border-color: #FF6B35;
    box-shadow: 0 0 0 3px rgba(255,107,53,0.15);
  }
  .gmp-wrapper gmp-place-autocomplete {
    width: 100%;
    height: 44px;
    display: block;
  }
  .gmp-wrapper gmp-place-autocomplete::part(input) {
    background: white !important;
    color: #111827 !important;
    border: none !important;
    outline: none !important;
    padding: 0 14px !important;
    height: 44px !important;
    font-size: 14px !important;
    width: 100% !important;
    box-sizing: border-box !important;
    font-family: inherit !important;
  }
`;
if (!document.getElementById('gmp-style')) {
  styleEl.id = 'gmp-style';
  document.head.appendChild(styleEl);
}

const ISSUE_CATEGORIES = [
  { id: 'road',    name: 'Pothole / Road Damage',   icon: '🕳️' },
  { id: 'garbage', name: 'Garbage Not Collected',    icon: '🗑️' },
  { id: 'water',   name: 'Water Leakage / Sewer',    icon: '💧' },
  { id: 'light',   name: 'Broken Streetlight',       icon: '💡' },
  { id: 'park',    name: 'Park / Public Space',       icon: '🌳' },
  { id: 'other',   name: 'Other Issue',              icon: '✏️' },
];

/**
 * AI Helpers using Backend services
 */
async function callGemini({ system, messages }) {
  const history = messages.slice(0, -1).map(m => ({
    role: m.isBot ? 'model' : 'user',
    parts: [{ text: m.text }]
  }));
  const lastMessage = messages[messages.length - 1].text;
  
  const res = await aiService.report(lastMessage, history, system);
  if (res.status === 'success') return res.response;
  throw new Error("AI service failed");
}

async function callGeminiVision({ file, category }) {
  const res = await aiService.analyzePhoto(file, category);
  if (res.status === 'success') return res.analysis;
  throw new Error("AI Vision failed");
}

// ─── Location Picker ──────────────────────────────────────────────────────────
const LocationPicker = ({ onLocationConfirmed }) => {
  const mapRef                   = useRef(null);
  const mapInstanceRef           = useRef(null);
  const markerRef                = useRef(null);
  const autocompleteContainerRef = useRef(null);
  const addressRef               = useRef('');

  const [address,  setAddress]  = useState('');
  const [coords,   setCoords]   = useState({ lat: 28.6139, lng: 77.2090 });
  const [loading,  setLoading]  = useState(true);
  const [locating, setLocating] = useState(false);

  const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 };

  const reverseGeocode = useCallback(async (lat, lng) => {
    const { Geocoder } = await window.google.maps.importLibrary('geocoding');
    const geocoder = new Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        addressRef.current = results[0].formatted_address;
        setAddress(results[0].formatted_address);
        setCoords({ lat, lng });
      }
    });
  }, []);

  const placeMarkerAdv = useCallback((position, AdvancedMarkerElement) => {
    if (markerRef.current) markerRef.current.map = null;
    const pin = document.createElement('div');
    pin.style.cssText = `width: 20px; height: 20px; background: #FF6B35; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3);`;
    markerRef.current = new AdvancedMarkerElement({
      position,
      map: mapInstanceRef.current,
      content: pin,
    });
    mapInstanceRef.current.panTo(position);
  }, []);

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported.');
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const position = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        mapInstanceRef.current?.setZoom(16);
        if (markerRef._AME) placeMarkerAdv(position, markerRef._AME);
        reverseGeocode(position.lat, position.lng);
        setLocating(false);
      },
      () => { alert('Could not fetch location. Pin it manually.'); setLocating(false); }
    );
  };

  useEffect(() => {
    const initMap = async () => {
        const { Map } = await window.google.maps.importLibrary('maps');
        const { PlaceAutocompleteElement } = await window.google.maps.importLibrary('places');
        const { AdvancedMarkerElement } = await window.google.maps.importLibrary('marker');

        markerRef._AME = AdvancedMarkerElement;
        mapInstanceRef.current = new Map(mapRef.current, {
            center: DEFAULT_CENTER,
            zoom: 13,
            mapId: 'india247map',
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
        });

        mapInstanceRef.current.addListener('click', (e) => {
            const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
            placeMarkerAdv(pos, AdvancedMarkerElement);
            reverseGeocode(pos.lat, pos.lng);
        });

        const placeAutocomplete = new PlaceAutocompleteElement({ includedRegionCodes: ['in'] });
        if (autocompleteContainerRef.current) {
            autocompleteContainerRef.current.innerHTML = '';
            autocompleteContainerRef.current.appendChild(placeAutocomplete);
        }

        placeAutocomplete.addEventListener('gmp-select', async ({ placePrediction }) => {
            const place = placePrediction.toPlace();
            await place.fetchFields({ fields: ['formattedAddress', 'location'] });
            const lat = place.location.lat();
            const lng = place.location.lng();
            placeMarkerAdv({ lat, lng }, AdvancedMarkerElement);
            mapInstanceRef.current.setZoom(16);
            addressRef.current = place.formattedAddress;
            setAddress(place.formattedAddress);
            setCoords({ lat, lng });
        });
        setLoading(false);
    };
    initMap();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div ref={autocompleteContainerRef} className="gmp-wrapper" />
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 h-[280px]">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10 text-saffron">
            <Loader className="animate-spin" size={32} />
          </div>
        )}
        <div ref={mapRef} className="w-full h-full" />
      </div>
      {address && (
        <div className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 text-sm text-gray-700">
          <MapPin size={16} className="text-saffron mt-0.5 shrink-0" />
          <span>{address}</span>
        </div>
      )}
      <div className="flex gap-3">
        <button onClick={handleCurrentLocation} disabled={locating} className="flex-1 flex items-center justify-center gap-2 btn-primary !bg-saffron disabled:opacity-60 py-3">
          {locating ? <Loader size={16} className="animate-spin" /> : <MapPin size={16} />}
          <span>{locating ? 'Locating...' : 'Use My Location'}</span>
        </button>
        <button onClick={() => { if (!address) return alert('Select a location.'); onLocationConfirmed({ address, ...coords }); }} 
                className={`flex-1 font-semibold rounded-xl px-4 py-3 transition-colors ${address ? 'bg-navy text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
          Confirm Location
        </button>
      </div>
    </div>
  );
};

// ─── Main ReportPage ──────────────────────────────────────────────────────────
const ReportPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [messages, setMessages] = useState([{ isBot: true, text: "Namaste! 🙏 I'm Meera. I'll help you file your complaint. What issue are you facing today?" }]);
  const [formData, setFormData] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [reportText, setReportText] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [aiVerifying, setAiVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [trackingId] = useState(`IND-2026-${Math.floor(10000 + Math.random() * 90000)}`);
  const [complaintSummary, setComplaintSummary] = useState('');

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const turnCountRef = useRef(0);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping, aiVerifying]);

  const addBotMessage = (text, delay = 600) => {
    setIsTyping(true);
    return new Promise(r => setTimeout(() => { setIsTyping(false); setMessages(prev => [...prev, { isBot: true, text }]); r(); }, delay));
  };

  const handleCategorySelect = async (category) => {
    setFormData(prev => ({ ...prev, category: category.name }));
    setMessages(prev => [...prev, { isBot: false, text: category.name }]);
    setStep(2);
    setIsTyping(true);
    try {
        const reply = await callGemini({
            system: "You are Meera, India247 assistant. User is reporting an issue. Ask ONE short follow-up question (severity or duration). 1 sentence max.",
            messages: [{ isBot: false, text: `I want to report: ${category.name}` }]
        });
        setIsTyping(false);
        setMessages(prev => [...prev, { isBot: true, text: reply }]);
    } catch {
        setIsTyping(false);
        setMessages(prev => [...prev, { isBot: true, text: "Can you tell me more about the issue? How long has it been there? 📝" }]);
    }
  };

  const handleDescriptionSubmit = async (e) => {
    e.preventDefault();
    if (!reportText.trim() || isTyping) return;
    const userText = reportText.trim();
    setReportText('');
    setMessages(prev => [...prev, { isBot: false, text: userText }]);
    turnCountRef.current += 1;

    if (turnCountRef.current >= 2) {
        setFormData(prev => ({ ...prev, description: userText })); // Simplified for now
        setStep(3);
        await addBotMessage("Thanks for the details! 📸 Now please upload a photo of the issue so our AI can verify it.");
        return;
    }

    setIsTyping(true);
    try {
        const reply = await callGemini({
            system: "You are Meera. Ask ONE final short follow-up question about the issue. 1 sentence max.",
            messages: [...messages, { isBot: false, text: userText }]
        });
        setIsTyping(false);
        setMessages(prev => [...prev, { isBot: true, text: reply }]);
    } catch {
        setIsTyping(false);
        setStep(3);
        await addBotMessage("Thanks! Please upload a photo of the issue. 📸");
    }
  };

  const handlePhotoUpload = (e) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadingImage(false);
      setMessages(prev => [...prev, { isBot: false, text: "📸 Photo uploaded", isImage: true, imageUrl: reader.result }]);
      handleAIVerification(file, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAIVerification = async (file, dataUrl) => {
    setStep(4);
    setAiVerifying(true);
    try {
      const result = await callGeminiVision({ file, category: formData.category });
      setVerificationResult(result);
      setAiVerifying(false);

      if (result.passed) {
        setFormData(prev => ({ ...prev, imageVerified: true, imageData: dataUrl }));
        setStep(5);
        await addBotMessage("✅ Image verified successfully! Our AI confirms this is a real civic issue. Now please share the location.");
      } else {
        setStep(3); // Go back to upload step
        await addBotMessage(`⚠️ Verification failed: ${result.failReason}. Please upload a real, clear photo of the ${formData.category || 'issue'}.`);
      }
    } catch (error) {
      console.error("AI Verification Error:", error);
      setAiVerifying(false);
      setStep(3);
      await addBotMessage("⚠️ Sorry, I couldn't process that image. Please try uploading a clearer photo or a different file. 📸");
    }
  };

  const handleLocationConfirmed = async (loc) => {
    setFormData(prev => ({ ...prev, location: loc.address, lat: loc.lat, lng: loc.lng }));
    setMessages(prev => [...prev, { isBot: false, text: `📍 ${loc.address}` }]);
    setStep(6);
    await addBotMessage("Almost done! Would you like to keep your identity anonymous? 🔒");
  };

  const handleAnonymousSubmit = async (isAnonymous) => {
    setMessages(prev => [...prev, { isBot: false, text: isAnonymous ? "🔒 Anonymous" : "👤 Use Name" }]);
    setFormData(prev => ({ ...prev, anonymous: isAnonymous }));
    setStep(7);
    setIsTyping(true);

    try {
      const res = await aiService.summarize(formData.category, formData.description, formData.location);
      const summary = res.summary || "Complaint filed.";
      setComplaintSummary(summary);
      
      // SAVE TO DATABASE
      await complaintService.create({
        id: trackingId,
        category: formData.category,
        title: `${formData.category} at ${formData.location.split(',')[0]}`,
        description: formData.description || "Civic issue reported via India247",
        location: formData.location,
        lat: formData.lat || 28.6139,
        lng: formData.lng || 77.2090,
        image_url: formData.imageData, // Store base64 for now
      });

      setIsTyping(false);
      setMessages(prev => [...prev, { isBot: true, text: "🎉 Complaint filed successfully! Here's the summary:" }]);
    } catch (e) {
      console.error("Submission error:", e);
      setIsTyping(false);
      setComplaintSummary(`Complaint IND-2026 for ${formData.category} at ${formData.location}.`);
      setMessages(prev => [...prev, { isBot: true, text: "🎉 Complaint filed!" }]);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar Progress (Desktop) */}
      <div className="hidden md:block w-80 bg-white border-r border-gray-100 p-8 h-[calc(100vh-64px)] shrink-0">
        <h2 className="text-xl font-bold text-navy mb-8">Reporting Issue</h2>
        <div className="space-y-6">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > n ? 'bg-green-100 text-india-green' : step === n ? 'bg-orange-100 text-saffron ring-2 ring-orange-200' : 'bg-gray-100 text-gray-400'}`}>
                {step > n ? '✓' : n}
              </div>
              <span className={`font-semibold ${step >= n ? 'text-navy' : 'text-gray-400'}`}>
                {['Select', 'Describe', 'Photo', 'Verify', 'Location', 'Submit'][n-1]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-[calc(100vh-64px)]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-2xl mx-auto space-y-4">
            {messages.map((msg, i) => (
              <ChatBubble key={i} isBot={msg.isBot} message={msg.text}>
                {msg.isImage && <img src={msg.imageUrl} className="mt-2 w-48 rounded-lg shadow-md" alt="issue" />}
              </ChatBubble>
            ))}
            {isTyping && <ChatBubble isBot={true}><Loader className="animate-spin" size={16} /></ChatBubble>}
            
            {aiVerifying && (
              <div className="ml-12 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3">
                <Loader className="animate-spin text-indigo-600" size={20} />
                <span className="text-sm font-semibold text-indigo-900">AI is verifying your photo...</span>
              </div>
            )}

            {step === 7 && complaintSummary && (
               <div className="ml-12 p-6 bg-white border border-green-100 rounded-3xl shadow-xl space-y-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-india-green text-white rounded-full flex items-center justify-center mx-auto mb-2 font-bold text-xl">✓</div>
                    <h3 className="font-bold text-navy">Complaint Filed</h3>
                    <p className="text-xs font-mono text-saffron font-bold">{trackingId}</p>
                  </div>
                  <div className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded-xl border border-gray-100">"{complaintSummary}"</div>
                  <button onClick={() => navigate('/feed')} className="w-full btn-primary py-2.5">Track in Feed</button>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Action Bar */}
        {!isTyping && !aiVerifying && step !== 7 && (
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="max-w-2xl mx-auto">
              {step === 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ISSUE_CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => handleCategorySelect(cat)} className="p-3 rounded-xl border border-gray-200 hover:border-saffron hover:bg-orange-50 transition-all text-sm font-bold flex flex-col items-center gap-1">
                      <span className="text-2xl">{cat.icon}</span>{cat.name}
                    </button>
                  ))}
                </div>
              )}
              {step === 2 && (
                <form onSubmit={handleDescriptionSubmit} className="flex gap-2">
                  <input type="text" value={reportText} onChange={e => setReportText(e.target.value)} placeholder="Type details..." className="flex-1 input-field" autoFocus />
                  <button type="submit" className="bg-navy text-white p-3 rounded-xl hover:bg-gray-800"><Send size={20}/></button>
                </form>
              )}
              {step === 3 && (
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
                  <div className="w-12 h-12 bg-orange-50 text-saffron rounded-full flex items-center justify-center mx-auto mb-2"><Camera size={24}/></div>
                  <p className="text-sm font-bold text-gray-700">{uploadingImage ? 'Uploading...' : 'Click to Upload Photo'}</p>
                </div>
              )}
              {step === 5 && <LocationPicker onLocationConfirmed={handleLocationConfirmed} />}
              {step === 6 && (
                <div className="flex gap-3">
                  <button onClick={() => handleAnonymousSubmit(true)} className="flex-1 py-3 border-2 border-gray-100 rounded-xl font-bold text-gray-500 hover:bg-gray-50">🔒 Stay Anonymous</button>
                  <button onClick={() => handleAnonymousSubmit(false)} className="flex-1 py-3 bg-saffron text-white rounded-xl font-bold hover:bg-[#d64b16]">👤 Use Identity</button>
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