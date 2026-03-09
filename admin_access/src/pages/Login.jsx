import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaLock } from "react-icons/fa";

function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { password });
      if (res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Incorrect password. Access denied.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="relative z-10 w-full max-w-md bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
        <div className="flex justify-center mb-6">
            <div className="p-4 bg-purple-500/10 rounded-full text-purple-500 text-3xl">
                <FaLock />
            </div>
        </div>
        <h2 className="text-3xl font-black text-white text-center mb-2">Restricted Area</h2>
        <p className="text-gray-400 text-center mb-8 text-sm">Please enter the master password.</p>
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}
        <form onSubmit={handleLogin} className="space-y-6">
          <input type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-purple-500 transition-colors text-center tracking-[0.2em]" required />
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02]">
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
export default Login;