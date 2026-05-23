// // // import { useState, useEffect } from 'react';
// // import { useAuth } from '../contexts/AuthContext';
// // import api from '../services/api';
// // import WonAuctionPayment from '../components/payment/WonAuctionPayment';
// // import { motion } from 'framer-motion';
// // import { 
// //   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
// //   LineChart, Line 
// // } from 'recharts';

// // const DashboardPage = () => {
// //   const { user } = useAuth();
// //   const [listings, setListings] = useState([]);
// //   const [bids, setBids] = useState([]);
// //   const [appointments, setAppointments] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [recentActivity, setRecentActivity] = useState([]);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       if (!user) return;
// //       setLoading(true);
// //       try {
// //         if (user.role === 'seller') {
// //           const { data } = await api.get('/vehicles/my-listings');
// //           setListings(data);
// //           // activity from listings
// //           const activity = data.slice(0, 5).map(v => ({
// //             id: v._id,
// //             type: 'listing',
// //             title: v.title,
// //             date: new Date(v.createdAt),
// //             amount: v.price,
// //           }));
// //           setRecentActivity(activity);
// //         } else if (user.role === 'buyer') {
// //           const { data } = await api.get('/bids/my-bids');
// //           setBids(data);
// //           const activity = data.slice(0, 5).map(b => ({
// //             id: b._id,
// //             type: 'bid',
// //             title: b.vehicle?.title,
// //             date: new Date(b.createdAt),
// //             amount: b.amount,
// //           }));
// //           setRecentActivity(activity);
// //         } else if (user.role === 'mechanic') {
// //           const { data } = await api.get('/appointments');
// //           setAppointments(data);
// //           const activity = data.slice(0, 5).map(a => ({
// //             id: a._id,
// //             type: 'appointment',
// //             title: a.vehicle?.title,
// //             date: new Date(a.date),
// //             status: a.status,
// //           }));
// //           setRecentActivity(activity);
// //         }
// //         const { data: apts } = await api.get('/appointments');
// //         setAppointments(apts);
// //       } catch (err) {
// //         console.error(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchData();
// //   }, [user]);

// //   // Dummy chart data (in real app, would come from backend)
// //   const bidActivity = [
// //     { name: 'Jan', bids: 4, listings: 2 },
// //     { name: 'Feb', bids: 7, listings: 3 },
// //     { name: 'Mar', bids: 5, listings: 5 },
// //     { name: 'Apr', bids: 9, listings: 4 },
// //     { name: 'May', bids: 12, listings: 7 },
// //   ];

// //   const stats = {
// //     totalListings: listings.length,
// //     totalBids: bids.length,
// //     totalAppointments: appointments.length,
// //     activeAuctions: listings.filter(l => l.auctionStatus === 'active').length,
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex justify-center items-center h-64">
// //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="space-y-6">
// //       {/* Welcome Header */}
// //       <motion.div
// //         initial={{ opacity: 0, y: -20 }}
// //         animate={{ opacity: 1, y: 0 }}
// //         className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg"
// //       >
// //         <div className="flex justify-between items-center">
// //           <div>
// //             <h1 className="text-3xl font-bold">Welcome back, {user?.fullName || 'User'}! 👋</h1>
// //             <p className="text-blue-100 mt-2">Here's what's happening with your {user?.role} account.</p>
// //           </div>
// //           <div className="bg-white/20 rounded-full p-3">
// //             {user?.role === 'seller' && '🚗'}
// //             {user?.role === 'buyer' && '💰'}
// //             {user?.role === 'mechanic' && '🔧'}
// //           </div>
// //         </div>
// //       </motion.div>

// //       {/* Stats Cards */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
// //         <StatCard title="Total Listings" value={stats.totalListings} icon="🚗" color="bg-blue-500" />
// //         <StatCard title="Bids Placed" value={stats.totalBids} icon="💰" color="bg-green-500" />
// //         <StatCard title="Appointments" value={stats.totalAppointments} icon="📅" color="bg-purple-500" />
// //         <StatCard title="Active Auctions" value={stats.activeAuctions} icon="🔥" color="bg-orange-500" />
// //       </div>

// //       {/* Charts and Activity */}
// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //         {/* Chart */}
// //         <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
// //           <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
// //           <ResponsiveContainer width="100%" height={300}>
// //             <BarChart data={bidActivity}>
// //               <CartesianGrid strokeDasharray="3 3" />
// //               <XAxis dataKey="name" />
// //               <YAxis />
// //               <Tooltip />
// //               <Legend />
// //               <Bar dataKey="bids" fill="#3B82F6" name="Bids" />
// //               <Bar dataKey="listings" fill="#10B981" name="Listings" />
// //             </BarChart>
// //           </ResponsiveContainer>
// //         </div>

// //         {/* Recent Activity Feed */}
// //         <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
// //           <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
// //           <div className="space-y-3">
// //             {recentActivity.length === 0 ? (
// //               <p className="text-gray-500 text-sm">No recent activity</p>
// //             ) : (
// //               recentActivity.map((act, idx) => (
// //                 <motion.div
// //                   key={act.id}
// //                   initial={{ opacity: 0, x: -20 }}
// //                   animate={{ opacity: 1, x: 0 }}
// //                   transition={{ delay: idx * 0.05 }}
// //                   className="flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
// //                 >
// //                   <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
// //                     {act.type === 'listing' && '🚗'}
// //                     {act.type === 'bid' && '💰'}
// //                     {act.type === 'appointment' && '📅'}
// //                   </div>
// //                   <div className="flex-1">
// //                     <p className="text-sm font-medium">{act.title || 'Item'}</p>
// //                     <p className="text-xs text-gray-500">
// //                       {act.type === 'listing' && `Listed for ₨${act.amount?.toLocaleString()}`}
// //                       {act.type === 'bid' && `Bid ₨${act.amount?.toLocaleString()}`}
// //                       {act.type === 'appointment' && `Status: ${act.status}`}
// //                     </p>
// //                   </div>
// //                   <span className="text-xs text-gray-400">
// //                     {act.date ? new Date(act.date).toLocaleDateString() : 'Just now'}
// //                   </span>
// //                 </motion.div>
// //               ))
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Quick Actions */}
// //       <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
// //         <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
// //         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
// //           <QuickActionButton 
// //             icon="➕" 
// //             label="New Listing" 
// //             onClick={() => window.location.href = '/marketplace/new'} 
// //           />
// //           <QuickActionButton 
// //             icon="🔍" 
// //             label="Browse Cars" 
// //             onClick={() => window.location.href = '/marketplace'} 
// //           />
// //           <QuickActionButton 
// //             icon="📅" 
// //             label="Book Service" 
// //             onClick={() => window.location.href = '/appointments'} 
// //           />
// //           <QuickActionButton 
// //             icon="💬" 
// //             label="Chat Support" 
// //             onClick={() => document.querySelector('.fixed.bottom-6 button')?.click()} 
// //           />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // Helper Components
// // const StatCard = ({ title, value, icon, color }) => (
// //   <motion.div
// //     whileHover={{ scale: 1.02 }}
// //     className={`${color} rounded-xl p-4 text-white shadow-md`}
// //   >
// //     <div className="flex justify-between items-center">
// //       <div>
// //         <p className="text-sm opacity-80">{title}</p>
// //         <p className="text-2xl font-bold">{value}</p>
// //       </div>
// //       <span className="text-3xl">{icon}</span>
// //     </div>
// //   </motion.div>
// // );

// // const QuickActionButton = ({ icon, label, onClick }) => (
// //   <button
// //     onClick={onClick}
// //     className="flex flex-col items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
// //   >
// //     <span className="text-2xl mb-1">{icon}</span>
// //     <span className="text-sm font-medium">{label}</span>
// //   </button>
// // );

// // export default DashboardPage;

// import { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import api from '../services/api';
// import { motion } from 'framer-motion';
// import WonAuctionPayment from '../components/payment/WonAuctionPayment';

// const DashboardPage = () => {
//   const { user } = useAuth();
//   const [listings, setListings] = useState([]);
//   const [activeBids, setActiveBids] = useState([]);
//   const [wonAuctions, setWonAuctions] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user) return;
//       setLoading(true);
//       try {
//         if (user.role === 'seller') {
//           const { data } = await api.get('/vehicles/my-listings');
//           setListings(data);
//         } else if (user.role === 'buyer') {
//           // Fetch active bids (auctions still active)
//           const { data: active } = await api.get('/bids/my-active-bids');
//           setActiveBids(active);
//           // Fetch won auctions (closed and highest bidder)
//           const { data: won } = await api.get('/bids/my-won');
//           setWonAuctions(won);
//         }
//         // Fetch appointments (common for all roles)
//         const { data: apts } = await api.get('/appointments');
//         setAppointments(apts);
//       } catch (err) {
//         console.error('Dashboard fetch error:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [user]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <h1 className="text-3xl font-bold mb-2">Welcome, {user?.fullName}</h1>
//       <p className="text-gray-600 mb-6">Role: {user?.role}</p>

//       {/* Seller Section */}
//       {user?.role === 'seller' && (
//         <div className="mb-8">
//           <h2 className="text-2xl font-semibold mb-4">My Listings</h2>
//           {listings.length === 0 ? (
//             <p className="text-gray-500">No listings yet. <a href="/marketplace/new" className="text-blue-600">Create one</a></p>
//           ) : (
//             <div className="grid gap-4">
//               {listings.map((vehicle, idx) => (
//                 <motion.div
//                   key={vehicle._id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ delay: idx * 0.05 }}
//                   className="border rounded-lg p-4 bg-white shadow-sm"
//                 >
//                   <div className="flex justify-between items-start flex-wrap">
//                     <div>
//                       <h3 className="font-semibold text-lg">{vehicle.title}</h3>
//                       <p className="text-gray-600">₨{vehicle.price.toLocaleString()}</p>
//                       <p className="text-sm text-gray-500 mt-1">
//                         Current bid: ₨{vehicle.currentBid.toLocaleString()}
//                       </p>
//                     </div>
//                     <span
//                       className={`px-2 py-1 rounded text-sm ${
//                         vehicle.auctionStatus === 'active'
//                           ? 'bg-green-100 text-green-700'
//                           : 'bg-gray-100 text-gray-700'
//                       }`}
//                     >
//                       {vehicle.auctionStatus}
//                     </span>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Buyer Section */}
//       {user?.role === 'buyer' && (
//         <>
//           {/* Active Bids */}
//           <div className="mb-8">
//             <h2 className="text-2xl font-semibold mb-4">My Active Bids</h2>
//             {activeBids.length === 0 ? (
//               <p className="text-gray-500">No active bids. Browse the <a href="/marketplace" className="text-blue-600">marketplace</a>.</p>
//             ) : (
//               <div className="grid gap-4">
//                 {activeBids.map((bid, idx) => (
//                   <motion.div
//                     key={bid._id}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: idx * 0.05 }}
//                     className="border rounded-lg p-4 bg-white shadow-sm"
//                   >
//                     <div className="flex justify-between items-start flex-wrap">
//                       <div>
//                         <h3 className="font-semibold">{bid.vehicle?.title || 'Vehicle'}</h3>
//                         <p className="text-gray-600">Your bid: ₨{bid.amount.toLocaleString()}</p>
//                         <p className="text-sm text-gray-500">
//                           Current highest: ₨{bid.vehicle?.currentBid.toLocaleString()}
//                         </p>
//                       </div>
//                       <div className="text-right">
//                         {bid.amount === bid.vehicle?.currentBid ? (
//                           <span className="text-green-600 font-medium">Leading</span>
//                         ) : (
//                           <span className="text-red-600 font-medium">Outbid</span>
//                         )}
//                         {bid.vehicle?.auctionEndTime && (
//                           <p className="text-xs text-gray-400 mt-1">
//                             Ends: {new Date(bid.vehicle.auctionEndTime).toLocaleString()}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Won Auctions with Payment */}
//           <div className="mb-8">
//             <h2 className="text-2xl font-semibold mb-4">Auctions Won</h2>
//             {wonAuctions.length === 0 ? (
//               <p className="text-gray-500">You haven't won any auctions yet.</p>
//             ) : (
//               <div className="grid gap-4">
//                 {wonAuctions.map((won, idx) => (
//                   <motion.div
//                     key={won.vehicle._id}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: idx * 0.05 }}
//                     className="border rounded-lg p-4 bg-green-50 shadow-sm"
//                   >
//                     <div className="flex flex-col md:flex-row justify-between gap-4">
//                       <div>
//                         <h3 className="font-semibold text-lg">{won.vehicle.title}</h3>
//                         <p className="text-gray-700">Winning bid: ₨{won.bidAmount.toLocaleString()}</p>
//                         <p className="text-sm text-gray-500">Seller: {won.vehicle.seller?.fullName}</p>
//                       </div>
//                       <div className="md:w-1/2">
//                         <WonAuctionPayment vehicle={won.vehicle} />
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       {/* Appointments Section (common) */}
//       <div className="mb-8">
//         <h2 className="text-2xl font-semibold mb-4">Appointments</h2>
//         {appointments.length === 0 ? (
//           <p className="text-gray-500">No appointments scheduled.</p>
//         ) : (
//           <div className="grid gap-4">
//             {appointments.map((apt, idx) => (
//               <motion.div
//                 key={apt._id}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: idx * 0.05 }}
//                 className="border rounded-lg p-4 bg-white shadow-sm"
//               >
//                 <div className="flex justify-between items-start flex-wrap">
//                   <div>
//                     <h3 className="font-semibold">{apt.vehicle?.title || 'Vehicle'}</h3>
//                     <p className="text-gray-600">
//                       {new Date(apt.date).toLocaleDateString()} at {apt.time}
//                     </p>
//                     <p className="text-sm text-gray-500">Type: {apt.type}</p>
//                   </div>
//                   <span
//                     className={`px-2 py-1 rounded text-sm ${
//                       apt.status === 'confirmed'
//                         ? 'bg-green-100 text-green-700'
//                         : apt.status === 'completed'
//                         ? 'bg-blue-100 text-blue-700'
//                         : 'bg-yellow-100 text-yellow-700'
//                     }`}
//                   >
//                     {apt.status}
//                   </span>
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import WonAuctionPayment from '../components/payment/WonAuctionPayment';
import MechanicReviews from '../components/mechanic/MechanicReviews';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [activeBids, setActiveBids] = useState([]);
  const [wonAuctions, setWonAuctions] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [mechanicAppointments, setMechanicAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Common appointments (as customer)
        const { data: apts } = await api.get('/appointments');
        setAppointments(apts);

        // Role-specific data
        if (user.role === 'seller') {
          const { data } = await api.get('/vehicles/my-listings');
          setListings(data);
        } else if (user.role === 'buyer') {
          const { data: active } = await api.get('/bids/my-active-bids');
          setActiveBids(active);
          const { data: won } = await api.get('/bids/my-won');
          setWonAuctions(won);
        } else if (user.role === 'mechanic') {
          const { data } = await api.get('/appointments/mechanic');
          setMechanicAppointments(data);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleCompleteAppointment = async (appointmentId) => {
    if (window.confirm('Mark this appointment as completed? The customer will then be able to leave a review.')) {
      try {
        await api.put(`/appointments/${appointmentId}/complete`);
        // Refresh appointments
        const { data } = await api.get('/appointments/mechanic');
        setMechanicAppointments(data);
        alert('Appointment marked as completed');
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to complete appointment');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.fullName}</h1>
      <p className="text-gray-600 mb-6">Role: {user?.role}</p>

      {/* Seller Section */}
      {user?.role === 'seller' && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">My Listings</h2>
          {/* ... existing seller content ... */}
        </div>
      )}

      {/* Buyer Section */}
      {user?.role === 'buyer' && (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">My Active Bids</h2>
            {/* ... existing bids content ... */}
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Auctions Won</h2>
            {wonAuctions.map(won => (
              <div key={won.vehicle._id} className="border rounded-lg p-4 mb-3 bg-green-50">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="font-semibold">{won.vehicle.title}</h3>
                    <p>Winning bid: ₨{won.bidAmount.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Seller: {won.vehicle.seller?.fullName}</p>
                  </div>
                  <div className="md:w-1/2">
                    <WonAuctionPayment vehicle={won.vehicle} />
                  </div>
                </div>
              </div>
            ))}
            {wonAuctions.length === 0 && (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-500">🏆 You haven't won any auctions yet.</p>
                <Link to="/marketplace" className="text-blue-600 hover:underline mt-2 inline-block">Start bidding →</Link>
              </div>
            )}
          </div>
        </>
      )}

      {/* Mechanic Section */}
      {user?.role === 'mechanic' && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Service Appointments</h2>
          {mechanicAppointments.length === 0 ? (
            <p className="text-gray-500">No service requests yet.</p>
          ) : (
            <div className="space-y-4">
              {mechanicAppointments.map(apt => (
                <div key={apt._id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div>
                      <p className="font-semibold">{apt.vehicle?.title || 'Vehicle'}</p>
                      <p className="text-gray-600">Customer: {apt.customer?.fullName}</p>
                      <p className="text-gray-600">{new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                      <p className="text-sm text-gray-500">Status: {apt.status}</p>
                    </div>
                    {apt.status !== 'completed' && (
                      <button
                        onClick={() => handleCompleteAppointment(apt._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2 md:mt-0"
                      >
                        Mark Completed
                      </button>
                    )}
                    {apt.status === 'completed' && (
                      <span className="text-green-600 font-semibold">✓ Completed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">My Reviews</h2>
            <MechanicReviews mechanicId={user._id} />
          </div>
        </div>
      )}

      {/* Customer Appointments Section (for buyer & seller) */}
      {['buyer', 'seller'].includes(user?.role) && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">My Appointments (as customer)</h2>
          {appointments.length === 0 ? <p className="text-gray-500">No appointments scheduled.</p> :
            appointments.map(apt => (
              <div key={apt._id} className="border rounded-lg p-4 mb-2 bg-white shadow-sm">
                <p><strong>{apt.vehicle?.title}</strong> – {new Date(apt.date).toLocaleDateString()} at {apt.time}</p>
                <p className="text-sm text-gray-600">Status: {apt.status}</p>
                {apt.mechanic && <p className="text-sm">Mechanic: {apt.mechanic.fullName}</p>}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};

export default DashboardPage;