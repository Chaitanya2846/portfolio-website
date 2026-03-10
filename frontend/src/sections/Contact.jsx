import { useState, useRef, useEffect } from "react"
import axios from "axios"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { FaGithub, FaLinkedin, FaEnvelope, FaPaperPlane, FaGem, FaRocket, FaLightbulb, FaCode, FaUser, FaAt, FaCommentAlt, FaCheckCircle } from "react-icons/fa"

gsap.registerPlugin(ScrollTrigger)

const taglineWords = [
  { text: "Legendary", icon: <FaGem /> },
  { text: "Scalable", icon: <FaRocket /> },
  { text: "Impactful", icon: <FaLightbulb /> },
  { text: "Robust", icon: <FaCode /> },
]
const displayWords = [...taglineWords, taglineWords[0]];

function Contact() {
  const formRef = useRef(null)
  const textRef = useRef(null)
  const rotatorRef = useRef(null)

  // ✅ 1. Added dynamic API URL fallback
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // 1. STATE FOR FORM DATA
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Portfolio Inquiry", 
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // 2. SMOOTH GSAP ANIMATIONS
  useEffect(() => {
    // Small timeout ensures the DOM is ready for GSAP calculations
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        
        // Text Section Glide In
        gsap.fromTo(textRef.current, 
          { y: 40, opacity: 0, scale: 0.98 },
          {
            y: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out",
            scrollTrigger: { trigger: textRef.current, start: "top 85%", once: true },
          }
        )
        
        // Form Section Glide In
        gsap.fromTo(formRef.current, 
          { x: 40, opacity: 0, scale: 0.98 },
          {
            x: 0, opacity: 1, scale: 1, duration: 1, delay: 0.2, ease: "power3.out",
            scrollTrigger: { trigger: formRef.current, start: "top 85%", once: true },
          }
        )

        // Word Rotator Animation
        const tl = gsap.timeline({ repeat: -1 });
        const step = 100 / displayWords.length; 
        displayWords.forEach((_, index) => {
            if (index === displayWords.length - 1) return;
            tl.to(rotatorRef.current, {
                yPercent: -(step * (index + 1)), 
                duration: 0.8, ease: "power4.inOut", delay: 1.5 
            });
        });
        tl.set(rotatorRef.current, { yPercent: 0 });
      })
      return () => ctx.revert()
    }, 50);
    return () => clearTimeout(timer);
  }, [])

  // 3. DYNAMIC SUBMIT HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // ✅ 2. Replaced localhost with dynamic API_URL
      await axios.post(`${API_URL}/api/contact`, formData);
      
      // Success State
      setIsSent(true);
      setFormData({ name: "", email: "", subject: "Portfolio Inquiry", message: "" });
      
      // FIX: Reset back to "Send Message" after exactly 3 seconds
      setTimeout(() => {
        setIsSent(false);
      }, 750); 

    } catch (err) {
      console.error("Message Error:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden bg-[#050505]">
      <div className="absolute inset-0 bg-black pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
      
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
        
        {/* TEXT CONTENT */}
        <div ref={textRef} className="space-y-8 text-center lg:text-left will-change-transform opacity-0">
            <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4">
                <span className="text-xs font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 uppercase">Get in touch</span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.15]">
                Let’s build something <br />
                <div className="h-[1.4em] overflow-hidden relative inline-block align-top">
                    <div ref={rotatorRef} className="flex flex-col">
                        {displayWords.map((item, idx) => (
                            <div key={idx} className="h-[1.4em] flex items-center gap-3 md:gap-4">
                                <span className="flex items-center justify-center w-[0.7em] h-[0.7em] text-[0.4em] text-purple-400">{item.icon}</span>
                                <span className="bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 text-transparent bg-clip-text pb-4">{item.text}.</span>
                            </div>
                        ))}
                    </div>
                </div>
            </h2>

            <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Have an idea, project, or collaboration in mind?<br/> I’d love to hear about it.
            </p>

            <div className="space-y-4 pt-4">
                <a href="mailto:chaitanyashirdhankar284@gmail.com" className="flex items-center justify-center lg:justify-start gap-4 text-xl font-medium text-gray-300 hover:text-white transition-colors group">
                    <span className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all duration-300">
                        <FaEnvelope className="text-purple-400" />
                    </span>
                    chaitanyashirdhankar284@gmail.com
                </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-6 pt-6">
                <SocialBtn icon={<FaGithub />} link="https://github.com/Chaitanya2846" />
                <SocialBtn icon={<FaLinkedin />} link="https://linkedin.com/in/chaitanya-shirdhankar-39594b318" />
            </div>
        </div>

        {/* FORM CONTENT */}
        <div ref={formRef} className="w-full max-w-lg mx-auto relative will-change-transform opacity-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-[2rem] opacity-30 blur-2xl pointer-events-none" />
            
            <form onSubmit={handleSubmit} className="relative bg-[#0a0a0a] border border-white/10 p-6 md:p-8 rounded-[1.5rem] shadow-2xl overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

                <div className="space-y-6 relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">Send me a message</h3>
                    
                    <div className="grid gap-4">
                        <InputGroup label="Your Name" name="name" placeholder="Enter your name" type="text" icon={<FaUser />} value={formData.name} onChange={handleChange} required />
                        <InputGroup label="Your Email" name="email" placeholder="abc@example.com" type="email" icon={<FaAt />} value={formData.email} onChange={handleChange} required />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-400 ml-1 flex items-center gap-2">
                             <FaCommentAlt className="text-purple-500 text-xs" /> Message
                        </label>
                        <textarea 
                            name="message"
                            rows="4"
                            required
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Type here..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 resize-none text-sm"
                        ></textarea>
                    </div>

                    {/* UPDATED SUBMIT BUTTON */}
                    <button 
                        type="submit"
                        disabled={isSubmitting || isSent} // Disabled while sending OR showing success
                        className={`w-full group relative px-6 py-3.5 rounded-xl font-bold text-white overflow-hidden transition-all duration-300 ${isSent ? 'bg-green-600 border-transparent' : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-[0_0_40px_rgba(139,92,246,0.4)] hover:scale-[1.02]'} disabled:opacity-75 disabled:hover:scale-100 disabled:cursor-not-allowed`}
                    >
                        {!isSent && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />}
                        <span className="relative flex items-center justify-center gap-3 text-base">
                            {isSubmitting ? "Sending..." : isSent ? <><FaCheckCircle className="animate-bounce" /> Message Sent!</> : <>{'Send Message'} <FaPaperPlane className="text-xs group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" /></>}
                        </span>
                    </button>
                </div>
            </form>
        </div>
      </div>
    </section>
  )
}

function InputGroup({ label, name, placeholder, type, required, icon, value, onChange }) {
    return (
        <div className="space-y-1.5 group">
            <label className="text-sm font-semibold text-gray-400 ml-1 flex items-center gap-2 transition-colors group-focus-within:text-purple-400">
                {icon && <span className="text-purple-500 text-xs">{icon}</span>}
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <input 
                    name={name}
                    type={type} 
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-sm"
                />
            </div>
        </div>
    )
}

function SocialBtn({ icon, link }) {
    return (
        <a href={link} target="_blank" rel="noopener noreferrer" className="p-4 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/30 hover:scale-110 transition-all duration-300">
            <span className="text-xl">{icon}</span>
        </a>
    )
}

export default Contact;