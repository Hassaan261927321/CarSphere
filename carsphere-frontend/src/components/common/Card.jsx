// const Card = ({ image, title, price, year, mileage, location, onClick }) => {
//   return (
//     <div 
//       className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
//       onClick={onClick}
//     >
//       <img src={image} alt={title} className="w-full h-48 object-cover" />
//       <div className="p-4">
//         <h3 className="text-lg font-semibold mb-1">{title}</h3>
//         <p className="text-blue-600 font-bold text-xl mb-2">${price.toLocaleString()}</p>
//         <div className="text-gray-600 text-sm space-y-1">
//           <p>📅 {year} • 📍 {mileage.toLocaleString()} km</p>
//           <p>📍 {location}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Card;


import { motion } from 'framer-motion';

const Card = ({ image, title, price, year, mileage, location, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-blue-600 font-bold text-xl mb-2">₨{price.toLocaleString()}</p>
        <div className="text-gray-600 text-sm space-y-1">
          <p>📅 {year} • 📍 {mileage.toLocaleString()} km</p>
          <p>📍 {location}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default Card;