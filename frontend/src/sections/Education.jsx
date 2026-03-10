import { useEffect, useRef, useState } from "react";
import axios from "axios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaGraduationCap, FaMapMarkerAlt } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

function Education() {
  const [educationData, setEducationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const lineRef = useRef(null);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // 1. FETCH DYNAMIC DATA
  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/education`);
        const sortedData = res.data.sort((a, b) => a.order - b.order);
        setEducationData(sortedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching education:", err);
        setLoading(false);
      }
    };
    fetchEducation();
  }, []);

  // 2. OPTIMIZED GSAP ANIMATIONS
  useEffect(() => {
    if (loading || educationData.length === 0) return;

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        
        // Heading Animation
        gsap.fromTo(headingRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              once: true,
            },
          }
        );

        // Timeline Line (Scroll Scrubbed, but locks when finished)
        gsap.fromTo(lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none", 
            transformOrigin: "top",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 50%",    // Starts drawing halfway down the screen
              end: "bottom 85%",   // Finishes drawing near the bottom of the section
              scrub: 1.5,          // Lags 1.5 seconds behind your scroll for buttery smoothness
              onLeave: (st) => {
                // The magic trick: Once you reach the end, we disable the scroll-tracker
                st.disable();
                // And ensure the line smoothly finishes drawing to 100% and stays there forever
                gsap.to(lineRef.current, { scaleY: 1, duration: 1, ease: "power2.out" });
              }
            },
          }
        );

        // Grouped Row Animations (Dot + Card Timeline)
        gsap.utils.toArray(".edu-row").forEach((row, index) => {
          const dot = row.querySelector(".edu-dot");
          const card = row.querySelector(".edu-card");

          const tl = gsap.timeline({
            delay: index * 0.15, 
            scrollTrigger: {
              trigger: row,
              start: "top 85%", 
              once: true, // Cards pop in once and stay forever
            }
          });

          // 1. Dot pops in
          tl.fromTo(dot,
            { scale: 0, backgroundColor: "#1f2937" },
            {
              scale: 1,
              backgroundColor: "#a855f7",
              duration: 0.4,
              ease: "back.out(2)",
            }
          )
          // 2. Card glides in
          .fromTo(card,
            { autoAlpha: 0, y: 30, scale: 0.98 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
            },
            "-=0.2" 
          );
        });

      }, containerRef);

      return () => ctx.revert();
    }, 50);

    return () => clearTimeout(timer);
  }, [loading, educationData]);

  if (loading) return null;

  return (
    <section 
      id="education" 
      ref={containerRef} 
      className="min-h-screen py-24 relative bg-[#050505] overflow-hidden"
    >
      <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        <div ref={headingRef} className="mb-20 text-center md:text-left opacity-0">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
             <span className="text-xs font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 uppercase">
                Academic Journey
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
             My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Education</span>
          </h2>
        </div>

        <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-12">
          {/* THE LINE */}
          <div 
            ref={lineRef} 
            className="absolute top-0 left-[-1px] w-[3px] h-full bg-gradient-to-b from-purple-500 to-blue-500 shadow-[0_0_15px_rgba(168,85,247,0.6)] rounded-full z-0 origin-top" 
          />

          {educationData.map((item) => (
            <div key={item._id} className="edu-row relative pl-8 md:pl-16 group">
              
              {/* Dot initial state */}
              <span className="edu-dot absolute left-[-9px] top-6 w-[19px] h-[19px] rounded-full border-[3px] border-[#050505] z-10 shadow-[0_0_10px_rgba(168,85,247,0.4)] scale-0" />

              {/* Card initial state */}
              <div className="edu-card invisible opacity-0 will-change-transform relative p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] group-hover:-translate-y-1">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-purple-400">
                                <FaGraduationCap size={20} />
                             </div>
                             <span className="text-sm font-bold text-purple-400 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                                {item.duration}
                             </span>
                        </div>
                        <div className="text-gray-400 text-sm flex items-center gap-2">
                             <FaMapMarkerAlt /> {item.location}
                        </div>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">{item.institution}</h3>
                    
                    <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{item.degree}</p>
                    
                    <div className="mt-6 pt-4 border-t border-white/10">
                         <span className="text-white font-bold bg-white/10 px-4 py-2 rounded-lg border border-white/10 inline-block">
                            {item.score}
                         </span>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Education;