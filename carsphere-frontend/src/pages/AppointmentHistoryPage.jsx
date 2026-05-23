import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ReviewForm from '../components/mechanic/ReviewForm';
import StarRating from '../components/common/StarRating';

const AppointmentHistoryPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await api.get('/appointments');
        setAppointments(data);
      } catch (error) {
        console.error('Failed to load appointments', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading appointments...</div>;
  }

  const completed = appointments.filter(a => a.status === 'completed');
  const upcoming = appointments.filter(a => ['pending', 'confirmed'].includes(a.status));

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>
      
      {/* Upcoming Appointments */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Upcoming</h2>
        {upcoming.length === 0 && <p className="text-gray-500">No upcoming appointments.</p>}
        {upcoming.map(apt => (
          <div key={apt._id} className="border rounded-lg p-4 mb-3 bg-white shadow-sm">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <p className="font-semibold">{apt.vehicle?.title || 'Vehicle'}</p>
                <p className="text-gray-600">
                  {new Date(apt.date).toLocaleDateString()} at {apt.time}
                </p>
                <p className="text-sm text-gray-500">
                  Mechanic: {apt.mechanic ? (
                    <Link to={`/mechanic/${apt.mechanic._id}`} className="text-blue-600 hover:underline">
                      {apt.mechanic.fullName}
                    </Link>
                  ) : 'Not assigned'}
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-sm self-start mt-2 md:mt-0 ${
                apt.status === 'confirmed' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {apt.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Completed Appointments (Reviewable) */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Past Appointments</h2>
        {completed.length === 0 && <p className="text-gray-500">No completed appointments yet.</p>}
        {completed.map(apt => (
          <div key={apt._id} className="border rounded-lg p-4 mb-3 bg-white shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div className="flex-1">
                <p className="font-semibold">{apt.vehicle?.title || 'Vehicle'}</p>
                <p className="text-gray-600">
                  {new Date(apt.date).toLocaleDateString()} at {apt.time}
                </p>
                <p className="text-sm text-gray-500">
                  Mechanic: {apt.mechanic ? (
                    <Link to={`/mechanic/${apt.mechanic._id}`} className="text-blue-600 hover:underline">
                      {apt.mechanic.fullName}
                    </Link>
                  ) : 'Not assigned'}
                </p>
                {apt.mechanic && apt.mechanic.rating > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <StarRating rating={apt.mechanic.rating} readonly size="sm" />
                    <span className="text-xs text-gray-500">({apt.mechanic.rating.toFixed(1)})</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedAppointment(apt)}
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 mt-2 md:mt-0"
              >
                Write Review
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Review Form */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Review {selectedAppointment.mechanic?.fullName}
              </h3>
              <button 
                onClick={() => setSelectedAppointment(null)} 
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            <ReviewForm 
              appointmentId={selectedAppointment._id} 
              onReviewSubmitted={() => {
                setSelectedAppointment(null);
                // Refresh appointments to update UI (optional)
                window.location.reload();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentHistoryPage;