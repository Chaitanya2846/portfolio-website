import { useState, useEffect, useRef } from "react";
import axios from "axios";

const asciiArt = `
--|-------------------------------------------------------------------------------------|--
  |                                                                                     |
  |        __       __    ______    __        ______    ____     __  ___    ______      |
  |        | |     / /   / ____/   / /       / ____/   / __ \\   /  |/  /   / ____/      |
  |        | | /| / /   / __/     / /       / /       / / / /  / /|_/ /   / __/         |
  |        | |/ |/ /   / /___    / /___    / /___    / /_/ /  / /  / /   / /___         |
  |        |__/|__/   /_____/   /_____/    \\____/    \\____/  /_/  /_/   /_____/         |
  |                                                                                     |
  |    ______    ____          ____     ______    _   __    ____     ______    ____     |
  |   /_  __/   / __ \\        / __ \\   / ____/   / | / /   / __ \\   / ____/   / __ \\    |
  |    / /     / / / /       / /_/ /  / __/     /  |/ /   / / / /  / __/     / /_/ /    |
  |   / /     / /_/ /       / _, _/  / /___    / /|  /   / /_/ /  / /___    / _, _/     |
  |  /_/      \\____/       /_/ |_|  /_____/   /_/ |_/   /_____/  /_____/   /_/ |_|      |
  |                                                                                     |
--|-------------------------------------------------------------------------------------|--
`;

const bootSequence = [
  "INCOMING HTTP REQUEST DETECTED ...",
  "SERVICE WAKING UP ...",
  asciiArt,
  "ALLOCATING COMPUTE RESOURCES ...",
  "PREPARING INSTANCE FOR INITIALIZATION ...",
  "STARTING THE INSTANCE ...",
  "ENVIRONMENT VARIABLES INJECTED ...",
  "FINALIZING STARTUP ...",
  "OPTIMIZING DEPLOYMENT ...",
  "STEADY HANDS. CLEAN LOGS. YOUR APP IS ALMOST LIVE ..."
];

const getTime = () => {
  return new Date().toTimeString().split(' ')[0];
};

export default function ServerLoader({ onAwake }) {
  const [displayedLogs, setDisplayedLogs] = useState([]);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
  const [isServerAwake, setIsServerAwake] = useState(false);
  const [isSequenceDone, setIsSequenceDone] = useState(false);
  
  const bottomRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // 1. Silent Backend Pinger
  useEffect(() => {
    let pingTimeout;
    let isMounted = true;

    const pingServer = async () => {
      try {
        await axios.get(`${API_URL}/api/ping`, { timeout: 3000 });
        if (isMounted) setIsServerAwake(true);
      } catch (err) {
        if (isMounted) pingTimeout = setTimeout(pingServer, 3000);
      }
    };
    
    pingServer();
    
    return () => {
      isMounted = false;
      clearTimeout(pingTimeout);
    };
  }, [API_URL]);

  // 2. Visual Animation
  useEffect(() => {
    let currentIndex = 0;
    
    setDisplayedLogs([]); 
    setIsSequenceDone(false);
    
    const sequenceInterval = setInterval(() => {
      if (currentIndex < bootSequence.length) {
        const nextText = bootSequence[currentIndex];
        
        setDisplayedLogs((prev) => [
          ...prev, 
          { time: getTime(), text: nextText }
        ]);
        
        setTimeout(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 50);
        
        currentIndex++;
      } else {
        clearInterval(sequenceInterval);
        setIsSequenceDone(true);
      }
    }, 1200);

    return () => clearInterval(sequenceInterval);
  }, []); 

  // 3. The Coordinator
  useEffect(() => {
    if (isSequenceDone && isServerAwake) {
      setDisplayedLogs((prev) => [
        ...prev, 
        { time: getTime(), text: "🚀 CONNECTION ESTABLISHED. LAUNCHING Application..." }
      ]);
      
      setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);

      setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => {
          onAwake();
        }, 1000); 
      }, 1000);
    }
  }, [isSequenceDone, isServerAwake, onAwake]);

  return (
    <div 
      className={`fixed inset-0 z-[1000] bg-[#0e1116] text-[#c9d1d9] font-mono text-xs md:text-sm overflow-hidden transition-opacity duration-1000 ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Grid */}
      <div 
        className="absolute top-0 right-0 w-full md:w-1/2 h-full pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #ffffff 1px, transparent 1px),
            linear-gradient(to bottom, #ffffff 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Top Left Branding */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-white/80 font-semibold tracking-wider z-10">
        <div className="w-3 h-3 rounded-full border-2 border-white/80 flex items-center justify-center">
            <div className="w-1 h-1 bg-white/80 rounded-full"></div>
        </div>
        <span>Portfolio</span>
      </div>

      {/* Main Terminal Output (Added 'hide-custom-scrollbar' class) */}
      <div className="absolute top-24 left-6 md:left-20 right-6 bottom-24 overflow-y-auto hide-custom-scrollbar flex flex-col items-start">
        <div className="flex flex-col gap-3 w-full max-w-4xl">
          {displayedLogs.map((log, index) => (
            <div key={index} className="flex gap-4 animate-fade-in w-full">
              <span className="text-[#8b949e] shrink-0">{log.time}</span>
              {log.text.includes("____") ? (
                <pre className="text-[#c9d1d9] leading-[1.1] text-[10px] md:text-xs overflow-x-auto hide-custom-scrollbar">
                  {log.text}
                </pre>
              ) : (
                <span className={`${log.text.includes("✅") ? "text-green-400 font-bold" : "text-[#c9d1d9] tracking-wide"}`}>
                  {log.text}
                </span>
              )}
            </div>
          ))}

          {isSequenceDone && !isServerAwake && (
            <div className="flex gap-4 items-center animate-fade-in mt-2 text-[#8b949e]">
              <span className="shrink-0">{getTime()}</span>
              <div className="flex items-center gap-3 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                <svg className="animate-spin h-4 w-4 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-white/70 tracking-wider text-xs">Application Loading ...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} className="h-10" />
        </div>
      </div>

      {/* Bottom Left Footer */}
      <div className="absolute bottom-6 left-6 text-[#8b949e] text-[10px] tracking-widest uppercase z-10">
        START BUILDING ON RENDER TODAY &gt;
      </div>

      {/* Bottom Right Footer */}
      <div className="absolute bottom-6 right-6 text-[#8b949e] text-[10px] tracking-widest uppercase z-10 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
        APPLICATION LOADING ...
      </div>

      {/* --- INJECTED CSS TO HIDE SCROLLBARS EVERYWHERE --- */}
      <style>{`
        .hide-custom-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-custom-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}