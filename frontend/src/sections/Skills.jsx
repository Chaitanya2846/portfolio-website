import { useEffect, useRef, useState } from "react";
import axios from "axios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaCode } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

// 1. Define the strict visual order
const CATEGORY_ORDER = [
  "Languages",
  "Frameworks & Libraries",
  "Tools & Platforms",
  "Databases"
];

function Skills() {
  const [skillsData, setSkillsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);

  // --- DYNAMIC LOGO GENERATOR ---
  const getUniversalLogo = (skillName) => {
    if (!skillName) return "";

    let slug = skillName.toLowerCase().trim();

    // 1. Handle coding language symbols
    slug = slug.replace(/\+/g, 'plus'); 
    slug = slug.replace(/\#/g, 'sharp'); 
    slug = slug.replace(/\./g, 'dot');   

    // 2. Strip out all spaces, slashes, and ampersands
    slug = slug.replace(/[^a-z0-9]/g, '');

    // 3. The Super Dictionary for Edge Cases & Custom Groupings
    const aliases = {
      'java': 'openjdk',
      'ccplusplus': 'cplusplus',
      'htmlcss': 'html5',
      'sql': 'mysql',
      'gitgithub': 'github',
      'vscode': 'visualstudiocode',
      'eclipse': 'eclipseide',
      'aws': 'amazonaws',
      'gcp': 'googlecloud',
      'html': 'html5',
      'css': 'css3',
      'js': 'javascript',
      'ts': 'typescript',
      'reactjs': 'react',
      'vuejs': 'vuedotjs',
      'node': 'nodedotjs',
      'postgres': 'postgresql',
      'sqlserver': 'microsoftsqlserver'
    };

    const finalSlug = aliases[slug] || slug;

    // 4. --- THE DARK MODE FIX ---
    const darkLogos = [
        'openjdk',     
        'github',      
        'eclipseide',  
        'vercel',      
        'nextdotjs',   
        'express',     
        'githubactions'
    ];

    if (darkLogos.includes(finalSlug)) {
        return `https://cdn.simpleicons.org/${finalSlug}/white`;
    }

    return `https://cdn.simpleicons.org/${finalSlug}`;
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/skills");
        
        // Sort the incoming data based on CATEGORY_ORDER
        const sortedData = res.data.sort((a, b) => 
          CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
        );

        setSkillsData(sortedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching skills:", err);
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  // --- OPTIMIZED GSAP ANIMATION ---
  useEffect(() => {
    if (loading || skillsData.length === 0) return;

    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        
        // Heading Animation
        gsap.fromTo(headingRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1, 
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );

        // Ultimate Smooth Card Glide Animation
        const cards = gsap.utils.toArray(".skill-card");
        
        gsap.fromTo(cards,
          // Start slightly closer and barely scaled down for maximum smoothness
          { autoAlpha: 0, y: 40, scale: 0.98 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9, // Stretched duration for a luxurious glide
            stagger: 0.1,  // Tighter stagger makes it look like a fluid wave
            ease: "power3.out", // The gold-standard curve for buttery UI transitions
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 85%",
              toggleActions: "play none none none" 
            }
          }
        );

      }, containerRef);

      return () => ctx.revert();
    }, 50);

    return () => clearTimeout(timer);
  }, [loading, skillsData]);

  if (loading) {
    return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-bold tracking-widest uppercase">Loading Arsenal...</div>;
  }

  return (
    <section id="skills" ref={containerRef} className="min-h-screen pt-32 pb-24 relative bg-[#050505] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        
        {/* HEADING */}
        <div ref={headingRef} className="mb-16 md:mb-20 text-center md:text-left opacity-0">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
            <span className="text-xs font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 uppercase">
              My Arsenal
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Skills</span>
          </h2>
        </div>

        {/* SKILLS GRID */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          {skillsData.map((category) => (
            <div 
              key={category._id} 
              // Added will-change-transform to force GPU acceleration
              className="skill-card invisible opacity-0 will-change-transform group relative p-8 rounded-[2rem] bg-[#0a0a0a] border border-white/10 overflow-hidden hover:border-white/20 transition-colors duration-500 h-full"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              
              <h3 className="text-xl font-bold text-white mb-8 relative z-10 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
                {category.category}
              </h3>

              <div className="space-y-4 relative z-10">
                {category.items.map((skill, sIdx) => (
                  <div key={sIdx} className="group/item flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                    
                    <span className="relative w-10 h-10 p-2 rounded-xl bg-black/50 border border-white/5 flex items-center justify-center shrink-0 overflow-hidden group-hover/item:scale-110 transition-transform duration-300">
                      <img 
                        src={getUniversalLogo(skill.name)} 
                        alt={skill.name} 
                        className="w-full h-full object-contain relative z-10"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'block'; 
                        }}
                      />
                      <FaCode className="absolute inset-0 w-5 h-5 m-auto text-purple-400 hidden" />
                    </span>

                    <span className="text-gray-400 font-medium text-sm tracking-wide group-hover/item:text-white transition-colors duration-300">
                      {skill.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;