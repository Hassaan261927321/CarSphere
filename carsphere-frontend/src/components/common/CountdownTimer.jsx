// // // import { useState, useEffect } from 'react';

// // // const CountdownTimer = ({ endTime, onExpire }) => {
// // //   const [timeLeft, setTimeLeft] = useState('');
// // //   const [expired, setExpired] = useState(false);

// // //   useEffect(() => {
// // //     const interval = setInterval(() => {
// // //       const end = new Date(endTime);
// // //       const now = new Date();
// // //       const diff = end - now;
// // //       if (diff <= 0) {
// // //         setTimeLeft('Auction ended');
// // //         setExpired(true);
// // //         clearInterval(interval);
// // //         if (onExpire) onExpire();
// // //       } else {
// // //         const hours = Math.floor(diff / (1000 * 60 * 60));
// // //         const minutes = Math.floor((diff % (3600000)) / 60000);
// // //         const seconds = Math.floor((diff % 60000) / 1000);
// // //         setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
// // //       }
// // //     }, 1000);
// // //     return () => clearInterval(interval);
// // //   }, [endTime, onExpire]);

// // //   return <span className={`font-bold ${expired ? 'text-red-600' : 'text-green-600'}`}>{timeLeft}</span>;
// // // };

// // // export default CountdownTimer;

// // import { useState, useEffect } from 'react';

// // const CountdownTimer = ({ endTime, onExpire }) => {
// //   const [timeLeft, setTimeLeft] = useState('');
// //   const [expired, setExpired] = useState(false);

// //   useEffect(() => {
// //     const interval = setInterval(() => {
// //       const end = new Date(endTime);
// //       const now = new Date();
// //       const diff = end - now;
// //       if (diff <= 0) {
// //         setTimeLeft('Auction ended');
// //         setExpired(true);
// //         clearInterval(interval);
// //         if (onExpire) onExpire();
// //       } else {
// //         const hours = Math.floor(diff / (1000 * 60 * 60));
// //         const minutes = Math.floor((diff % (3600000)) / 60000);
// //         const seconds = Math.floor((diff % 60000) / 1000);
// //         setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
// //       }
// //     }, 1000);
// //     return () => clearInterval(interval);
// //   }, [endTime, onExpire]);

// //   return <span className={`font-bold ${expired ? 'text-red-600' : 'text-green-600'}`}>{timeLeft}</span>;
// // };

// // export default CountdownTimer;

// import { useState, useEffect } from 'react';

// const CountdownTimer = ({ endTime, onExpire }) => {
//   const [timeLeft, setTimeLeft] = useState('');
//   const [expired, setExpired] = useState(false);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const end = new Date(endTime);
//       const now = new Date();
//       const diff = end - now;
//       if (diff <= 0) {
//         setTimeLeft('Auction ended');
//         setExpired(true);
//         clearInterval(interval);
//         if (onExpire) onExpire();
//       } else {
//         const hours = Math.floor(diff / (1000 * 60 * 60));
//         const minutes = Math.floor((diff % (3600000)) / 60000);
//         const seconds = Math.floor((diff % 60000) / 1000);
//         setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
//       }
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [endTime, onExpire]);

//   return <span className={`font-bold ${expired ? 'text-red-600' : 'text-green-600'}`}>{timeLeft}</span>;
// };

// export default CountdownTimer;

import { useState, useEffect } from 'react';

const CountdownTimer = ({ endTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const end = new Date(endTime);
      const now = new Date();
      const diff = end - now;
      if (diff <= 0) {
        setTimeLeft('Auction ended');
        setExpired(true);
        clearInterval(interval);
        if (onExpire) onExpire();
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (3600000)) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime, onExpire]);

  return <span className={`font-bold ${expired ? 'text-red-600' : 'text-green-600'}`}>{timeLeft}</span>;
};

export default CountdownTimer;