import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const MechanicAppointmentsPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get('/appointments/mechanic');
        setAppointments(data);
      } catch (error) {
        console.error('Failed to load mechanic appointments', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchAppointments();
  }, [user]);

  const handleComplete = async (id) => {
    if (window.confirm('Mark this appointment as completed? The customer can then leave a review.')) {
      await api.put(`/appointments/${id}/complete`);
      setAppointments(prev =>
        prev.map(apt => (apt._id === id ? { ...apt, status: 'completed' } : apt))
      );
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Service Requests</h1>
      {appointments.length === 0 ? (
        <p className="text-gray-500">No service requests yet.</p>
      ) : (
        appointments.map(apt => (
          <div key={apt._id} className="border rounded-lg p-4 mb-3 bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{apt.vehicle?.title || 'Vehicle'}</p>
                <p>Customer: {apt.customer?.fullName}</p>
                <p>Date: {new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                <p>Status: {apt.status}</p>
              </div>
              {apt.status !== 'completed' && (
                <button
                  onClick={() => handleComplete(apt._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded"
                >
                  Complete
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MechanicAppointmentsPage;