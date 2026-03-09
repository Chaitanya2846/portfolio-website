const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import your models
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Experience = require('./models/Experience');
const Education = require('./models/Education');
const Achievement = require('./models/Achievement');

// Load environment variables from .env file
dotenv.config();

// --- 1. PORTFOLIO DATA ---

const projects = [
  {
    title: "Opinion Trade",
    description: "Built a scalable poll-based opinion platform for 1000+ users featuring a gamified reward and referral system. Enabled insight-driven decision-making for businesses by analyzing 100+ user responses monthly.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000",
    techStack: [
      { name: "Node.js", icon: "FaNodeJs" },
      { name: "MongoDB", icon: "FaDatabase" },
      { name: "Handlebars", icon: "FaHtml5" },
      { name: "JavaScript", icon: "FaJs" }
    ],
    features: [
      "Gamified reward & referral system for 1000+ users.",
      "Real-time analytics dashboard for businesses.",
      "Deployed on Render with 99.9% uptime.",
      "Copyright registered under IP India."
    ],
    links: { 
      live: "https://opinion-trade-demo.com", 
      github: "https://github.com/Chaitanya2846/opinion-trade", 
      docs: "/OpinionTradeCopyRight_page-0001.jpg" 
    }
  },
  {
    title: "GovGenie",
    description: "Created an AI-powered platform to connect 200+ citizens with verified government agents. Simplified document access and integrated robust security with document verification.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1000",
    techStack: [
      { name: "React", icon: "FaReact" },
      { name: "OpenCV", icon: "FaRobot" },
      { name: "Socket.io", icon: "FaServer" },
      { name: "ZegoCloud", icon: "FaVideo" }
    ],
    features: [
      "AI Document Verification using OpenCV.",
      "Real-time video consultation via ZegoCloud.",
      "Reduced fraud risk by 90% via secure verification.",
      "Smart filters reducing agent search time by ~40%."
    ],
    links: { 
      live: "#", 
      github: "https://github.com/Chaitanya2846/gov-genie", 
      docs: "" 
    }
  }
];

const skills = [
  {
    category: "Languages",
    order: 1,
    items: [
      { name: "Python", icon: "FaPython" },
      { name: "JavaScript", icon: "FaJs" },
      { name: "Java", icon: "FaJava" },
      { name: "C/C++", icon: "FaCode" },
      { name: "HTML/CSS", icon: "FaHtml5" },
      { name: "SQL", icon: "FaDatabase" }
    ]
  },
  {
    category: "Frameworks & Tools",
    order: 2,
    items: [
      { name: "React", icon: "FaReact" },
      { name: "Node.js", icon: "FaNodeJs" },
      { name: "MongoDB", icon: "FaDatabase" },
      { name: "MySQL", icon: "FaDatabase" },
      { name: "Git/GitHub", icon: "FaGithub" },
      { name: "VS Code", icon: "FaCode" },
      { name: "Eclipse", icon: "FaCode" }
    ]
  }
];

const experience = [
  {
    role: "Web Development Intern",
    company: "TECH OCTANET SERVICES PVT LTD",
    duration: "Jan 2025 - Feb 2025",
    location: "Mumbai, Maharashtra",
    description: [
      "Built a fully responsive landing page from scratch using HTML, CSS, and JavaScript, optimized for 5+ device types.",
      "Optimized layout and styling to reduce page load time by 30%, enhancing performance and user experience.",
      "Leveraged Git to manage 20+ code commits, ensuring clean version control and delivering modular, maintainable code."
    ]
  }
];

const education = [
  {
    institution: "Vidyavardhini's College of Engineering And Technology",
    degree: "Bachelor of Engineering in Computer Engineering",
    duration: "2023 - Present",
    score: "Pursuing",
    location: "Mumbai, Maharashtra"
  },
  {
    institution: "B.K.S Jr College",
    degree: "Higher Secondary Certificate (Science)",
    duration: "2021 - 2023",
    score: "85%",
    location: "Mumbai, Maharashtra"
  }
];

const achievements = [
  {
    title: "1st Place Winner",
    competition: "VCET National Level Project Showcase",
    date: "2024",
    description: "Secured the top position competing against national level teams with our innovative project solution.",
    image: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Runner-Up",
    competition: "OSCILLATION – Technical Paper Presentation",
    date: "2023",
    description: "Recognized for excellence in technical research and presentation skills on emerging tech topics.",
    image: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=1000"
  },
  {
    title: "Copyright Certificate",
    competition: "Government of India",
    date: "Jul 2025",
    description: "Copyright-registered project demonstrating innovation in user engagement for 'Opinion Trade'.",
    image: "/OpinionTradeCopyRight_page-0001.jpg"
  }
];

// --- 2. SEEDING FUNCTION ---

const seedDB = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas for Seeding!");

    // Clear existing data to prevent duplicates when running multiple times
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({});
    await Education.deleteMany({});
    await Achievement.deleteMany({});
    console.log("🗑️ Cleared old database records.");

    // Insert the fresh data
    await Project.insertMany(projects);
    await Skill.insertMany(skills);
    await Experience.insertMany(experience);
    await Education.insertMany(education);
    await Achievement.insertMany(achievements);
    
    console.log("🌱 Database Seeded Successfully with your Resume Data!");
    
    // Exit the script once done
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding the database:", err);
    process.exit(1);
  }
};

// Execute the function
seedDB();