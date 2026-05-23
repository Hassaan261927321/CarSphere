import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const EditListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [imageInput, setImageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const { data } = await api.get(`/vehicles/${id}`);
        setForm(data);
      } catch (error) {
        setError('Vehicle not found');
      } finally {
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setForm({ ...form, images: [...(form.images || []), imageInput.trim()] });
      setImageInput('');
    }
  };
  const removeImage = (index) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/vehicles/${id}`, form);
      alert('Listing updated!');
      navigate('/my-listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" value={form.title || ''} onChange={handleChange} className="border p-2 rounded" required />
          <input name="make" value={form.make || ''} onChange={handleChange} className="border p-2 rounded" required />
          <input name="model" value={form.model || ''} onChange={handleChange} className="border p-2 rounded" required />
          <input name="year" type="number" value={form.year || ''} onChange={handleChange} className="border p-2 rounded" required />
          <input name="price" type="number" value={form.price || ''} onChange={handleChange} className="border p-2 rounded" required />
          <input name="mileage" type="number" value={form.mileage || ''} onChange={handleChange} className="border p-2 rounded" required />
          <input name="location" value={form.location || ''} onChange={handleChange} className="border p-2 rounded" required />
          <select name="transmission" value={form.transmission || 'Automatic'} onChange={handleChange} className="border p-2 rounded">
            <option>Automatic</option><option>Manual</option>
          </select>
          <select name="fuelType" value={form.fuelType || 'Petrol'} onChange={handleChange} className="border p-2 rounded">
            <option>Petrol</option><option>Diesel</option><option>CNG</option><option>Electric</option>
          </select>
          <input name="engine" value={form.engine || ''} onChange={handleChange} className="border p-2 rounded" />
          <input name="color" value={form.color || ''} onChange={handleChange} className="border p-2 rounded" />
          <input name="auctionStatus" value={form.auctionStatus || 'active'} onChange={handleChange} className="border p-2 rounded" placeholder="active/closed/pending" />
          <input name="auctionEndTime" type="datetime-local" value={form.auctionEndTime ? new Date(form.auctionEndTime).toISOString().slice(0,16) : ''} onChange={handleChange} className="border p-2 rounded" />
        </div>
        <textarea name="description" value={form.description || ''} onChange={handleChange} rows="4" className="border p-2 rounded w-full mt-3" />
        
        {/* Image URLs */}
        <div className="mt-3">
          <label className="block font-medium mb-1">Image URLs</label>
          <div className="flex gap-2">
            <input type="url" value={imageInput} onChange={(e) => setImageInput(e.target.value)} placeholder="https://example.com/image.jpg" className="border p-2 rounded flex-1" />
            <button type="button" onClick={addImage} className="bg-gray-600 text-white px-3 py-1 rounded">Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {(form.images || []).map((url, idx) => (
              <div key={idx} className="relative">
                <img src={url} alt={`preview ${idx}`} className="w-16 h-16 object-cover rounded border" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs">×</button>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button type="submit" disabled={submitting} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 disabled:opacity-50">
          {submitting ? 'Updating...' : 'Update Listing'}
        </button>
      </form>
    </div>
  );
};

export default EditListingPage;