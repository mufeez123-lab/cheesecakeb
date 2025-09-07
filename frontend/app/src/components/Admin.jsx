import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminMenuUpload = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));

    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/menu");
      setMenuItems(res.data);
    } catch (err) {
      console.error("Error fetching menu items:", err);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("stock", formData.stock || 0);
      if (formData.image) data.append("image", formData.image);

      if (editId) {
        await axios.put(`http://localhost:5000/api/menu/${editId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("✅ Item updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/menu", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("✅ Item created successfully!");
      }

      setFormData({ name: "", description: "", price: "", stock: "", image: null });
      setUploadedImage("");
      setEditId(null);
      setShowForm(false);
      fetchMenuItems();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage("❌ Error uploading menu item.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/menu/${id}`);
      setMessage("🗑️ Item deleted successfully!");
      fetchMenuItems();
    } catch (err) {
      console.error(err);
      setMessage("❌ Error deleting item.");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      stock: item.stock,
      image: null,
    });
    setUploadedImage(item.image);
    setEditId(item._id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-yellow-50 to-white px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mb-6">
     <div className="flex items-center justify-center  bg-white">
  <img
    src="/images/logo.png"
    alt="Company logo"
    className="w-40 h-50 p-10 top-0"
  />
</div>

        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Admin <span className="text-yellow-600">Dashboard</span>
        </h2>
        {/* Item Count */}
<p className="text-start font- text-2xl text-gray-600 mb-6">
  📦 Total Items: <span className="font-bold">{menuItems.length}</span>
</p>

        {/* Add Item Button */}
        <div className="flex justify-start mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-6 py-2 rounded-lg font-semibold bg-yellow-500 text-white"
          >
            ➕ {editId ? "Edit Item" : "Add Item"}
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-5 mb-10">
            {message && (
              <div
                className={`p-3 mb-5 rounded-lg text-center font-medium ${
                  message.includes("Error")
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : "bg-green-100 text-green-700 border border-green-300"
                }`}
              >
                {message}
              </div>
            )}

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter item name"
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows="3"
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            />
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
              className="w-full border border-gray-300 rounded-lg p-3"
              required
            />
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              className="w-full border border-gray-300 rounded-lg p-3"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-50"
            />

            {uploadedImage && (
              <img
                src={uploadedImage}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600"
            >
              {loading ? "Uploading..." : editId ? "Update Item" : "Upload Item"}
            </button>
          </form>
        )}

        {/* Items List (always visible) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="border border-gray-300 rounded-lg p-4 shadow-sm flex flex-col"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover rounded-md mb-3"
              />
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
              <p className="mt-1 font-semibold">₹{item.price}</p>
              <p className="text-sm text-gray-500">
                {item.stock > 0 ? `Stock: ${item.stock}` : "❌ Sold Out"}
              </p>

              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 py-2 bg-blue-500 text-white rounded-lg"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="flex-1 py-2 bg-red-500 text-white rounded-lg"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminMenuUpload;
