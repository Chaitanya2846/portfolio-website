import { useState, useEffect } from "react";
import axios from "axios";
// FIXED: Added FaSave to the import list below!
import { FaFilePdf, FaCloudUploadAlt, FaCheckCircle, FaExternalLinkAlt, FaSave } from "react-icons/fa";

function ResumeManager() {
  const [profile, setProfile] = useState({ name: "Chaitanya Shirdhankar", resumeUrl: "" });
  const [uploading, setUploading] = useState(false);
  const [isSaved, setIsSaved] = useState(true);

  // Fetch existing profile data on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/profile");
        if (res.data.length > 0) {
          setProfile(res.data[0]);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);
    setUploading(true);

    try {
      // Hits your existing Cloudinary upload route
      const res = await axios.post("http://localhost:5000/api/upload", data);
      setProfile({ ...profile, resumeUrl: res.data.url });
      setIsSaved(false); // Mark as unsaved so user clicks "Update Database"
      setUploading(false);
    } catch (err) {
      setUploading(false);
      alert("Upload failed. Check Cloudinary settings.");
    }
  };

  const handleSaveToDb = async () => {
    try {
      if (profile._id) {
        await axios.put(`http://localhost:5000/api/profile/${profile._id}`, profile);
      } else {
        await axios.post("http://localhost:5000/api/profile", profile);
      }
      setIsSaved(true);
      alert("Database updated successfully!");
    } catch (err) {
      alert("Error saving to database.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
        <FaFilePdf className="text-red-500" /> Resume Configuration
      </h2>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
        {/* Upload Area */}
        <div className="mb-10">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-4">
            Step 1: Upload PDF to Cloudinary
          </label>
          <div className="relative group">
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handlePdfUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all ${uploading ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-white/10 group-hover:border-purple-500/50 group-hover:bg-purple-500/5'}`}>
              <FaCloudUploadAlt size={40} className={uploading ? "text-yellow-500 animate-bounce" : "text-gray-600 group-hover:text-purple-400"} />
              <p className="mt-4 text-sm font-medium text-gray-400">
                {uploading ? "Uploading to Cloud..." : "Click or drag to replace Resume PDF"}
              </p>
            </div>
          </div>
        </div>

        {/* Preview & Status */}
        {profile.resumeUrl && (
          <div className="mb-10 p-5 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center text-red-500">
                <FaFilePdf size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Current Linked Resume</p>
                <p className="text-[10px] text-gray-500 truncate max-w-[200px]">{profile.resumeUrl}</p>
              </div>
            </div>
            <a 
              href={profile.resumeUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold text-white flex items-center gap-2 transition-all"
            >
              PREVIEW <FaExternalLinkAlt />
            </a>
          </div>
        )}

        {/* Save Button */}
        <button 
          onClick={handleSaveToDb}
          disabled={uploading || isSaved}
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl ${isSaved ? 'bg-green-500/20 text-green-500 cursor-default' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
        >
          {isSaved ? <><FaCheckCircle /> Saved to Database</> : <><FaSave /> Update Database Link</>}
        </button>
      </div>
    </div>
  );
}

export default ResumeManager;