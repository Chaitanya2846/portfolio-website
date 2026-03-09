import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaGraduationCap } from "react-icons/fa";

function EducationManager() {
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    institution: "", degree: "", duration: "", score: "", location: "", order: 1 
  });

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/education");
      setList(res.data.sort((a, b) => a.order - b.order));
    } catch (err) { console.error("Fetch failed", err); }
  };

  useEffect(() => { fetchItems(); }, []);

  const startEdit = (item) => {
    setEditingId(item._id);
    setFormData({ ...item });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ institution: "", degree: "", duration: "", score: "", location: "", order: 1 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/education/${editingId}`, formData);
        alert("Education Updated!");
      } else {
        await axios.post("http://localhost:5000/api/education", formData);
        alert("Education Added!");
      }
      cancelEdit();
      fetchItems();
    } catch (err) { alert("Action failed!"); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this entry?")) {
      await axios.delete(`http://localhost:5000/api/education/${id}`);
      fetchItems();
    }
  };

  const inputClass = "w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white mb-3 outline-none focus:border-purple-500";

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-8">Academic History</h2>

      <form onSubmit={handleSubmit} className={`p-8 rounded-2xl border mb-10 shadow-xl transition-all ${editingId ? 'bg-purple-900/10 border-purple-500/50' : 'bg-white/5 border-white/5'}`}>
        <h3 className="text-xl font-bold mb-4">{editingId ? "Edit Education" : "Add Education"}</h3>
        <input className={inputClass} placeholder="Institution (e.g., University Name)" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} required />
        <input className={inputClass} placeholder="Degree (e.g., B.Tech in CS)" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} required />
        
        <div className="grid grid-cols-2 gap-4">
          <input className={inputClass} placeholder="Duration (e.g., 2022 - 2026)" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} required />
          <input className={inputClass} placeholder="Score (e.g., CGPA: 9.0)" value={formData.score} onChange={e => setFormData({...formData, score: e.target.value})} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <input className={inputClass} placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          <input className={inputClass} type="number" placeholder="Order (1 = Top)" value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} required />
        </div>

        <div className="flex gap-2">
          <button type="submit" className={`px-8 py-3 rounded-lg font-bold flex items-center gap-2 ${editingId ? 'bg-blue-600' : 'bg-purple-600'}`}>
            {editingId ? <><FaSave /> Update</> : <><FaPlus /> Save</>}
          </button>
          {editingId && <button type="button" onClick={cancelEdit} className="px-6 py-3 rounded-lg bg-white/10">Cancel</button>}
        </div>
      </form>

      <div className="space-y-4">
        {list.map(item => (
          <div key={item._id} className="bg-white/5 p-5 rounded-xl border border-white/5 flex justify-between items-center group">
            <div className="flex items-center gap-4">
              <div className="text-2xl text-purple-500"><FaGraduationCap /></div>
              <div>
                <h4 className="font-bold text-white">{item.degree}</h4>
                <p className="text-xs text-gray-500">{item.institution} | {item.duration}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(item)} className="p-2 text-gray-500 hover:text-blue-400"><FaEdit /></button>
              <button onClick={() => handleDelete(item._id)} className="p-2 text-gray-500 hover:text-red-500"><FaTrash /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EducationManager;