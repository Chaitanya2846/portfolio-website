import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaTrophy, FaCertificate, FaEdit, FaSave, FaTimes, FaDatabase, FaUpload } from "react-icons/fa";

function AchievementManager() {
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({ 
    title: "", type: "win", competition: "", issuer: "", date: "", image: "", description: "", tags: "", location: "" 
  });

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/achievements");
      setList(res.data);
    } catch (err) { console.error("Error fetching:", err); }
  };

  useEffect(() => { fetchItems(); }, []);

  // INSTANT UPLOAD: Saves image to backend immediately and gets the URL
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    setUploading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/upload", data);
      // Ensure the URL is absolute so it never breaks in the admin panel
      const fullUrl = res.data.url.startsWith('http') ? res.data.url : `http://localhost:5000${res.data.url}`;
      setFormData({ ...formData, image: fullUrl });
      setUploading(false);
    } catch (err) {
      setUploading(false);
      alert("Failed to upload image.");
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      type: item.type || (item.competition ? "win" : "certification"),
      competition: item.competition || "",
      issuer: item.issuer || "",
      date: item.date,
      image: item.image || "",
      description: item.description || "",
      location: item.location || "",
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || ""
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ title: "", type: "win", competition: "", issuer: "", date: "", image: "", description: "", tags: "", location: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Security check to prevent the Mongoose "image is required" crash
    if (!formData.image) {
        return alert("Please wait for the image to upload or select an image.");
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("type", formData.type);
    submitData.append("competition", formData.competition);
    submitData.append("issuer", formData.issuer);
    submitData.append("date", formData.date);
    submitData.append("location", formData.location); 
    submitData.append("description", formData.type === "win" ? formData.description : "");
    submitData.append("tags", formData.tags);
    submitData.append("image", formData.image); 

    const config = { headers: { "Content-Type": "multipart/form-data" } };

    try {
        if (editingId) {
            await axios.put(`http://localhost:5000/api/achievements/${editingId}`, submitData, config);
            alert("Updated Successfully!");
        } else {
            await axios.post("http://localhost:5000/api/achievements", submitData, config);
            alert("Saved Successfully!");
        }
        cancelEdit();
        fetchItems();
    } catch (err) { 
        console.error(err);
        alert("Action failed! Check server console."); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this item?")) {
      await axios.delete(`http://localhost:5000/api/achievements/${id}`);
      fetchItems();
    }
  };

  const wins = list.filter(item => item.type === "win" || (item.competition && item.competition.trim() !== ""));
  const certifications = list.filter(item => item.type === "certification" || (!item.competition || item.competition.trim() === ""));

  const inputClass = "w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white mb-3 focus:border-purple-500 outline-none transition-all";

  return (
    <div className="max-w-5xl mx-auto p-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Achievement System</h2>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-gray-400">
            <FaDatabase className="text-purple-400" /> Total Entries: {list.length}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className={`p-8 rounded-2xl border mb-12 shadow-xl transition-all ${editingId ? 'bg-purple-900/10 border-purple-500/50' : 'bg-white/5 border-white/5'}`}>
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                {editingId ? <><FaEdit className="text-purple-400"/> Editing Achievement</> : <><FaPlus className="text-green-400"/> Create New Entry</>}
            </h3>
            {editingId && (
                <button type="button" onClick={cancelEdit} className="text-gray-400 hover:text-white flex items-center gap-1 text-sm"><FaTimes/> Cancel</button>
            )}
        </div>
        
        <select className={inputClass} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
            <option value="win">🏆 Win / Award</option>
            <option value="certification">📜 Certification</option>
        </select>

        <input className={inputClass} placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
        
        {formData.type === "win" ? (
            <input className={inputClass} placeholder="Competition Name" value={formData.competition} onChange={e => setFormData({...formData, competition: e.target.value})} required />
        ) : (
            <>
              <input className={inputClass} placeholder="Issuer (e.g., Coursera, Google)" value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} required />
              <input className={inputClass} placeholder="Tags (e.g., React, Python, Cloud)" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
            </>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className={inputClass} placeholder="Date (e.g., Feb 2026)" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
            
            <div className="w-full">
              <label className="text-[10px] uppercase text-gray-500 font-bold mb-2 flex items-center gap-2 tracking-widest">
                 <FaUpload /> {uploading ? "Uploading Image..." : "Achievement Image"}
              </label>
              <div className="flex gap-4 items-center">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className={`${inputClass} text-xs pt-2.5 flex-grow`}
                />
                {formData.image && (
                  <div className="w-12 h-12 rounded-lg bg-[#0a0a0a] border border-white/10 shrink-0 overflow-hidden -mt-3 flex items-center justify-center">
                    <img 
                        src={formData.image.startsWith('http') ? formData.image : `http://localhost:5000${formData.image}`} 
                        className="w-full h-full object-cover" 
                        alt="preview" 
                    />
                  </div>
                )}
              </div>
            </div>
        </div>
        
        {formData.type === "win" && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <input 
              className={inputClass} 
              placeholder="Location (e.g., Mumbai, Virtual)" 
              value={formData.location} 
              onChange={e => setFormData({...formData, location: e.target.value})} 
            />
            
            <label className="text-xs font-bold text-purple-400 mb-1 ml-1 block uppercase tracking-wider">Achievement Details</label>
            <textarea 
              className={`${inputClass} min-h-[100px] resize-none`} 
              placeholder="Describe the win, the project, or the impact..." 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})} 
              required 
            />
          </div>
        )}
        
        <button type="submit" disabled={uploading} className={`w-full py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg ${editingId ? 'bg-blue-600 hover:bg-blue-500' : 'bg-purple-600 hover:bg-purple-500'}`}>
            {editingId ? <><FaSave /> Save Changes</> : <><FaPlus /> Create Achievement</>}
        </button>
      </form>

      <SectionList title="Wins" icon={<FaTrophy className="text-yellow-500" />} data={wins} onEdit={startEdit} onDelete={handleDelete} />
      <SectionList title="Certifications" icon={<FaCertificate className="text-blue-400" />} data={certifications} onEdit={startEdit} onDelete={handleDelete} />
    </div>
  );
}

const SectionList = ({ title, icon, data, onEdit, onDelete }) => (
    <div className="mb-12">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">{icon} Existing {title} ({data.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.map(item => (
                <div key={item._id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center group hover:bg-white/[0.08] transition-all">
                    <div className="flex items-center gap-4 overflow-hidden">
                        {/* SAFE IMAGE RENDERER: Forces localhost:5000 if it's missing */}
                        <div className="w-12 h-12 rounded-lg bg-[#0a0a0a] border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                            {item.image ? (
                                <img 
                                    src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`} 
                                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" 
                                    alt=""
                                />
                            ) : (
                                <FaCertificate className="text-gray-600" />
                            )}
                        </div>
                        
                        <div className="truncate">
                            <h4 className="font-bold text-white text-sm truncate">{item.title}</h4>
                            <p className="text-[11px] text-gray-500 truncate">
                                {item.date} • {item.competition || item.issuer || "No Organization"} 
                                {item.location ? ` • ${item.location}` : ""}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                        <button onClick={() => onEdit(item)} className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"><FaEdit size={16}/></button>
                        <button onClick={() => onDelete(item._id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"><FaTrash size={14}/></button>
                    </div>
                </div>
            ))}
        </div>
        {data.length === 0 && <p className="text-gray-600 italic text-sm ml-2">No items added yet.</p>}
    </div>
);

export default AchievementManager;