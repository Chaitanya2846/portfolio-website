// src/data/skills.jsx
import { 
  FaPython, FaJava, FaReact, FaHtml5, FaCss3Alt, FaJs, FaGitAlt, FaGithub 
} from "react-icons/fa";
import { 
  SiCplusplus, SiMysql, SiMongodb, SiEclipseide, SiTailwindcss 
} from "react-icons/si";
import { TbSql } from "react-icons/tb";
import { VscVscode } from "react-icons/vsc"; // <--- FIXED: Using VscVscode instead

export const skillsData = [
  {
    category: "Languages",
    skills: [
      { name: "Python", icon: <FaPython className="text-yellow-400" /> },
      { name: "C/C++", icon: <SiCplusplus className="text-blue-500" /> },
      { name: "SQL", icon: <TbSql className="text-orange-400" /> },
      { name: "JavaScript", icon: <FaJs className="text-yellow-300" /> },
      { name: "HTML/CSS", icon: <FaHtml5 className="text-orange-500" /> },
      { name: "Java", icon: <FaJava className="text-red-500" /> },
    ],
  },
  {
    category: "Frameworks & Libraries",
    skills: [
      { name: "React", icon: <FaReact className="text-cyan-400" /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss className="text-teal-400" /> },
    ],
  },
  {
    category: "Tools & Platforms",
    skills: [
      { name: "Git & GitHub", icon: <FaGitAlt className="text-orange-600" /> },
      { name: "VS Code", icon: <VscVscode className="text-blue-400" /> }, // Fixed Icon
      { name: "Eclipse", icon: <SiEclipseide className="text-indigo-500" /> },
    ],
  },
  {
    category: "Databases",
    skills: [
      { name: "MySQL", icon: <SiMysql className="text-blue-300" /> },
      { name: "MongoDB", icon: <SiMongodb className="text-green-500" /> },
    ],
  },
];