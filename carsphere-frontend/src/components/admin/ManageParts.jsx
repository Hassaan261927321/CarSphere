import { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageParts = () => {
  const [parts, setParts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', image: '', category: 'Engine', stock: '', description: '' });

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    const { data } = await api.get('/parts');
    setParts(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/parts/${editing}`, form);
    } else {
      await api.post('/parts', form);
    }
    fetchParts();
    setEditing(null);
    setForm({ name: '', price: '', image: '', category: 'Engine', stock: '', description: '' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this part?')) {
      await api.delete(`/parts/${id}`);
      fetchParts();
    }
  };

  const editPart = (part) => {
    setEditing(part._id);
    setForm(part);
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-4">Manage Spare Parts</h3>
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="border p-1 rounded" required />
        <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="border p-1 rounded" required />
        <input type="text" placeholder="Image URL" value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} className="border p-1 rounded" />
        <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="border p-1 rounded">
          <option>Engine</option><option>Brakes</option><option>Suspension</option><option>Electrical</option><option>Accessories</option>
        </select>
        <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} className="border p-1 rounded" required />
        <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="border p-1 rounded col-span-2" />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">{editing ? 'Update' : 'Add'} Part</button>
        {editing && <button type="button" onClick={() => { setEditing(null); setForm({ name: '', price: '', image: '', category: 'Engine', stock: '', description: '' }); }} className="bg-gray-500 text-white px-3 py-1 rounded">Cancel</button>}
      </form>
      <div className="space-y-2">
        {parts.map(part => (
          <div key={part._id} className="flex justify-between items-center border-b py-2">
            <div><strong>{part.name}</strong> - ₨{part.price} (Stock: {part.stock})</div>
            <div>
              <button onClick={() => editPart(part)} className="text-blue-600 mr-2">Edit</button>
              <button onClick={() => handleDelete(part._id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ManageParts;