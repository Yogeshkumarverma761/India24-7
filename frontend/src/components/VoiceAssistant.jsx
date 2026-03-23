import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Navigation } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { aiService } from '../services/api';

const VoiceAssistant = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    
    // Recognition ref
    const recognitionRef = useRef(null);
    const synthRef = useRef(window.speechSynthesis);

    useEffect(() => {
        // Initialize speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-IN'; // Indian English
            
            recognitionRef.current.onresult = (event) => {
                const text = event.results[0][0].transcript;
                setTranscript(text);
                processCommand(text);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current.onerror = (err) => {
                console.error("Speech Recognition Error:", err);
                setIsListening(false);
            };
        }
    }, []);

    const speak = (text) => {
        if (!synthRef.current) return;
        
        // Stop any current speech
        synthRef.current.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-IN';
        utterance.rate = 1.0;
        utterance.pitch = 1.1; // Slightly higher pitch for "Meera"
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        synthRef.current.speak(utterance);
    };

    const processCommand = async (text) => {
        setResponse("Thinking...");
        
        // Command bypass for quick navigation
        const lowText = text.toLowerCase();
        if (lowText.includes("map")) {
            navigate('/map');
            speak("Sure! Let's take a look at the live complaint map.");
            setResponse("Navigating to Map...");
            return;
        }
        if (lowText.includes("report") || lowText.includes("pothole") || lowText.includes("garbage")) {
            navigate('/report');
            speak("Absolutely. I can help you report that immediately. I'm taking you to the reporting page.");
            setResponse("Navigating to Report Page...");
            return;
        }
        if (lowText.includes("feed") || lowText.includes("happening")) {
            navigate('/feed');
            speak("Showing the latest civic updates in your area.");
            setResponse("Navigating to Feed...");
            return;
        }
        if (lowText.includes("reward") || lowText.includes("points")) {
            navigate('/rewards');
            speak("Let's check your rewards and points.");
            setResponse("Navigating to Rewards...");
            return;
        }

        // Otherwise, ask AI
        try {
            const systemPrompt = `You are Meera, the personal voice assistant for India247. 
Keep your response short (max 2 sentences) because it will be spoken out loud.
User is currently on: ${location.pathname}.
Your goal is to guide them on how to use India247 (report issues, track, earn rewards).`;
            
            const aiRes = await aiService.voice(text, [], systemPrompt);
            const msg = aiRes.response || "I'm here to help!";
            setResponse(msg);
            speak(msg);
        } catch (error) {
            console.error("Voice AI Error:", error);
            const fallback = "Sorry, I couldn't reach the backend. How can I help you today?";
            setResponse(fallback);
            speak(fallback);
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setTranscript('');
            setResponse('');
            try {
                recognitionRef.current?.start();
                setIsListening(true);
                // Stop speech if listening starts
                synthRef.current?.cancel();
            } catch (e) {
                console.error("Start Listening Error:", e);
            }
        }
    };

    if (!isOpen) {
        return (
            <button 
              onClick={() => { setIsOpen(true); speak("Namaste! I am Meera, your personal India247 assistant. How can I help you today?"); }}
              className="fixed bottom-20 right-6 md:bottom-8 z-50 p-4 bg-navy text-white rounded-full shadow-2xl hover:scale-110 transition-all border-4 border-white group"
              title="Click for Meera Voice Assistant"
            >
              <Mic size={28} className="group-hover:animate-pulse" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-saffron rounded-full border-2 border-white"></div>
            </button>
        );
    }

    return (
        <div className="fixed bottom-20 right-6 md:bottom-8 z-[1000] w-72 md:w-80 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-gray-100 flex flex-col p-4 animate-in fade-in slide-in-from-bottom-5">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-saffron rounded-xl flex items-center justify-center text-white">
                        <Volume2 size={18} />
                    </div>
                    <div>
                        <h4 className="font-black text-navy text-sm leading-tight">Meera Voice</h4>
                        <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}></div>
                            <span className="text-[10px] uppercase font-bold text-gray-400">{isListening ? 'Listening...' : 'Online'}</span>
                        </div>
                    </div>
                </div>
                <button onClick={() => { setIsOpen(false); synthRef.current?.cancel(); }} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} className="text-gray-400" />
                </button>
            </div>

            <div className="flex-1 bg-gray-50 rounded-2xl p-4 mb-4 min-h-[120px] flex flex-col justify-center text-center">
                {transcript ? (
                    <div className="mb-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">You said</p>
                        <p className="text-gray-800 font-semibold italic text-sm">"{transcript}"</p>
                    </div>
                ) : !isListening && (
                    <p className="text-gray-400 text-sm font-medium">Click the mic & talk to me...</p>
                )}
                
                {response && response !== "Thinking..." && (
                    <div className="animate-in fade-in slide-in-from-top-2">
                        <p className="text-xs font-bold text-saffron uppercase tracking-widest mb-1">Meera</p>
                        <p className="text-navy font-bold text-sm leading-snug">{response}</p>
                    </div>
                )}

                {(isListening || isSpeaking) && (
                    <div className="flex justify-center items-center gap-1.5 mt-4">
                        {[0.4, 0.6, 0.8, 0.5, 0.7].map((h, i) => (
                            <div 
                              key={i} 
                              className={`w-1 bg-saffron rounded-full animate-wave`} 
                              style={{ 
                                height: isListening ? '24px' : '12px',
                                animationDelay: `${i * 0.1}s`,
                                opacity: h
                              }}
                            ></div>
                        ))}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3">
                <button 
                  onClick={toggleListening}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-md ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'bg-navy text-white hover:bg-gray-800'
                  }`}
                >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                    {isListening ? 'Stop' : 'Tap to Speak'}
                </button>
                <div className="flex flex-col gap-1">
                    <div className="text-[8px] font-bold text-gray-300 text-center">TRY SAYS</div>
                    <div className="flex gap-1">
                         <button onClick={() => processCommand("Go to map")} className="p-2 bg-saffron/10 text-saffron rounded-lg hover:bg-saffron/20 transition-colors" title="Go to map">
                             <Navigation size={14} />
                         </button>
                    </div>
                </div>
            </div>
            
            <p className="text-[10px] text-center text-gray-400 mt-3 font-medium">Powered by Gemini 1.5 Flash</p>
        </div>
    );
};

export default VoiceAssistant;
