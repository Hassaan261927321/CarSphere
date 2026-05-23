// // import { useState, useEffect } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import { motion } from 'framer-motion';
// // import api from '../services/api';
// // import { useAuth } from '../contexts/AuthContext';
// // import { useSocket } from '../contexts/SocketContext';
// // import CountdownTimer from '../components/common/CountdownTimer';

// // const VehicleDetailsPage = () => {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const { user } = useAuth();
// //   const { socket } = useSocket();
// //   const [vehicle, setVehicle] = useState(null);
// //   const [bidAmount, setBidAmount] = useState('');
// //   const [selectedImage, setSelectedImage] = useState(0);
// //   const [bidError, setBidError] = useState('');
// //   const [loading, setLoading] = useState(true);

// //   const fetchVehicle = async () => {
// //     try {
// //       const { data } = await api.get(`/vehicles/${id}`);
// //       setVehicle(data);
// //     } catch (error) {
// //       console.error('Failed to fetch vehicle:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchVehicle();
// //   }, [id]);

// //   // Listen for real-time auction end event
// //   useEffect(() => {
// //     if (!socket) return;
// //     const handleAuctionEnd = (data) => {
// //       if (data.auctionId === id) {
// //         setVehicle(prev => ({ ...prev, auctionStatus: 'closed' }));
// //         alert(data.winner ? `Auction ended! Winner: ${data.winner} with ₨${data.winningBid.toLocaleString()}` : 'Auction ended with no bids.');
// //       }
// //     };
// //     socket.on('auction_ended', handleAuctionEnd);
// //     return () => socket.off('auction_ended', handleAuctionEnd);
// //   }, [socket, id]);

// //   const handlePlaceBid = async (e) => {
// //     e.preventDefault();
// //     if (!user) {
// //       navigate('/login');
// //       return;
// //     }
// //     const bid = parseInt(bidAmount);
// //     if (isNaN(bid)) {
// //       setBidError('Please enter a valid number');
// //       return;
// //     }
// //     if (bid <= vehicle.currentBid) {
// //       setBidError(`Bid must be higher than ₨${vehicle.currentBid.toLocaleString()}`);
// //       return;
// //     }
// //     if (bid > vehicle.price) {
// //       setBidError('Bid cannot exceed buy-it-now price');
// //       return;
// //     }
// //     try {
// //       await api.post(`/bids/${id}`, { amount: bid });
// //       alert('Bid placed successfully!');
// //       setBidAmount('');
// //       setBidError('');
// //       fetchVehicle(); // refresh vehicle data
// //     } catch (error) {
// //       setBidError(error.response?.data?.message || 'Failed to place bid');
// //     }
// //   };

// //   const isAuctionActive = vehicle && vehicle.auctionStatus === 'active' && new Date(vehicle.auctionEndTime) > new Date();

// //   if (loading) {
// //     return <div className="text-center py-10">Loading vehicle details...</div>;
// //   }

// //   if (!vehicle) {
// //     return (
// //       <div className="text-center py-10">
// //         <h1 className="text-2xl font-bold text-red-600">Vehicle Not Found</h1>
// //         <button onClick={() => navigate('/marketplace')} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
// //           Back to Marketplace
// //         </button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="max-w-7xl mx-auto px-4 py-6">
// //       {/* Breadcrumb */}
// //       <div className="text-sm text-gray-500 mb-4">
// //         <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/')}>Home</span> /
// //         <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/marketplace')}> Marketplace</span> /
// //         <span className="text-gray-800">{vehicle.title}</span>
// //       </div>

// //       <div className="flex flex-col lg:flex-row gap-8">
// //         {/* Left: Image Gallery */}
// //         <div className="lg:w-3/5">
// //           <motion.div
// //             key={selectedImage}
// //             initial={{ opacity: 0 }}
// //             animate={{ opacity: 1 }}
// //             transition={{ duration: 0.3 }}
// //             className="bg-gray-100 rounded-lg overflow-hidden mb-4"
// //           >
// //             <img
// //               src={vehicle.images?.[selectedImage] || 'https://via.placeholder.com/800x400?text=No+Image'}
// //               alt={vehicle.title}
// //               className="w-full h-96 object-cover"
// //             />
// //           </motion.div>
// //           {vehicle.images && vehicle.images.length > 0 && (
// //             <div className="flex gap-2 overflow-x-auto">
// //               {vehicle.images.map((img, idx) => (
// //                 <motion.img
// //                   key={idx}
// //                   whileHover={{ scale: 1.05 }}
// //                   whileTap={{ scale: 0.95 }}
// //                   src={img}
// //                   alt={`${vehicle.title} ${idx + 1}`}
// //                   className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
// //                     selectedImage === idx ? 'border-blue-600' : 'border-gray-300'
// //                   }`}
// //                   onClick={() => setSelectedImage(idx)}
// //                 />
// //               ))}
// //             </div>
// //           )}
// //         </div>

// //         {/* Right: Details & Actions */}
// //         <div className="lg:w-2/5">
// //           <h1 className="text-3xl font-bold mb-2">{vehicle.title}</h1>
// //           <div className="flex items-center gap-2 text-gray-600 mb-4">
// //             <span>{vehicle.year}</span> •
// //             <span>{vehicle.mileage?.toLocaleString()} km</span> •
// //             <span>{vehicle.location}</span>
// //           </div>

// //           {/* Price & Bid */}
// //           <div className="bg-gray-50 p-4 rounded-lg mb-6">
// //             <div className="flex justify-between items-center mb-4">
// //               <div>
// //                 <p className="text-sm text-gray-500">Buy It Now Price</p>
// //                 <p className="text-2xl font-bold text-blue-600">₨{vehicle.price.toLocaleString()}</p>
// //               </div>
// //               <div className="text-right">
// //                 <p className="text-sm text-gray-500">Current Highest Bid</p>
// //                 <p className="text-2xl font-bold text-green-600">₨{vehicle.currentBid.toLocaleString()}</p>
// //               </div>
// //             </div>

// //             {/* Auction Countdown Timer */}
// //             {vehicle.auctionEndTime && (
// //               <div className="bg-yellow-50 p-3 rounded-lg mb-4 text-center">
// //                 <p className="text-sm text-gray-600">⏳ Auction ends in:</p>
// //                 <CountdownTimer endTime={vehicle.auctionEndTime} onExpire={fetchVehicle} />
// //               </div>
// //             )}

// //             {/* Place Bid Form */}
// //             <form onSubmit={handlePlaceBid} className="mb-4">
// //               <label className="block text-sm font-medium mb-1">Your Bid (₨)</label>
// //               <div className="flex gap-2">
// //                 <input
// //                   type="number"
// //                   value={bidAmount}
// //                   onChange={(e) => setBidAmount(e.target.value)}
// //                   placeholder={`Min: ${vehicle.currentBid + 1}`}
// //                   disabled={!isAuctionActive}
// //                   className={`flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 ${!isAuctionActive ? 'bg-gray-100' : ''}`}
// //                 />
// //                 <motion.button
// //                   whileTap={{ scale: 0.95 }}
// //                   type="submit"
// //                   disabled={!isAuctionActive}
// //                   className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${!isAuctionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
// //                 >
// //                   {isAuctionActive ? 'Place Bid' : 'Auction Ended'}
// //                 </motion.button>
// //               </div>
// //               {bidError && <p className="text-red-500 text-sm mt-1">{bidError}</p>}
// //             </form>

// //             <button
// //               onClick={() => navigate('/appointments')}
// //               className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
// //             >
// //               📅 Book Appointment for Test Drive
// //             </button>
// //           </div>

// //           {/* Car Details Table */}
// //           <div className="border rounded-lg overflow-hidden mb-6">
// //             <h3 className="bg-gray-100 p-3 font-semibold">Specifications</h3>
// //             <div className="p-4 grid grid-cols-2 gap-3 text-sm">
// //               <div><span className="text-gray-500">Brand:</span> <span className="ml-2 font-medium">{vehicle.make}</span></div>
// //               <div><span className="text-gray-500">Model:</span> <span className="ml-2 font-medium">{vehicle.model}</span></div>
// //               <div><span className="text-gray-500">Transmission:</span> <span className="ml-2 font-medium">{vehicle.transmission}</span></div>
// //               <div><span className="text-gray-500">Fuel Type:</span> <span className="ml-2 font-medium">{vehicle.fuelType}</span></div>
// //               <div><span className="text-gray-500">Engine:</span> <span className="ml-2 font-medium">{vehicle.engine}</span></div>
// //               <div><span className="text-gray-500">Color:</span> <span className="ml-2 font-medium">{vehicle.color}</span></div>
// //               <div><span className="text-gray-500">Seller:</span> <span className="ml-2 font-medium">{vehicle.seller?.fullName || 'Unknown'}</span></div>
// //             </div>
// //           </div>

// //           {/* Description */}
// //           <div>
// //             <h3 className="font-semibold mb-2">Description</h3>
// //             <p className="text-gray-700">{vehicle.description}</p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default VehicleDetailsPage;

// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import api from '../services/api';
// import { useAuth } from '../contexts/AuthContext';

// const VehicleDetailsPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [vehicle, setVehicle] = useState(null);
//   const [bidAmount, setBidAmount] = useState('');
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [bidError, setBidError] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchVehicle = async () => {
//       try {
//         const { data } = await api.get(`/vehicles/${id}`);
//         setVehicle(data);
//       } catch (error) {
//         console.error('Failed to fetch vehicle:', error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchVehicle();
//   }, [id]);

//   const handlePlaceBid = async (e) => {
//     e.preventDefault();
//     if (!user) {
//       navigate('/login');
//       return;
//     }
//     const bid = parseInt(bidAmount);
//     if (isNaN(bid)) {
//       setBidError('Please enter a valid number');
//       return;
//     }
//     if (bid <= vehicle.currentBid) {
//       setBidError(`Bid must be higher than ₨${vehicle.currentBid.toLocaleString()}`);
//       return;
//     }
//     if (bid > vehicle.price) {
//       setBidError('Bid cannot exceed buy-it-now price');
//       return;
//     }
//     try {
//       await api.post(`/bids/${id}`, { amount: bid });
//       alert('Bid placed successfully!');
//       setBidAmount('');
//       setBidError('');
//       // Refresh vehicle data
//       const { data } = await api.get(`/vehicles/${id}`);
//       setVehicle(data);
//     } catch (error) {
//       setBidError(error.response?.data?.message || 'Failed to place bid');
//     }
//   };

//   if (loading) return <div className="text-center py-10">Loading vehicle details...</div>;
//   if (!vehicle) return <div className="text-center py-10">Vehicle not found</div>;

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-6">
//       <div className="text-sm text-gray-500 mb-4">
//         <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/')}>Home</span> /
//         <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/marketplace')}> Marketplace</span> /
//         <span className="text-gray-800">{vehicle.title}</span>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-8">
//         <div className="lg:w-3/5">
//           <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
//             <img
//               src={vehicle.images?.[selectedImage] || 'https://via.placeholder.com/800x400?text=No+Image'}
//               alt={vehicle.title}
//               className="w-full h-96 object-cover"
//             />
//           </div>
//           {vehicle.images && vehicle.images.length > 0 && (
//             <div className="flex gap-2 overflow-x-auto">
//               {vehicle.images.map((img, idx) => (
//                 <img
//                   key={idx}
//                   src={img}
//                   alt={`${vehicle.title} ${idx + 1}`}
//                   className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
//                     selectedImage === idx ? 'border-blue-600' : 'border-gray-300'
//                   }`}
//                   onClick={() => setSelectedImage(idx)}
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="lg:w-2/5">
//           <h1 className="text-3xl font-bold mb-2">{vehicle.title}</h1>
//           <div className="flex items-center gap-2 text-gray-600 mb-4">
//             <span>{vehicle.year}</span> •
//             <span>{vehicle.mileage?.toLocaleString()} km</span> •
//             <span>{vehicle.location}</span>
//           </div>

//           <div className="bg-gray-50 p-4 rounded-lg mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <div>
//                 <p className="text-sm text-gray-500">Buy It Now Price</p>
//                 <p className="text-2xl font-bold text-blue-600">₨{vehicle.price.toLocaleString()}</p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm text-gray-500">Current Highest Bid</p>
//                 <p className="text-2xl font-bold text-green-600">₨{vehicle.currentBid.toLocaleString()}</p>
//               </div>
//             </div>

//             <form onSubmit={handlePlaceBid} className="mb-4">
//               <label className="block text-sm font-medium mb-1">Your Bid (₨)</label>
//               <div className="flex gap-2">
//                 <input
//                   type="number"
//                   value={bidAmount}
//                   onChange={(e) => setBidAmount(e.target.value)}
//                   placeholder={`Min: ${vehicle.currentBid + 1}`}
//                   className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
//                   Place Bid
//                 </button>
//               </div>
//               {bidError && <p className="text-red-500 text-sm mt-1">{bidError}</p>}
//             </form>

//             <button
//               onClick={() => navigate('/appointments')}
//               className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
//             >
//               📅 Book Appointment for Test Drive
//             </button>
//           </div>

//           <div className="border rounded-lg overflow-hidden mb-6">
//             <h3 className="bg-gray-100 p-3 font-semibold">Specifications</h3>
//             <div className="p-4 grid grid-cols-2 gap-3 text-sm">
//               <div><span className="text-gray-500">Brand:</span> <span className="ml-2 font-medium">{vehicle.make}</span></div>
//               <div><span className="text-gray-500">Model:</span> <span className="ml-2 font-medium">{vehicle.model}</span></div>
//               <div><span className="text-gray-500">Transmission:</span> <span className="ml-2 font-medium">{vehicle.transmission}</span></div>
//               <div><span className="text-gray-500">Fuel Type:</span> <span className="ml-2 font-medium">{vehicle.fuelType}</span></div>
//               <div><span className="text-gray-500">Engine:</span> <span className="ml-2 font-medium">{vehicle.engine}</span></div>
//               <div><span className="text-gray-500">Color:</span> <span className="ml-2 font-medium">{vehicle.color}</span></div>
//               <div><span className="text-gray-500">Seller:</span> <span className="ml-2 font-medium">{vehicle.seller?.fullName || 'Unknown'}</span></div>
//             </div>
//           </div>

//           <div>
//             <h3 className="font-semibold mb-2">Description</h3>
//             <p className="text-gray-700">{vehicle.description}</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VehicleDetailsPage;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import toast from 'react-hot-toast';
import CountdownTimer from '../components/common/CountdownTimer';

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket } = useSocket(); // safe – may be null
  const [vehicle, setVehicle] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [bidError, setBidError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchVehicle = async () => {
    try {
      const { data } = await api.get(`/vehicles/${id}`);
      setVehicle(data);
    } catch (error) {
      console.error('Failed to fetch vehicle:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicle();
  }, [id]);

  // Listen for real-time auction end event
  useEffect(() => {
    if (!socket) return;
    const handleAuctionEnd = (data) => {
      if (data.auctionId === id) {
        setVehicle(prev => ({ ...prev, auctionStatus: 'closed' }));
        alert(data.winner ? `Auction ended! Winner: ${data.winner} with ₨${data.winningBid.toLocaleString()}` : 'Auction ended with no bids.');
        fetchVehicle();
      }
    };
    socket.on('auction_ended', handleAuctionEnd);
    return () => socket.off('auction_ended', handleAuctionEnd);
  }, [socket, id]);

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    const bid = parseInt(bidAmount);
    if (isNaN(bid)) {
      setBidError('Please enter a valid number');
      return;
    }
    if (bid <= vehicle.currentBid) {
      setBidError(`Bid must be higher than ₨${vehicle.currentBid.toLocaleString()}`);
      return;
    }
    if (bid > vehicle.price) {
      setBidError('Bid cannot exceed buy-it-now price');
      return;
    }
    try {
      await api.post(`/bids/${id}`, { amount: bid });
      toast.success('Bid placed successfully!');
      setBidAmount('');
      setBidError('');
      fetchVehicle();
    } catch (error) {
      setBidError(error.response?.data?.message || 'Failed to place bid');
    }
  };

  if (loading) return <div className="text-center py-10">Loading vehicle details...</div>;
  if (!vehicle) return <div className="text-center py-10">Vehicle not found</div>;

  const isAuctionActive = vehicle.auctionStatus === 'active' && vehicle.auctionEndTime && new Date(vehicle.auctionEndTime) > new Date();

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/')}>Home</span> /
        <span className="cursor-pointer hover:text-blue-600" onClick={() => navigate('/marketplace')}> Marketplace</span> /
        <span className="text-gray-800">{vehicle.title}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Image Gallery */}
        <div className="lg:w-3/5">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-100 rounded-lg overflow-hidden mb-4"
          >
            <img
              src={vehicle.images?.[selectedImage] || 'https://via.placeholder.com/800x400?text=No+Image'}
              alt={vehicle.title}
              className="w-full h-96 object-cover"
            />
          </motion.div>
          {vehicle.images && vehicle.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto">
              {vehicle.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`${vehicle.title} ${idx + 1}`}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    selectedImage === idx ? 'border-blue-600' : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Actions */}
        <div className="lg:w-2/5">
          <h1 className="text-3xl font-bold mb-2">{vehicle.title}</h1>
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <span>{vehicle.year}</span> •
            <span>{vehicle.mileage?.toLocaleString()} km</span> •
            <span>{vehicle.location}</span>
          </div>

          {/* Price & Bid */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-gray-500">Buy It Now Price</p>
                <p className="text-2xl font-bold text-blue-600">₨{vehicle.price.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Highest Bid</p>
                <p className="text-2xl font-bold text-green-600">₨{vehicle.currentBid.toLocaleString()}</p>
              </div>
            </div>

            {/* Auction Countdown Timer */}
            {vehicle.auctionEndTime && (
              <div className="bg-yellow-50 p-3 rounded-lg mb-4 text-center">
                <p className="text-sm text-gray-600">⏳ Auction ends in:</p>
                <CountdownTimer endTime={vehicle.auctionEndTime} onExpire={fetchVehicle} />
              </div>
            )}

            {/* Place Bid Form */}
            <form onSubmit={handlePlaceBid} className="mb-4">
              <label className="block text-sm font-medium mb-1">Your Bid (₨)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Min: ${vehicle.currentBid + 1}`}
                  disabled={!isAuctionActive}
                  className={`flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 ${!isAuctionActive ? 'bg-gray-100' : ''}`}
                />
                <button
                  type="submit"
                  disabled={!isAuctionActive}
                  className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${!isAuctionActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isAuctionActive ? 'Place Bid' : 'Auction Ended'}
                </button>
              </div>
              {bidError && <p className="text-red-500 text-sm mt-1">{bidError}</p>}
            </form>

            <button
              onClick={() => navigate('/appointments')}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              📅 Book Appointment for Test Drive
            </button>
          </div>

          {/* Specifications Table */}
          <div className="border rounded-lg overflow-hidden mb-6">
            <h3 className="bg-gray-100 p-3 font-semibold">Specifications</h3>
            <div className="p-4 grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Brand:</span> <span className="ml-2 font-medium">{vehicle.make}</span></div>
              <div><span className="text-gray-500">Model:</span> <span className="ml-2 font-medium">{vehicle.model}</span></div>
              <div><span className="text-gray-500">Transmission:</span> <span className="ml-2 font-medium">{vehicle.transmission}</span></div>
              <div><span className="text-gray-500">Fuel Type:</span> <span className="ml-2 font-medium">{vehicle.fuelType}</span></div>
              <div><span className="text-gray-500">Engine:</span> <span className="ml-2 font-medium">{vehicle.engine}</span></div>
              <div><span className="text-gray-500">Color:</span> <span className="ml-2 font-medium">{vehicle.color}</span></div>
              <div><span className="text-gray-500">Seller:</span> <span className="ml-2 font-medium">{vehicle.seller?.fullName || 'Unknown'}</span></div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{vehicle.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;