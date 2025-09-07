import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./components/Admin.jsx";
import Menu from "./pages/Menu.jsx";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Show loader for 2.5 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-white"
        style={{
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        <img
          src="/giphy.gif"
          alt="Loading..."
          className="w-70 h-70 object-contain"
        />

        {/* Inline fade-in animation */}
        <style>
          {`
            @keyframes fadeIn {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
