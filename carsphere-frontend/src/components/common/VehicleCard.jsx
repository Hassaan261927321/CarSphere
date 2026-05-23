// // import { motion } from 'framer-motion';

// // const VehicleCard = ({ image, title, price, currentBid, year, mileage, location, onClick }) => {
// //   return (
// //     <motion.div
// //       whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
// //       transition={{ duration: 0.2 }}
// //       className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
// //       onClick={onClick}
// //     >
// //       <img src={image} alt={title} className="w-full h-48 object-cover" />
// //       <div className="p-4">
// //         <h3 className="text-lg font-semibold mb-1">{title}</h3>
// //         <p className="text-gray-600 text-sm mb-2">{year} • {mileage.toLocaleString()} km • {location}</p>
// //         <div className="flex justify-between items-center">
// //           <div>
// //             <p className="text-xs text-gray-500">Price</p>
// //             <p className="text-blue-600 font-bold text-lg">₨{price.toLocaleString()}</p>
// //           </div>
// //           <div className="text-right">
// //             <p className="text-xs text-gray-500">Current Bid</p>
// //             <p className="text-green-600 font-semibold">₨{currentBid.toLocaleString()}</p>
// //           </div>
// //         </div>
// //       </div>
// //     </motion.div>
// //   );
// // };

// // export default VehicleCard;
// import { motion } from 'framer-motion';

// const VehicleCard = ({ image, title, price, currentBid, year, mileage, location, onClick }) => {
//   return (
//     <motion.div
//       whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}
//       transition={{ duration: 0.2 }}
//       className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
//       onClick={onClick}
//     >
//       <img src={image} alt={title} className="w-full h-48 object-cover" />
//       <div className="p-4">
//         <h3 className="text-lg font-semibold mb-1">{title}</h3>
//         <p className="text-gray-600 text-sm mb-2">{year} • {mileage.toLocaleString()} km • {location}</p>
//         <div className="flex justify-between items-center">
//           <div>
//             <p className="text-xs text-gray-500">Price</p>
//             <p className="text-blue-600 font-bold text-lg">₨{price.toLocaleString()}</p>
//           </div>
//           <div className="text-right">
//             <p className="text-xs text-gray-500">Current Bid</p>
//             <p className="text-green-600 font-semibold">₨{currentBid.toLocaleString()}</p>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default VehicleCard;

import { motion } from 'framer-motion';

const VehicleCard = ({ image, title, price, currentBid, year, mileage, location, onClick }) => (
  <motion.div whileHover={{ y: -5 }} className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer" onClick={onClick}>
    <img src={image} alt={title} className="w-full h-48 object-cover" />
    <div className="p-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600 text-sm">{year} • {mileage.toLocaleString()} km • {location}</p>
      <div className="flex justify-between mt-2">
        <div><p className="text-xs text-gray-500">Price</p><p className="text-blue-600 font-bold">₨{price.toLocaleString()}</p></div>
        <div><p className="text-xs text-gray-500">Current Bid</p><p className="text-green-600 font-semibold">₨{currentBid.toLocaleString()}</p></div>
      </div>
    </div>
  </motion.div>
);
export default VehicleCard;