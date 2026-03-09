import { FaNodeJs, FaReact, FaHtml5, FaJs, FaDatabase, FaVideo, FaRobot, FaServer } from "react-icons/fa";

export const projectsData = [
  {
    id: 1,
    title: "Opinion Trade",
    // Replace with your actual screenshot
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000", 
    description: "A gamified poll-based platform that turns user opinions into actionable business insights through a rewarding ecosystem.",
    techStack: [
      { name: "Node.js", icon: <FaNodeJs className="text-green-500" /> },
      { name: "MongoDB", icon: <FaDatabase className="text-green-400" /> },
      { name: "Handlebars", icon: <FaHtml5 className="text-orange-500" /> },
      { name: "JavaScript", icon: <FaJs className="text-yellow-400" /> },
    ],
    features: [
      "Scaled to 1000+ active users with a referral system.",
      "Analyzing 100+ user responses monthly for insights.",
      "Deployed on Render with 99.9% uptime reliability.",
      "Copyright registered under IP India."
    ],
    links: {
      live: "https://opinion-trade-demo.com",
      github: "https://github.com/Chaitanya2846/opinion-trade",
      docs: "/copyright-doc.pdf"
    }
  },
  {
    id: 2,
    title: "GovGenie",
    // Replace with your actual screenshot
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000",
    description: "An AI-powered bridge connecting citizens with verified government agents for secure and efficient document services.",
    techStack: [
      { name: "React (Vite)", icon: <FaReact className="text-blue-400" /> },
      { name: "OpenCV", icon: <FaRobot className="text-purple-400" /> },
      { name: "Socket.io", icon: <FaServer className="text-white" /> },
      { name: "ZegoCloud", icon: <FaVideo className="text-blue-500" /> },
    ],
    features: [
      "Connects 200+ users with verified agents instantly.",
      "Reduced fraud risk by 90% via AI document checks.",
      "Cut agent search time by 40% with smart filters.",
      "Real-time video consultation integration."
    ],
    links: {
      live: "#",
      github: "https://github.com/Chaitanya2846/gov-genie",
      docs: null
    }
  }
];