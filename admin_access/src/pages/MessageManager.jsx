import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaInbox, FaReply, FaEnvelope, FaEnvelopeOpen } from "react-icons/fa";

function MessageManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/contact");
      
      // Failsafe check
      if (!Array.isArray(res.data)) {
        setLoading(false);
        return;
      }

      const sorted = res.data.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : 0;
        const dateB = b.createdAt ? new Date(b.createdAt) : 0;
        return dateB - dateA;
      });

      setMessages(sorted);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Permanently delete this message?")) {
      try {
        await axios.delete(`http://localhost:5000/api/contact/${id}`);
        fetchMessages();
      } catch (err) {
        alert("Failed to delete message");
      }
    }
  };

  const toggleStatus = async (msg) => {
    const newStatus = msg.status === "unread" ? "read" : "unread";
    try {
      await axios.put(`http://localhost:5000/api/contact/${msg._id}`, { ...msg, status: newStatus });
      fetchMessages(); 
    } catch (err) {
      console.error("Failed to update status");
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Date Unknown";
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return (
    <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-purple-500 animate-pulse font-bold tracking-widest uppercase flex items-center gap-3">
          <FaInbox className="animate-bounce" size={24} /> Syncing Inbox...
        </div>
    </div>
  );

  const unreadCount = messages.filter(m => m.status === "unread").length;

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      
      {/* INBOX HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4 bg-white/5 p-6 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500" />
        <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <FaInbox className="text-purple-500" /> Inquiry Inbox
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              You have <span className="text-purple-400 font-bold px-2 py-0.5 bg-purple-500/10 rounded-md">{unreadCount} unread</span> messages requiring your attention.
            </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-white">{messages.length}</div>
          <div className="text-xs text-gray-500 uppercase tracking-widest font-bold">Total</div>
        </div>
      </div>

      {/* MESSAGE LIST */}
      {messages.length === 0 ? (
        <div className="text-center py-24 bg-[#0a0a0a] rounded-[2rem] border border-dashed border-white/10 flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <FaInbox className="text-4xl text-gray-700" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">You're all caught up!</h3>
          <p className="text-gray-500 font-medium max-w-sm">When someone reaches out through your portfolio, their message will appear right here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => {
            const isUnread = msg.status === "unread";
            
            return (
              <div 
                key={msg._id} 
                className={`relative overflow-hidden transition-all duration-300 rounded-2xl group ${
                  isUnread 
                    ? "bg-[#0f0f13] border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.05)]" 
                    : "bg-[#0a0a0a] border border-white/5 opacity-80 hover:opacity-100"
                }`}
              >
                {/* Unread Accent Line */}
                {isUnread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />}

                <div className="p-6 md:p-8">
                  {/* SENDER INFO & META */}
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      {/* Letter Avatar */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black shrink-0 ${
                        isUnread ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-white/5 text-gray-500 border border-white/10"
                      }`}>
                        {msg.name.charAt(0).toUpperCase()}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className={`font-bold text-lg tracking-tight ${isUnread ? "text-white" : "text-gray-300"}`}>
                            {msg.name}
                          </h3>
                          {isUnread && <span className="bg-purple-600/20 text-purple-400 border border-purple-500/30 text-[9px] uppercase px-2 py-0.5 rounded-full font-bold tracking-widest">New</span>}
                        </div>
                        <p className="text-sm text-gray-500 font-medium">{msg.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
                        {formatDateTime(msg.createdAt)}
                      </span>
                      
                      {/* ACTION BUTTONS */}
                      <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <a 
                          href={`mailto:${msg.email}?subject=Re: ${msg.subject}`}
                          className="p-2.5 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                          title="Reply via Email"
                        >
                          <FaReply size={14} />
                        </a>
                        <button 
                          onClick={() => toggleStatus(msg)}
                          className={`p-2.5 rounded-lg transition-all ${isUnread ? "text-gray-400 hover:text-white hover:bg-white/10" : "text-purple-400 hover:bg-purple-400/10"}`}
                          title={isUnread ? "Mark as Read" : "Mark as Unread"}
                        >
                          {isUnread ? <FaEnvelopeOpen size={14} /> : <FaEnvelope size={14} />}
                        </button>
                        <button 
                          onClick={() => handleDelete(msg._id)}
                          className="p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* MESSAGE CONTENT */}
                  <div className="pl-0 md:pl-16">
                    <h4 className={`text-sm font-bold uppercase tracking-widest mb-3 ${isUnread ? "text-purple-400" : "text-gray-500"}`}>
                      {msg.subject}
                    </h4>
                    <div className="bg-black/40 border border-white/5 p-5 rounded-2xl text-gray-300 text-sm leading-relaxed font-medium whitespace-pre-wrap">
                      {msg.message}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MessageManager;