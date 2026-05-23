// import { useState } from 'react';

// const Sidebar = ({ activeTab, setActiveTab, userRole }) => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const getNavItems = () => {
//     const items = [{ id: 'appointments', label: 'Appointments', icon: '📅' }];
//     if (userRole === 'seller') {
//       items.unshift({ id: 'listings', label: 'My Listings', icon: '🚗' });
//     } else if (userRole === 'buyer') {
//       items.unshift({ id: 'bids', label: 'My Bids', icon: '💰' });
//     } else if (userRole === 'mechanic') {
//       items.unshift({ id: 'serviceRequests', label: 'Service Requests', icon: '🔧' });
//     }
//     return items;
//   };

//   const navItems = getNavItems();

//   return (
//     <>
//       {/* Mobile menu button */}
//       <div className="md:hidden mb-4">
//         <button
//           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           className="w-full bg-gray-800 text-white p-2 rounded flex justify-between items-center"
//         >
//           <span>Menu</span>
//           <span>{isMobileMenuOpen ? '✕' : '☰'}</span>
//         </button>
//       </div>

//       {/* Sidebar navigation */}
//       <div
//         className={`${
//           isMobileMenuOpen ? 'block' : 'hidden'
//         } md:block md:w-64 bg-gray-800 text-white rounded-lg p-4 space-y-2`}
//       >
//         <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Dashboard</h2>
//         {navItems.map((item) => (
//           <button
//             key={item.id}
//             onClick={() => {
//               setActiveTab(item.id);
//               setIsMobileMenuOpen(false);
//             }}
//             className={`w-full text-left px-3 py-2 rounded transition flex items-center gap-2 ${
//               activeTab === item.id
//                 ? 'bg-blue-600 text-white'
//                 : 'hover:bg-gray-700 text-gray-300'
//             }`}
//           >
//             <span className="text-lg">{item.icon}</span>
//             {item.label}
//           </button>
//         ))}
//       </div>
//     </>
//   );
// };

// export default Sidebar;

import { motion } from 'framer-motion';

const Sidebar = ({ activeTab, setActiveTab, userRole }) => {
  const getNavItems = () => {
    const items = [{ id: 'appointments', label: 'Appointments', icon: '📅' }];
    if (userRole === 'seller') items.unshift({ id: 'listings', label: 'My Listings', icon: '🚗' });
    else if (userRole === 'buyer') items.unshift({ id: 'bids', label: 'My Bids', icon: '💰' });
    else if (userRole === 'mechanic') items.unshift({ id: 'serviceRequests', label: 'Service Requests', icon: '🔧' });
    return items;
  };

  const navItems = getNavItems();

  return (
    <div className="bg-gray-800 text-white rounded-lg p-4 space-y-2">
      <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Dashboard</h2>
      {navItems.map((item) => (
        <motion.button
          key={item.id}
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setActiveTab(item.id)}
          className={`w-full text-left px-3 py-2 rounded transition flex items-center gap-2 ${
            activeTab === item.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          {item.label}
        </motion.button>
      ))}
    </div>
  );
};

export default Sidebar;