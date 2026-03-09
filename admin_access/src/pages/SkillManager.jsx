import { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaCode, FaLayerGroup } from "react-icons/fa";

// 1. Define the fixed order with numeric values
const CATEGORY_CONFIG = [
  { name: "Languages", order: 1 },
  { name: "Frameworks & Libraries", order: 2 },
  { name: "Tools & Platforms", order: 3 },
  { name: "Databases", order: 4 }
];

function SkillManager() {
  const [skills, setSkills] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ category: "Languages", items: "" });

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/skills");
      // Sort the list by the fixed order whenever data is fetched
      const sortedSkills = res.data.sort((a, b) => (a.order || 0) - (b.order || 0));
      setSkills(sortedSkills);
    } catch (err) { console.error("Fetch failed", err); }
  };

  useEffect(() => { fetchData(); }, []);

  const startEdit = (group) => {
    setEditingId(group._id);
    setFormData({
      category: group.category,
      items: group.items.map(i => i.name).join(', ')
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ category: "Languages", items: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Find the order value for the selected category
    const selectedConfig = CATEGORY_CONFIG.find(c => c.name === formData.category);

    // Parse the items safely, ignoring empty inputs if the user added an extra comma
    const newItemsParsed = formData.items
        .split(',')
        .map(name => name.trim())
        .filter(name => name !== "")
        .map(name => ({
            name: name,
            icon: "FaCode" 
        }));

    try {
      if (editingId) {
        // --- SCENARIO 1: We are explicitly EDITING an existing group ---
        // Replace the whole array with the newly edited string
        const payload = {
          category: formData.category,
          order: selectedConfig.order,
          items: newItemsParsed
        };
        await axios.put(`http://localhost:5000/api/skills/${editingId}`, payload);
        alert("Skills Updated Successfully!");

      } else {
        // --- SCENARIO 2: We are ADDING completely new skills ---
        // Check if this category already exists in our state
        const existingCategory = skills.find(s => s.category === formData.category);

        if (existingCategory) {
            // MERGE: Combine old items with the new ones you just typed
            const mergedItems = [...existingCategory.items, ...newItemsParsed];
            
            const payload = {
                category: existingCategory.category,
                order: selectedConfig.order,
                items: mergedItems
            };
            
            // Send an UPDATE to the existing ID instead of creating a duplicate
            await axios.put(`http://localhost:5000/api/skills/${existingCategory._id}`, payload);
            alert(`Added new skills to existing ${existingCategory.category} group!`);
        } else {
            // CREATE: The category does not exist at all, so we make a new one
            const payload = {
                category: formData.category,
                order: selectedConfig.order,
                items: newItemsParsed
            };
            await axios.post("http://localhost:5000/api/skills", payload);
            alert("New Skill Category Created!");
        }
      }

      cancelEdit(); // Reset the form
      fetchData();  // Pull the fresh data immediately
    } catch (err) { 
        alert("Action failed!"); 
        console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this entire skill group?")) {
      await axios.delete(`http://localhost:5000/api/skills/${id}`);
      fetchData();
    }
  };

  const inputClass = "w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white mb-3 outline-none focus:border-purple-500";

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-8">Technical Arsenal</h2>

      {/* FIXED CATEGORY FORM */}
      <form onSubmit={handleSubmit} className={`p-8 rounded-2xl border mb-12 shadow-xl transition-all ${editingId ? 'bg-purple-900/10 border-purple-500/50' : 'bg-white/5 border-white/5'}`}>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            {editingId ? <><FaEdit className="text-purple-400"/> Editing Group</> : <><FaPlus className="text-green-400"/> Add Skill Group</>}
        </h3>
        
        <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">Target Category</label>
        <select 
          className={inputClass} 
          value={formData.category} 
          onChange={e => setFormData({...formData, category: e.target.value})}
        >
          {CATEGORY_CONFIG.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
        </select>

        <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">Skill Items</label>
        <textarea 
          className={inputClass} 
          placeholder="Comma separated: React, Node.js, Tailwind" 
          rows="3"
          value={formData.items} 
          onChange={e => setFormData({...formData, items: e.target.value})} 
          required 
        />
        
        <div className="flex gap-2 mt-4">
            <button type="submit" className={`px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-all text-white ${editingId ? 'bg-blue-600 hover:bg-blue-500' : 'bg-purple-600 hover:bg-purple-500 hover:scale-105'}`}>
                {editingId ? <><FaSave /> Update Arsenal</> : <><FaPlus /> Add to Arsenal</>}
            </button>
            {editingId && <button type="button" onClick={cancelEdit} className="px-6 py-3 rounded-lg bg-white/5 text-white font-bold border border-white/10 hover:bg-white/10 transition-colors">Cancel</button>}
        </div>
      </form>

      {/* SPLIT MANAGEMENT LISTS (Sorted by Category Order) */}
      <div className="space-y-10">
        {CATEGORY_CONFIG.map(catConfig => {
            const groupData = skills.find(s => s.category === catConfig.name);
            return (
                <div key={catConfig.name} className="bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden">
                    <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex justify-between items-center">
                        <h3 className="font-bold text-gray-300 flex items-center gap-3">
                            <span className="text-purple-500 text-xs font-mono">{catConfig.order}.</span>
                            <FaLayerGroup className="text-purple-500 text-xs" /> {catConfig.name}
                        </h3>
                        {groupData && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full font-bold">{groupData.items.length} Items</span>}
                    </div>
                    
                    <div className="p-6">
                        {groupData ? (
                            <div className="flex justify-between items-center group">
                                <div className="flex flex-wrap gap-2 max-w-[80%]">
                                    {groupData.items.map((i, idx) => (
                                        <span key={idx} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-400">
                                            {i.name}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => startEdit(groupData)} className="p-2 text-gray-500 hover:text-blue-400 transition-colors"><FaEdit /></button>
                                    <button onClick={() => handleDelete(groupData._id)} className="p-2 text-gray-500 hover:text-red-500 transition-colors"><FaTrash /></button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-600 text-sm italic">No skills added to this category yet.</p>
                        )}
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
}

export default SkillManager;