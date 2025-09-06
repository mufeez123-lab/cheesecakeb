import React, { useEffect, useState } from "react";
import axios from "axios";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/menu");
        setMenuItems(res.data);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setError("❌ Error fetching menu items");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-700">Loading menu...</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-yellow-50 px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {menuItems.map((item) => (
          <div
            key={item._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
              <p className="text-gray-600 mb-2">{item.description}</p>
              <p className="text-gray-800 font-bold mb-2">₹ {item.price}</p>
              <p
                className={`font-semibold ${
                  Number(item.stock) > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {Number(item.stock) > 0 ? `In Stock: ${item.stock}` : "Sold Out"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;
