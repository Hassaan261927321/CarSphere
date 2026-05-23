

// import { useState } from 'react';
// import { motion } from 'framer-motion';

// const FilterSidebar = ({ onFilterChange }) => {
//   const [priceRange, setPriceRange] = useState({ min: '', max: '' });
//   const [brand, setBrand] = useState('');
//   const [year, setYear] = useState('');

//   const brands = ['All', 'Toyota', 'Honda', 'Suzuki', 'Kia', 'Hyundai'];
//   const years = ['All', '2024', '2023', '2022', '2021', '2020', '2019'];

//   const handleApplyFilters = () => {
//     onFilterChange({
//       priceRange,
//       brand: brand === 'All' ? '' : brand,
//       year: year === 'All' ? '' : year,
//     });
//   };

//   const handleReset = () => {
//     setPriceRange({ min: '', max: '' });
//     setBrand('');
//     setYear('');
//     onFilterChange({ priceRange: { min: '', max: '' }, brand: '', year: '' });
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, x: -20 }}
//       animate={{ opacity: 1, x: 0 }}
//       transition={{ duration: 0.3 }}
//       className="bg-gray-50 p-4 rounded-lg shadow-sm"
//     >
//       <h3 className="text-lg font-semibold mb-4">Filters</h3>
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2">Price Range (₨)</label>
//         <div className="flex gap-2">
//           <input
//             type="number"
//             placeholder="Min"
//             value={priceRange.min}
//             onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
//             className="w-1/2 p-2 border rounded"
//           />
//           <input
//             type="number"
//             placeholder="Max"
//             value={priceRange.max}
//             onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
//             className="w-1/2 p-2 border rounded"
//           />
//         </div>
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2">Brand</label>
//         <select
//           value={brand}
//           onChange={(e) => setBrand(e.target.value)}
//           className="w-full p-2 border rounded"
//         >
//           {brands.map((b) => (
//             <option key={b} value={b}>{b}</option>
//           ))}
//         </select>
//       </div>
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2">Year</label>
//         <select
//           value={year}
//           onChange={(e) => setYear(e.target.value)}
//           className="w-full p-2 border rounded"
//         >
//           {years.map((y) => (
//             <option key={y} value={y}>{y}</option>
//           ))}
//         </select>
//       </div>
//       <div className="flex gap-2">
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={handleApplyFilters}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
//         >
//           Apply Filters
//         </motion.button>
//         <motion.button
//           whileHover={{ scale: 1.02 }}
//           whileTap={{ scale: 0.98 }}
//           onClick={handleReset}
//           className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
//         >
//           Reset
//         </motion.button>
//       </div>
//     </motion.div>
//   );
// };

// export default FilterSidebar;

import { useState } from 'react';

const FilterSidebar = ({ onFilterChange }) => {
  const [priceRange, setPriceRange] = useState({ min:'', max:'' });
  const [brand, setBrand] = useState('');
  const [year, setYear] = useState('');
  const brands = ['All','Toyota','Honda','Suzuki','Kia','Hyundai'];
  const years = ['All','2024','2023','2022','2021','2020'];

  const apply = () => {
    onFilterChange({
      priceRange,
      brand: brand === 'All' ? '' : brand,
      year: year === 'All' ? '' : year,
    });
  };
  return (
    <div className="bg-gray-50 p-4 rounded shadow">
      <h3 className="font-semibold mb-3">Filters</h3>
      <div className="mb-3"><label>Price</label><div className="flex gap-2"><input type="number" placeholder="Min" value={priceRange.min} onChange={e=>setPriceRange({...priceRange,min:e.target.value})} className="w-1/2 border rounded p-1"/><input type="number" placeholder="Max" value={priceRange.max} onChange={e=>setPriceRange({...priceRange,max:e.target.value})} className="w-1/2 border rounded p-1"/></div></div>
      <div className="mb-3"><label>Brand</label><select value={brand} onChange={e=>setBrand(e.target.value)} className="w-full border rounded p-1">{brands.map(b=><option key={b}>{b}</option>)}</select></div>
      <div className="mb-3"><label>Year</label><select value={year} onChange={e=>setYear(e.target.value)} className="w-full border rounded p-1">{years.map(y=><option key={y}>{y}</option>)}</select></div>
      <button onClick={apply} className="bg-blue-600 text-white w-full py-1 rounded">Apply</button>
    </div>
  );
};
export default FilterSidebar;