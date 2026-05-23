import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateListingPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', make: '', model: '', year: '', price: '', mileage: '', location: '',
    transmission: 'Automatic', fuelType: 'Petrol', engine: '', color: '', description: '',
    images: [], auctionEndTime: ''
  });
  const [imageInput, setImageInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setForm({ ...form, images: [...form.images, imageInput.trim()] });
      setImageInput('');
    }
  };
  const removeImage = (index) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/vehicles', form);
      alert('Listing created successfully!');
      navigate('/my-listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Create New Listing</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" placeholder="Title (e.g., Toyota Corolla 2022)" value={form.title} onChange={handleChange} className="border p-2 rounded" required />
          <input name="make" placeholder="Make (e.g., Toyota)" value={form.make} onChange={handleChange} className="border p-2 rounded" required />
          <input name="model" placeholder="Model (e.g., Corolla)" value={form.model} onChange={handleChange} className="border p-2 rounded" required />
          <input name="year" type="number" placeholder="Year" value={form.year} onChange={handleChange} className="border p-2 rounded" required />
          <input name="price" type="number" placeholder="Buy It Now Price (₨)" value={form.price} onChange={handleChange} className="border p-2 rounded" required />
          <input name="mileage" type="number" placeholder="Mileage (km)" value={form.mileage} onChange={handleChange} className="border p-2 rounded" required />
          <input name="location" placeholder="Location (e.g., Karachi)" value={form.location} onChange={handleChange} className="border p-2 rounded" required />
          <select name="transmission" value={form.transmission} onChange={handleChange} className="border p-2 rounded">
            <option>Automatic</option><option>Manual</option>
          </select>
          <select name="fuelType" value={form.fuelType} onChange={handleChange} className="border p-2 rounded">
            <option>Petrol</option><option>Diesel</option><option>CNG</option><option>Electric</option>
          </select>
          <input name="engine" placeholder="Engine (e.g., 1.8L)" value={form.engine} onChange={handleChange} className="border p-2 rounded" />
          <input name="color" placeholder="Color" value={form.color} onChange={handleChange} className="border p-2 rounded" />
          <input name="auctionEndTime" type="datetime-local" value={form.auctionEndTime} onChange={handleChange} className="border p-2 rounded" />
        </div>
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows="4" className="border p-2 rounded w-full mt-3" />
        
        {/* Image URLs */}
        <div className="mt-3">
          <label className="block font-medium mb-1">Image URLs</label>
          <div className="flex gap-2">
            <input type="url" value={imageInput} onChange={(e) => setImageInput(e.target.value)} placeholder="https://example.com/image.jpg" className="border p-2 rounded flex-1" />
            <button type="button" onClick={addImage} className="bg-gray-600 text-white px-3 py-1 rounded">Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {form.images.map((url, idx) => (
              <div key={idx} className="relative">
                <img src={url} alt={`preview ${idx}`} className="w-16 h-16 object-cover rounded border" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs">×</button>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button type="submit" disabled={loading} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  );
};

export default CreateListingPage;