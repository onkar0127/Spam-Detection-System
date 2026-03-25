import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("message");

  const handlePredict = async () => {
    if (!text) return;

    try {
      setLoading(true);
      const res = await axios.post(import.meta.env.VITE_API_URI, {
        text: text,
        type: type,
      });

      setResult(res.data.prediction);
    } catch (error) {
      setResult("Error");
    } finally {
      setLoading(false);
    }
  };

  const getColor = () => {
    if (result === "ham") return "text-green-600";
    if (result === "spam") return "text-red-600";
    if (result === "smishing") return "text-orange-500";
    return "text-gray-600";
  };

  const getBg = () => {
    if (result === "ham") return "bg-green-100";
    if (result === "spam") return "bg-red-100";
    if (result === "smishing") return "bg-orange-100";
    return "bg-gray-100";
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center px-4 bg-gradient-to-br from-neutral-800 via-rose-400 to-cyan-600">
     
      <div className="w-full max-w-md bg-[#FAF1E6] rounded-2xl shadow-3xl p-6 sm:p-8 text-center mx-auto">
        
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          📩 Spam Detector
        </h1>
        <p className="text-gray-500 mb-4 text-sm">
          Analyze messages & emails instantly
        </p>

       
        <div className="flex mb-4 bg-gray-100 rounded-xl overflow-hidden">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full mb-4 p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 mt-5 mb-4"
          >
            <option value="message">Message</option>
            <option value="email">Email</option>
          </select>
        </div>

      
        <textarea
          className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-sm sm:text-base transition mt-4"
          rows="4"
          placeholder={
            type === "message"
              ? "Type your message..."
              : "Paste your email content..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

     
        <button
          onClick={handlePredict}
          className="mt-4 w-full py-3 rounded-xl font-medium bg-indigo-500 text-white hover:bg-indigo-600 active:scale-95 transition-all"
        >
          {loading ? "Analyzing..." : `Analyze ${type}`}
        </button>

        
        {result && (
          <div
            className={`mt-6 p-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 ${getBg()} ${getColor()}`}
          >
            {result === "ham" && "✅ Safe Message"}
            {result === "spam" && "❌ Spam Detected"}
            {result === "smishing" && "⚠️ Fraud Alert"}
            {result === "Error" && "⚠️ Something went wrong"}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
