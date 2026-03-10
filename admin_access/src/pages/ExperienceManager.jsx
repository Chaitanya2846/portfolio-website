import { useState, useEffect } from "react";
import axios from "axios";
import { 
  FaPlus, FaTrash, FaEdit, FaSave, FaTimes, 
  FaBriefcase, FaUsers, FaUpload, FaFilePdf, FaMapMarkerAlt 
} from "react-icons/fa";

function ExperienceManager() {
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [certFile, setCertFile] = useState(null);

  const [formData, setFormData] = useState({ 
    role: "", company: "", image: "", link: "", 
    type: "internship", duration: "", description: "", 
    location: "On Campus", order: 1,
    roles: [] 
  });

  const [tempRole, setTempRole] = useState({ title: "", date: "", points: "" });

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/experience");
      setList(res.data.sort((a, b) => a.order - b.order));
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const internships = list.filter(item => item.type === "internship");
  const committees = list.filter(item => item.type === "committee");

  // --- INSTANT CLOUDINARY UPLOAD FOR LOGO ---
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    setUploading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/upload", data);
      // Cloudinary returns the full absolute URL directly
      setFormData({ ...formData, image: res.data.url });
      setUploading(false);
    } catch (err) {
      setUploading(false);
      alert("Failed to upload logo.");
    }
  };

  const addRoleToTimeline = () => {
    if (!tempRole.title || !tempRole.date) return alert("Title and Date are required");
    const newRole = {
      title: tempRole.title,
      date: tempRole.date,
      points: tempRole.points.split('.').map(p => p.trim()).filter(p => p !== "")
    };
    setFormData({ ...formData, roles: [...formData.roles, newRole] });
    setTempRole({ title: "", date: "", points: "" });
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setFormData({ 
        ...item, 
        roles: item.roles || [],
        image: item.image || "" // Ensures the current logo loads into the form
    });
    setCertFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCertFile(null);
    setFormData({ 
      role: "", company: "", image: "", link: "", 
      type: "internship", duration: "", description: "", 
      location: "On Campus", order: 1, roles: [] 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = new FormData();

    // Standard fields
    submitData.append("company", formData.company);
    submitData.append("type", formData.type);
    submitData.append("location", formData.location);
    submitData.append("order", formData.order);
    
    // Pass the image URL (from the instant upload or existing DB entry)
    submitData.append("image", formData.image); 
    
    // Internship specific
    submitData.append("role", formData.role || "");
    submitData.append("duration", formData.duration || "");
    submitData.append("description", formData.description || "");

    // Committee specific (Stringified for backend parsing)
    submitData.append("roles", JSON.stringify(formData.roles));

    // Handle Certificate File
    if (certFile) {
      submitData.append("certificate", certFile); 
    } else {
      submitData.append("link", formData.link || "");
    }

    try {
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (editingId) {
        await axios.put(`http://localhost:5000/api/experience/${editingId}`, submitData, config);
      } else {
        await axios.post("http://localhost:5000/api/experience", submitData, config);
      }
      alert("Successfully saved!");
      cancelEdit();
      fetchItems();
    } catch (err) {
      console.error(err);
      alert("Error saving experience. Check console.");
    }
  };

  const inputClass = "w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white mb-3 outline-none focus:border-purple-500 transition-colors";

  return (
    <div className="max-w-4xl mx-auto p-4 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">Professional History Manager</h2>

      <form onSubmit={handleSubmit} className={`p-8 rounded-2xl border mb-12 shadow-xl transition-all ${editingId ? 'bg-purple-900/10 border-purple-500/50' : 'bg-white/5 border-white/5'}`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            {editingId ? <><FaEdit className="text-purple-400"/> Editing Entry</> : <><FaPlus className="text-green-400"/> Create New Entry</>}
          </h3>
          {editingId && <button type="button" onClick={cancelEdit} className="text-gray-400 hover:text-white"><FaTimes/> Cancel</button>}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button type="button" onClick={() => setFormData({...formData, type: 'internship'})} className={`py-3 rounded-xl font-bold border transition-all ${formData.type === 'internship' ? 'bg-purple-600 border-purple-400 text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}>Internship</button>
          <button type="button" onClick={() => setFormData({...formData, type: 'committee'})} className={`py-3 rounded-xl font-bold border transition-all ${formData.type === 'committee' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}>Committee</button>
        </div>

        <input className={inputClass} placeholder="Company Name" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} required />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* --- ADDED LOGO PREVIEW & UPLOAD UI --- */}
          <div className="w-full">
              <label className="text-[10px] uppercase text-gray-500 font-bold mb-2 flex items-center gap-2 tracking-widest">
                 <FaUpload /> {uploading ? "Uploading Logo..." : "Logo Upload"}
              </label>
              <div className="flex gap-4 items-center">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className={`${inputClass} text-xs pt-2.5 flex-grow`}
                />
                {/* Visual feedback of current logo */}
                {formData.image && (
                  <div className="w-12 h-12 rounded-lg bg-[#0a0a0a] border border-white/10 shrink-0 overflow-hidden -mt-3 flex items-center justify-center p-1">
                    <img src={formData.image} className="w-full h-full object-contain" alt="preview" />
                  </div>
                )}
              </div>
          </div>

          <div>
             <label className="text-[10px] uppercase text-gray-500 font-bold mb-2 block tracking-widest">Display Order</label>
             <input type="number" className={inputClass} value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} />
          </div>
        </div>

        {formData.type === 'internship' ? (
          <>
            <input className={inputClass} placeholder="Role Name" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
            <input className={inputClass} placeholder="Duration" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
            <textarea className={inputClass} placeholder="Description (Full stops separate points)" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            
            <div className="mb-4">
                <label className="text-[10px] font-bold text-purple-400 uppercase mb-2 block flex items-center gap-2 tracking-widest"><FaFilePdf /> Upload Certificate</label>
                <input type="file" className={`${inputClass} text-xs pt-2.5`} onChange={(e) => setCertFile(e.target.files[0])} accept=".pdf,image/*" />
                {formData.link && !certFile && <p className="text-[10px] text-gray-500 italic mt-1">Current File Stored</p>}
            </div>
          </>
        ) : (
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 mb-4 shadow-inner">
            <h4 className="text-blue-400 font-bold mb-4 text-xs uppercase tracking-widest flex items-center gap-2">Timeline Role Builder</h4>
            <input className={inputClass} placeholder="Role Title" value={tempRole.title} onChange={e => setTempRole({...tempRole, title: e.target.value})} />
            <input className={inputClass} placeholder="Date Range" value={tempRole.date} onChange={e => setTempRole({...tempRole, date: e.target.value})} />
            <textarea className={inputClass} placeholder="Points (separated by . )" rows="3" value={tempRole.points} onChange={e => setTempRole({...tempRole, points: e.target.value})} />
            <button type="button" onClick={addRoleToTimeline} className="w-full py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg font-bold hover:bg-blue-500 hover:text-white transition-all">+ Add to Timeline</button>
            <div className="mt-4 space-y-2">
              {formData.roles.map((r, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-white/5">
                  <span className="text-sm text-gray-300">{r.title} ({r.date})</span>
                  <button type="button" onClick={() => setFormData({...formData, roles: formData.roles.filter((_, idx) => idx !== i)})} className="text-red-500 hover:text-red-400"><FaTrash size={12}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button type="submit" disabled={uploading} className="w-full py-4 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 transition-all shadow-xl">
          {editingId ? <><FaSave className="inline mr-2"/> Update Entry</> : <><FaPlus className="inline mr-2"/> Save Entry</>}
        </button>
      </form>

      {/* --- LIST VIEW --- */}
      {[ { label: "Internships", data: internships }, { label: "Committees", data: committees } ].map((sec) => (
        <div key={sec.label} className="mb-12">
          <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">{sec.label} ({sec.data.length})</h3>
          <div className="space-y-4">
            {sec.data.map(item => (
              <div key={item._id} className="bg-white/5 p-5 rounded-2xl border border-white/5 flex justify-between items-center group hover:bg-white/[0.08] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center border border-white/10 shrink-0">
                    {item.image ? <img src={item.image} className="w-full h-full object-contain p-1 opacity-70 group-hover:opacity-100" alt=""/> : <FaBriefcase className="text-gray-600"/>}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{item.company}</h4>
                    <p className="text-xs text-gray-500 flex items-center gap-1"><FaMapMarkerAlt size={10}/> {item.location}</p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => startEdit(item)} className="p-3 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all"><FaEdit size={18}/></button>
                  <button onClick={() => axios.delete(`http://localhost:5000/api/experience/${item._id}`).then(fetchItems)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><FaTrash size={16}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExperienceManager;