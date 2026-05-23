
// import { Outlet } from 'react-router-dom';
// import Navbar from './Navbar';
// import Footer from './Footer';
// import Chatbot from '../chatbot/Chatbot';

// const Layout = () => {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <Navbar />
//       <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <Outlet />
//       </main>
//       <Footer />
//       <Chatbot />
//     </div>
//   );
// };

// export default Layout;
// // import { Outlet } from 'react-router-dom';
// // import Navbar from './Navbar';
// // import Footer from './Footer';
// // import Chatbot from '../chatbot/Chatbot'; // optional

// // const Layout = () => {
// //   return (
// //     <div className="flex flex-col min-h-screen">
// //       <Navbar />
// //       <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6">
// //         <Outlet />
// //       </main>
// //       <Footer />
// //       {/* <Chatbot /> */}
// //     </div>
// //   );
// // };

// // export default Layout;


import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from '../chatbot/Chatbot';

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        <Outlet />
      </motion.main>
      <Footer />
      <Chatbot />
    </div>
  );
};
export default Layout;