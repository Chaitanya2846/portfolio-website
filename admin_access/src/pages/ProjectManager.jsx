import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaImage } from "react-icons/fa";

function ProjectManager() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null); // <-- NEW: State to hold the physical file
  const [formData, setFormData] = useState({ 
    title: "", description: "", image: "", techStack: "", features: "", 
    liveLink: "", githubLink: "", docsLink: "" 
  });

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const startEdit = (p) => {
    setEditingId(p._id);
    setImageFile(null); // Clear any pending file upload
    setFormData({
      title: p.title,
      description: p.description,
      image: p.image,
      techStack: p.techStack?.map(t => t.name).join(', ') || "",
      features: p.features?.join(', ') || "",
      liveLink: p.links?.live || "",
      githubLink: p.links?.github || "",
      docsLink: p.links?.docs || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setImageFile(null);
    setFormData({ title: "", description: "", image: "", techStack: "", features: "", liveLink: "", githubLink: "", docsLink: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let finalImageUrl = formData.image; // Default to existing image string

    // --- STEP 1: UPLOAD THE IMAGE FILE FIRST (IF ONE WAS SELECTED) ---
    if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("file", imageFile);

        try {
            const uploadRes = await axios.post("http://localhost:5000/api/upload", uploadData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            finalImageUrl = uploadRes.data.url; // e.g., "/uploads/1678...-image.png"
        } catch (err) {
            alert("Image upload failed! Please try again.");
            return; // Stop the save process if image upload fails
        }
    }

    // --- STEP 2: SAVE THE REST OF THE PROJECT DATA ---
    let payload = { 
        ...formData,
        image: finalImageUrl, // Attach the new local path (or keep the old one)
        techStack: formData.techStack?.split(',').map(n => ({ name: n.trim(), icon: "FaCode" })),
        features: formData.features?.split(','),
        links: { live: formData.liveLink, github: formData.githubLink, docs: formData.docsLink }
    };

    try {
        if (editingId) {
            await axios.put(`http://localhost:5000/api/projects/${editingId}`, payload);
            alert("Project Updated!");
        } else {
            if (!finalImageUrl) return alert("Please upload an image!"); // Failsafe for new projects
            await axios.post("http://localhost:5000/api/projects", payload);
            alert("Project Added!");
        }
        cancelEdit();
        fetchData();
    } catch (err) { alert("Action failed!"); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete Project?")) {
        await axios.delete(`http://localhost:5000/api/projects/${id}`);
        fetchData();
    }
  };

  // Helper to ensure local uploads render correctly by adding your backend URL
  const getImageUrl = (url) => {
    if (!url) return "";
    return url.startsWith('/') ? `http://localhost:5000${url}` : url;
  };

  const inputClass = "w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white mb-3 focus:border-purple-500 outline-none";

  return (
    <div className="animate-in fade-in duration-500">
      <form onSubmit={handleSubmit} className={`p-8 rounded-2xl border mb-10 shadow-xl transition-all ${editingId ? 'bg-purple-900/10 border-purple-500/50' : 'bg-white/5 border-white/5'}`}>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">{editingId ? "Edit Project" : "Add New Project"}</h3>
            {editingId && <button type="button" onClick={cancelEdit} className="text-gray-400 hover:text-white"><FaTimes/></button>}
        </div>
        
        <input className={inputClass} placeholder="Project Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
        <textarea className={inputClass} placeholder="Description" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
        
        {/* --- THE NEW IMAGE UPLOADER --- */}
        <div className="mb-4 bg-black/30 p-4 rounded-lg border border-white/10">
            <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 flex items-center gap-2 tracking-widest">
                <FaImage className="text-purple-400" /> Project Image
            </label>
            
            {/* Show a preview if editing an existing project */}
            {formData.image && !imageFile && (
                <div className="mb-3">
                    <img src={getImageUrl(formData.image)} alt="Current" className="h-20 rounded border border-white/10 opacity-80" />
                    <p className="text-xs text-gray-500 mt-1">Current image. Upload a new one to replace.</p>
                </div>
            )}

            <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30 transition-all cursor-pointer"
            />
        </div>

        <input className={inputClass} placeholder="Tech Stack (comma separated)" value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})} />
        <input className={inputClass} placeholder="Features (comma separated)" value={formData.features} onChange={e => setFormData({...formData, features: e.target.value})} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input className={inputClass} placeholder="Live Link" value={formData.liveLink} onChange={e => setFormData({...formData, liveLink: e.target.value})} />
            <input className={inputClass} placeholder="GitHub Link" value={formData.githubLink} onChange={e => setFormData({...formData, githubLink: e.target.value})} />
            <input className={inputClass} placeholder="Docs Link" value={formData.docsLink} onChange={e => setFormData({...formData, docsLink: e.target.value})} />
        </div>
        
        <button type="submit" className={`mt-4 px-6 py-3 rounded-lg font-bold flex items-center gap-2 ${editingId ? 'bg-blue-600 hover:bg-blue-500' : 'bg-purple-600 hover:bg-purple-500'}`}>
            {editingId ? <><FaSave /> Update Project</> : <><FaPlus /> Save Project</>}
        </button>
      </form>

      <div className="grid gap-4">
        {projects.map(p => (
          <div key={p._id} className="bg-white/5 p-5 rounded-xl border border-white/5 flex justify-between items-center group hover:bg-white/10 transition-colors">
            <div className="flex gap-4 items-center">
                <img src={getImageUrl(p.image)} className="w-20 h-14 object-cover rounded-lg border border-white/10" alt={p.title} />
                <h4 className="font-bold text-white text-lg">{p.title}</h4>
            </div>
            <div className="flex gap-2">
                <button onClick={() => startEdit(p)} className="p-3 text-gray-400 hover:text-blue-400 transition-colors"><FaEdit /></button>
                <button onClick={() => handleDelete(p._id)} className="p-3 text-gray-400 hover:text-red-500 transition-colors"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectManager;