// import { useState } from 'react';
// import { Link, NavLink } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '../../contexts/AuthContext';
// import NotificationBell from '../common/NotificationBell';

// const Navbar = () => {
//   const { user, logout } = useAuth();
//   const [isOpen, setIsOpen] = useState(false);

//   // Public links for all
//   const publicLinks = [
//     { path: '/', label: 'Home' },
//     { path: '/marketplace', label: 'Marketplace' },
//     { path: '/spare-parts', label: 'Spare Parts' },
//   ];

//   // Role-specific links
//   const roleLinks = {
//     buyer: [
//       { path: '/dashboard', label: 'Dashboard' },
//       { path: '/appointments', label: 'My Appointments' },
//     ],
//     seller: [
//       { path: '/dashboard', label: 'Dashboard' },
//       { path: '/my-listings', label: 'My Listings' },
//     ],
//     mechanic: [
//       { path: '/dashboard', label: 'Dashboard' },
//       { path: '/mechanic-appointments', label: 'Service Requests' },
//     ],
//     admin: [
//       { path: '/admin', label: 'Admin Panel' },
//       { path: '/dashboard', label: 'Dashboard' },
//     ],
//   };

//   const getNavLinks = () => {
//     if (!user) return publicLinks;
//     return [...publicLinks, ...(roleLinks[user.role] || [])];
//   };

//   const navLinks = getNavLinks();

//   return (
//     <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <Link to="/" className="text-2xl font-bold">Carsphere</Link>
          
//           <div className="hidden md:flex items-center space-x-6">
//             {navLinks.map(link => (
//               <NavLink key={link.path} to={link.path} className={({ isActive }) => 
//                 `hover:text-blue-400 ${isActive ? 'text-blue-400 border-b-2 border-blue-400' : ''}`
//               }>
//                 {link.label}
//               </NavLink>
//             ))}
//             {!user ? (
//               <div className="space-x-2">
//                 <Link to="/login" className="hover:text-blue-400">Login</Link>
//                 <Link to="/signup" className="bg-blue-600 px-3 py-1 rounded">Sign Up</Link>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-4">
//                 <NotificationBell />
//                 <button onClick={logout} className="bg-red-600 px-3 py-1 rounded">Logout</button>
//               </div>
//             )}
//           </div>

//           <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-2xl">
//             {isOpen ? '✕' : '☰'}
//           </button>
//         </div>

//         <AnimatePresence>
//           {isOpen && (
//             <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} className="md:hidden pb-4 space-y-2">
//               {navLinks.map(link => (
//                 <NavLink key={link.path} to={link.path} onClick={()=>setIsOpen(false)} className="block py-2 px-3 hover:bg-gray-800">
//                   {link.label}
//                 </NavLink>
//               ))}
//               {!user ? (
//                 <div className="flex flex-col space-y-2 pt-2 border-t border-gray-700">
//                   <Link to="/login" className="block py-2 px-3 hover:bg-gray-800">Login</Link>
//                   <Link to="/signup" className="block py-2 px-3 bg-blue-600 rounded text-center">Sign Up</Link>
//                 </div>
//               ) : (
//                 <button onClick={logout} className="block w-full text-left py-2 px-3 bg-red-600 rounded">Logout</button>
//               )}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import NotificationBell from '../common/NotificationBell';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/spare-parts', label: 'Spare Parts' },
  ];

  const roleLinks = {
    buyer: [{ path: '/dashboard', label: 'Dashboard' }, { path: '/appointments', label: 'Appointments' }],
    seller: [{ path: '/dashboard', label: 'Dashboard' }, { path: '/my-listings', label: 'My Listings' }],
    mechanic: [{ path: '/dashboard', label: 'Dashboard' }, { path: '/mechanic-appointments', label: 'Service Requests' }],
    admin: [{ path: '/admin', label: 'Admin Panel' }, { path: '/dashboard', label: 'Dashboard' }],
  };

  const navLinks = user ? [...publicLinks, ...(roleLinks[user.role] || [])] : publicLinks;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Carsphere
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-gray-700 dark:text-gray-300 hover:text-blue-600 transition ${isActive ? 'text-blue-600 font-semibold border-b-2 border-blue-600' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!user ? (
              <div className="flex gap-2">
                <Link to="/login" className="px-4 py-2 rounded-lg hover:bg-gray-100 transition">Login</Link>
                <Link to="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Sign Up</Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <NotificationBell />
                <button onClick={handleLogout} className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                  Logout
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-2xl focus:outline-none">
            {isOpen ? '✕' : '☰'}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }} className="md:hidden pb-4 space-y-2">
              {navLinks.map(link => (
                <NavLink key={link.path} to={link.path} onClick={()=>setIsOpen(false)} className="block py-2 px-3 rounded hover:bg-gray-100">
                  {link.label}
                </NavLink>
              ))}
              {!user ? (
                <div className="pt-2 space-y-2 border-t">
                  <Link to="/login" className="block py-2 px-3 text-center hover:bg-gray-100">Login</Link>
                  <Link to="/signup" className="block py-2 px-3 bg-blue-600 text-white rounded-lg text-center">Sign Up</Link>
                </div>
              ) : (
                <button onClick={handleLogout} className="block w-full text-left py-2 px-3 bg-red-600 text-white rounded-lg">Logout</button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};
export default Navbar;