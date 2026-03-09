import { useRef, useEffect, useLayoutEffect } from "react"
import gsap from "gsap"

function Hero() {
  
  // --- FIX: Force Scroll to Top & Clean URL on Refresh ---
  useLayoutEffect(() => {
    // 1. Stop browser from restoring scroll position automatically
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // 2. Force scroll to top instantly
    window.scrollTo(0, 0);

    // 3. REMOVE THE HASH FROM URL (e.g., #education -> /)
    // This cleans the address bar without reloading the page
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [])
  // -----------------------------------------------------

  return (
    <section 
      id="home" 
      className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-[#050505]"
    >
      {/* --- BACKGROUND (UNCHANGED) --- */}
      <div className="absolute inset-0 bg-black pointer-events-none" />
      
      <ShyOrb 
        color="bg-purple-500" 
        size="w-[400px] h-[400px]" 
        initialX="15%" 
        initialY="20%" 
        blurAmount="blur-[100px]"
        opacity="opacity-40" 
      />
      <ShyOrb 
        color="bg-indigo-500" 
        size="w-[500px] h-[500px]" 
        initialX="85%" 
        initialY="15%" 
        delay={1.5}
        blurAmount="blur-[120px]"
        opacity="opacity-30"
      />
      <ShyOrb 
        color="bg-pink-500" 
        size="w-[350px] h-[350px]" 
        initialX="50%" 
        initialY="85%" 
        delay={3}
        blurAmount="blur-[90px]"
        opacity="opacity-30"
      />

      <div 
        className="absolute inset-0 opacity-[0.05] pointer-events-none z-[1]" 
        style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} 
      />

      {/* --- CONTENT --- */}
      <div className="text-center z-10 relative max-w-5xl mx-auto">
        
        {/* Status Badge */}
        <div className="inline-block mb-8 px-5 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.15)] transition-all hover:bg-emerald-500/10 cursor-default">
            <span className="flex items-center gap-2.5 text-xs font-bold tracking-[0.2em] text-emerald-300/90 uppercase">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Open to Opportunities
            </span>
        </div>

        {/* Name */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-white drop-shadow-2xl">
          Hi, I'm{" "}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-transparent bg-clip-text">
              Chaitanya Shirdhankar
            </span>
          </span>
        </h1>

        {/* Roles */}
        <h2 className="flex flex-wrap justify-center gap-3 md:gap-6 text-sm md:text-lg font-medium text-gray-400 mb-10 tracking-wide uppercase">
          <span className="text-gray-200">Full Stack Developer</span>
          <span className="text-purple-500">•</span>
          <span className="text-gray-200">Data Analyst</span>
          <span className="text-purple-500">•</span>
          <span className="text-gray-200">AI Enthusiast</span>
        </h2>

        {/* Tagline */}
        <p className="max-w-3xl mx-auto text-gray-400/90 mb-12 text-xl md:text-2xl leading-relaxed font-light">
          I build scalable web applications and AI-driven data systems that solve real-world problems using modern technologies.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <HeroButton 
            text="View My Work ->" 
            link="#projects" 
            isPrimary 
          />
          <HeroButton 
            text="Get In Touch" 
            link="#contact" 
          />
        </div>
      </div>
    </section>
  )
}

// --- SUB-COMPONENTS ---

function ShyOrb({ color, size, initialX, initialY, delay = 0, blurAmount, opacity }) {
  const floaterRef = useRef(null) 
  const orbRef = useRef(null)     

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(floaterRef.current, {
        x: "random(-50, 50)", 
        y: "random(-50, 50)", 
        duration: "random(8, 12)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: delay,
      })
      
      gsap.to(floaterRef.current, {
        rotation: "random(-180, 180)",
        duration: "random(20, 40)",
        repeat: -1,
        ease: "linear",
      })
    }, floaterRef)

    const handleMouseMove = (e) => {
      if (!floaterRef.current || !orbRef.current) return;
      const rect = floaterRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);
      const radius = 350; 

      if (distance < radius) {
        const force = (radius - distance) / radius;
        const moveX = -distX * force * 1.5;
        const moveY = -distY * force * 1.5;

        gsap.to(orbRef.current, {
          x: moveX, y: moveY, duration: 0.5, ease: "power2.out", overwrite: "auto"
        });
      } else {
        gsap.to(orbRef.current, {
          x: 0, y: 0, duration: 1.2, ease: "power2.out", overwrite: "auto"
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      ctx.revert();
    };
  }, [delay]);

  return (
    <div 
      ref={floaterRef} 
      className={`absolute top-0 left-0 pointer-events-none z-0 mix-blend-screen ${opacity}`} 
      style={{ left: initialX, top: initialY }}
    >
      <div 
        ref={orbRef}
        className={`${size} ${color} rounded-full ${blurAmount} transition-transform`}
      />
    </div>
  )
}

function HeroButton({ text, link, isPrimary }) {
  if (isPrimary) {
    return (
        <a
          href={link}
          className="
            relative group px-8 py-3.5 rounded-full font-bold text-black bg-white 
            transition-all duration-300 
            hover:scale-105 hover:shadow-[0_0_35px_rgba(255,255,255,0.5)] 
            active:scale-95
          "
        >
          <span className="relative z-10">{text}</span>
        </a>
      )
  }

  return (
    <a
      href={link}
      className="
        relative px-8 py-3.5 rounded-full font-medium text-white 
        border border-white/10 bg-white/5 backdrop-blur-md 
        transition-all duration-300 
        hover:bg-white/10 hover:border-white/40 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]
      "
    >
      {text}
    </a>
  )
}

export default Hero