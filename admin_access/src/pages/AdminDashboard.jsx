import { useState } from "react";
import { 
  FaProjectDiagram, FaCode, FaBriefcase, 
  FaGraduationCap, FaTrophy, FaEnvelope, FaSignOutAlt 
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Logic File Imports
import ProjectManager from "./ProjectManager";
import AchievementManager from "./AchievementManager";
import SkillManager from "./SkillManager";
import EducationManager from "./EducationManager";
import ExperienceManager from "./ExperienceManager";
import MessageManager from "./MessageManager";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("projects");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden font-sans">
      {/* SIDEBAR */}
      <div className="w-64 bg-[#0a0a0a] border-r border-white/5 p-6 flex flex-col gap-2 h-full z-10 shadow-2xl">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8 tracking-tight">
          Admin Panel
        </h1>
        <SidebarBtn icon={<FaCode />} label="Skills" id="skills" active={activeTab} set={setActiveTab} />
        <SidebarBtn icon={<FaProjectDiagram />} label="Projects" id="projects" active={activeTab} set={setActiveTab} />
        <SidebarBtn icon={<FaBriefcase />} label="Experience" id="experience" active={activeTab} set={setActiveTab} />
        <SidebarBtn icon={<FaGraduationCap />} label="Education" id="education" active={activeTab} set={setActiveTab} />
        <SidebarBtn icon={<FaTrophy />} label="Achievements" id="achievements" active={activeTab} set={setActiveTab} />
        <SidebarBtn icon={<FaEnvelope />} label="Messages" id="contact" active={activeTab} set={setActiveTab} />
        
        <button 
          onClick={handleLogout} 
          className="mt-auto flex items-center justify-center gap-3 px-4 py-3 text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-xl font-bold transition-all"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-10 overflow-y-auto relative">
        {/* Subtle background glow for the main area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-[400px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          {activeTab === "skills" && <SkillManager />}
          {activeTab === "projects" && <ProjectManager />}
          {activeTab === "experience" && <ExperienceManager />}
          {activeTab === "education" && <EducationManager />}
          {activeTab === "achievements" && <AchievementManager />}
          {activeTab === "contact" && <MessageManager />}
        </div>
      </div>
    </div>
  );
}

const SidebarBtn = ({ icon, label, id, active, set }) => (
  <button 
    onClick={() => set(id)} 
    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all w-full text-left ${
      active === id 
        ? "bg-purple-600/20 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)] scale-[1.02]" 
        : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
    }`}
  >
    {icon} {label}
  </button>
);

export default AdminDashboard;