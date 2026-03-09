import { useEffect, useState, useRef } from "react";
import axios from "axios";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaGithub, FaExternalLinkAlt, FaFileContract, FaCode } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

// --- HELPER: Universal Logo Generator ---
const getUniversalLogo = (skillName) => {
  if (!skillName) return "";
  let slug = skillName.toLowerCase().trim();
  slug = slug.replace(/\+/g, 'plus').replace(/\#/g, 'sharp').replace(/\./g, 'dot').replace(/[^a-z0-9]/g, '');

  const aliases = {
    'java': 'openjdk', 'ccplusplus': 'cplusplus', 'htmlcss': 'html5', 'sql': 'mysql',
    'gitgithub': 'github', 'vscode': 'visualstudiocode', 'eclipse': 'eclipseide',
    'aws': 'amazonaws', 'gcp': 'googlecloud', 'html': 'html5', 'css': 'css3',
    'js': 'javascript', 'ts': 'typescript', 'reactjs': 'react', 'vuejs': 'vuedotjs',
    'node': 'nodedotjs', 'postgres': 'postgresql', 'sqlserver': 'microsoftsqlserver'
  };
  const finalSlug = aliases[slug] || slug;

  const darkLogos = ['openjdk', 'github', 'eclipseide', 'vercel', 'nextdotjs', 'express', 'githubactions'];
  return darkLogos.includes(finalSlug) 
    ? `https://cdn.simpleicons.org/${finalSlug}/white` 
    : `https://cdn.simpleicons.org/${finalSlug}`;
};

const getImageUrl = (url) => {
  if (!url) return "";
  return url.startsWith('/') ? `http://localhost:5000${url}` : url;
};

const HighlightText = ({ text }) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g); 
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <span key={i} className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-sm">
              {part.slice(2, -2)}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
};

function Projects() {
  const [projects, setProjects] = useState([]); 
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/projects");
        setProjects(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!loading && projects.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(headingRef.current, 
          { y: 40, opacity: 0 }, 
          {
            y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
            scrollTrigger: { trigger: headingRef.current, start: "top 85%", toggleActions: "play none none reverse" }
          }
        );

        gsap.utils.toArray(".project-card").forEach((card) => {
          gsap.fromTo(card, 
            { y: 60, opacity: 0, scale: 0.98 }, 
            {
              y: 0, opacity: 1, scale: 1, duration: 1.5, ease: "power4.out",
              scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" }
            }
          );
        });

        gsap.utils.toArray(".project-divider").forEach((divider) => {
          gsap.fromTo(divider, 
            { scaleX: 0, opacity: 0 }, 
            {
              scaleX: 1, opacity: 1, duration: 1.5, ease: "power4.out",
              scrollTrigger: { trigger: divider, start: "top 90%", toggleActions: "play none none reverse" }
            }
          );
        });

      }, containerRef);
      return () => ctx.revert();
    }
  }, [loading, projects]);

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">Loading Projects...</div>;

  return (
    <section id="projects" ref={containerRef} className="min-h-screen py-24 relative bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
      <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div ref={headingRef} className="text-center mb-20" style={{ willChange: "transform, opacity" }}>
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
            <span className="text-xs font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 uppercase">
              My Works
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Projects</span>
          </h2>
        </div>

        <div className="space-y-12">
          {projects.map((project, index) => {
            const isReversed = index % 2 === 1;
            const projectNumber = String(index + 1).padStart(2, '0');

            return (
              <div key={project._id} className="flex flex-col relative">
                <div 
                    style={{ willChange: "transform, opacity" }} 
                    className="project-card flex flex-col py-8 relative group"
                >
                    {/* ENHANCED WATERMARK NUMBER ABOVE IMAGE (0.08 Opacity) */}
                    <div className={`absolute -top-12 md:-top-20 ${isReversed ? "right-4" : "left-4"} text-[100px] md:text-[160px] font-black text-white/[0.08] leading-none z-0 pointer-events-none select-none tracking-tighter group-hover:text-purple-500/[0.15] transition-all duration-700`}>
                        {projectNumber}
                    </div>

                    {/* TITLE ROW */}
                    <div className={`flex flex-col lg:flex-row ${isReversed ? "lg:flex-row-reverse" : ""} gap-10 w-full mb-6 z-10`}>
                        <div className="hidden lg:block lg:flex-1" />
                        <div className="w-full lg:flex-1">
                            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                                {project.title}
                            </h3>
                        </div>
                    </div>

                    {/* CONTENT ROW */}
                    <div className={`flex flex-col lg:flex-row ${isReversed ? "lg:flex-row-reverse" : ""} gap-10 items-stretch w-full z-10`}>
                        
                        {/* IMAGE CONTAINER */}
                        <div className="w-full lg:flex-1 relative group/img">
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl opacity-20 blur-xl group-hover/img:opacity-40 transition duration-500"></div>
                            
                            <div className="relative h-full aspect-video lg:aspect-auto rounded-2xl overflow-hidden border border-white/10 bg-[#111] shadow-2xl">
                                <div className="absolute inset-0 bg-black/10 group-hover/img:bg-transparent transition-colors duration-500 z-10" />
                                <img 
                                    src={getImageUrl(project.image)} 
                                    alt={project.title} 
                                    className="w-full h-full object-cover object-top transform group-hover/img:scale-[1.02] transition-transform duration-700 ease-out"
                                />
                            </div>
                        </div>

                        {/* TEXT CONTAINER */}
                        <div className="w-full lg:flex-1 flex flex-col justify-center">
                            <p className="text-gray-300 font-light text-lg leading-relaxed mb-6 border-l-2 border-purple-500/50 pl-5">
                                <HighlightText text={project.description} />
                            </p>

                            <div className="flex flex-wrap gap-2.5 mb-8">
                                {project.techStack.map((tech, i) => (
                                    <span key={i} className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs font-medium text-gray-300 hover:text-white hover:bg-purple-500/10 hover:border-purple-500/40 transition-all duration-300 cursor-default">
                                        <span className="w-4 h-4 flex items-center justify-center relative">
                                            <img 
                                                src={getUniversalLogo(tech.name)} 
                                                alt={tech.name} 
                                                className="w-full h-full object-contain relative z-10"
                                                onError={(e) => { e.target.style.display = 'none'; e.target.nextElementSibling.style.display = 'block'; }}
                                            />
                                            <FaCode className="absolute inset-0 w-3 h-3 m-auto text-purple-400 hidden" />
                                        </span>
                                        {tech.name}
                                    </span>
                                ))}
                            </div>

                            <div>
                                <h4 className="text-[13px] font-black text-gray-500 uppercase tracking-[0.25em] mb-5">
                                    Key Features
                                </h4>
                                <ul className="space-y-3.5">
                                    {project.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-4">
                                            {/* THEME MATCHED BULLET POINT (Glowing Purple Dot) */}
                                            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5 shrink-0 opacity-90 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                                            <span className="text-white/90 text-[15px] font-medium leading-relaxed tracking-wide">
                                                <HighlightText text={feature} />
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* BUTTONS ROW */}
                    <div className={`flex flex-col lg:flex-row ${isReversed ? "lg:flex-row-reverse" : ""} gap-10 w-full mt-8 z-10`}>
                        <div className="hidden lg:block lg:flex-1" />
                        <div className="w-full lg:flex-1 flex flex-wrap gap-4">
                            {project.links?.live && project.links.live !== "#" && (
                                <a href={project.links.live} target="_blank" rel="noreferrer" 
                                   className="group flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:-translate-y-0.5 transition-all duration-300">
                                    <FaExternalLinkAlt className="group-hover:rotate-12 transition-transform" /> Live Demo
                                </a>
                            )}
                            {project.links?.github && (
                                <a href={project.links.github} target="_blank" rel="noreferrer" 
                                   className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.02] border border-white/10 text-gray-300 font-medium text-sm hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-300">
                                    <FaGithub size={18} /> Source Code
                                </a>
                            )}
                            {project.links?.docs && (
                                <a href={project.links.docs} target="_blank" rel="noreferrer" 
                                   className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.02] border border-white/10 text-gray-300 font-medium text-sm hover:bg-white/10 hover:border-white/30 hover:text-white transition-all duration-300">
                                    <FaFileContract /> Documentation
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {index !== projects.length - 1 && (
                  <div className="project-divider w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-10 transform origin-center" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Projects;