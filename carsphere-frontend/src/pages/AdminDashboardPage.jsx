import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ManageParts from '../components/admin/ManageParts';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [pendingMechanics, setPendingMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, mechanicsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/pending-mechanics'),
        ]);
        setStats(statsRes.data);
        setPendingMechanics(mechanicsRes.data);
      } catch (error) {
        console.error('Failed to load admin data', error);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'admin') fetchAdminData();
  }, [user]);

  const verifyMechanic = async (id) => {
    try {
      await api.put(`/admin/verify-mechanic/${id}`);
      setPendingMechanics(pendingMechanics.filter(m => m._id !== id));
      alert('Mechanic verified');
    } catch (error) {
      alert('Verification failed');
    }
  };

  if (loading) return <div className="text-center py-10">Loading admin panel...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('mechanics')}
          className={`px-4 py-2 font-medium ${activeTab === 'mechanics' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
        >
          Mechanic Verification
        </button>
        <button
          onClick={() => setActiveTab('parts')}
          className={`px-4 py-2 font-medium ${activeTab === 'parts' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
        >
          Spare Parts Inventory
        </button>
      </div>

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-gray-600">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers || 0}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-gray-600">Vehicles Listed</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalVehicles || 0}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-gray-600">Active Auctions</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.activeAuctions || 0}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-gray-600">Total Appointments</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalAppointments || 0}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-gray-600">Pending Mechanics</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.pendingMechanics || 0}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold text-gray-600">Total Reviews</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalReviews || 0}</p>
          </div>
        </div>
      )}

      {/* Tab: Mechanic Verification */}
      {activeTab === 'mechanics' && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Pending Mechanic Verifications</h2>
          {pendingMechanics.length === 0 ? (
            <p className="text-gray-500">No pending verifications.</p>
          ) : (
            pendingMechanics.map(m => (
              <div key={m._id} className="border p-3 mb-2 rounded flex justify-between items-center bg-white">
                <div>
                  <strong>{m.fullName}</strong> - {m.email}<br />
                  <span className="text-sm text-gray-500">Skills: {m.skills?.join(', ') || 'Not provided'}</span><br />
                  <span className="text-sm text-gray-500">Workshop: {m.workshopAddress || 'N/A'}</span>
                </div>
                <button onClick={() => verifyMechanic(m._id)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                  Verify
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Spare Parts Inventory */}
      {activeTab === 'parts' && (
        <div>
          <ManageParts />
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;