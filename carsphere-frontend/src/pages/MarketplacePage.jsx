// import { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import VehicleCard from '../components/common/VehicleCard';
// import FilterSidebar from '../components/marketplace/FilterSidebar';
// import api from '../services/api';

// const MarketplacePage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [vehicles, setVehicles] = useState([]);
//   const [filteredVehicles, setFilteredVehicles] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchVehicles();
//     const params = new URLSearchParams(location.search);
//     const search = params.get('search');
//     if (search) setSearchQuery(search);
//   }, [location.search]);

//   const fetchVehicles = async () => {
//     setLoading(true);
//     try {
//       const { data } = await api.get('/vehicles');
//       setVehicles(data);
//       setFilteredVehicles(data);
//     } catch (error) {
//       console.error('Failed to fetch vehicles', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearch = (query) => {
//     const filtered = vehicles.filter(v =>
//       v.title.toLowerCase().includes(query.toLowerCase()) ||
//       v.location.toLowerCase().includes(query.toLowerCase()) ||
//       v.make.toLowerCase().includes(query.toLowerCase())
//     );
//     setFilteredVehicles(filtered);
//   };

//   const handleFilterChange = (filters) => {
//     let result = [...vehicles];
//     if (filters.priceRange.min) result = result.filter(v => v.price >= filters.priceRange.min);
//     if (filters.priceRange.max) result = result.filter(v => v.price <= filters.priceRange.max);
//     if (filters.brand) result = result.filter(v => v.make === filters.brand);
//     if (filters.year) result = result.filter(v => v.year === parseInt(filters.year));
//     if (searchQuery) result = result.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()));
//     setFilteredVehicles(result);
//   };

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
//       handleSearch(searchQuery);
//     } else {
//       navigate('/marketplace');
//       setFilteredVehicles(vehicles);
//     }
//   };

//   if (loading) return <div className="text-center py-10">Loading vehicles...</div>;

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
//       <form onSubmit={handleSearchSubmit} className="mb-6">
//         <div className="flex gap-2">
//           <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 p-3 border rounded-lg" />
//           <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg">Search</button>
//         </div>
//       </form>
//       <div className="flex flex-col md:flex-row gap-6">
//         <div className="md:w-1/4"><FilterSidebar onFilterChange={handleFilterChange} /></div>
//         <div className="md:w-3/4">
//           {filteredVehicles.length === 0 ? <p className="text-center">No vehicles found.</p> :
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredVehicles.map(vehicle => <VehicleCard key={vehicle._id} {...vehicle} onClick={() => navigate(`/vehicle/${vehicle._id}`)} />)}
//             </div>
//           }
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MarketplacePage;

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import VehicleCard from '../components/common/VehicleCard';
import FilterSidebar from '../components/marketplace/FilterSidebar';

import api from '../services/api';

const MarketplacePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicles();
    const params = new URLSearchParams(location.search);
    const search = params.get('search');
    if (search) setSearchQuery(search);
  }, [location.search]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/vehicles');
      setVehicles(data);
      setFilteredVehicles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    const filtered = vehicles.filter(v => v.title.toLowerCase().includes(query.toLowerCase()) || v.location.toLowerCase().includes(query.toLowerCase()) || v.make.toLowerCase().includes(query.toLowerCase()));
    setFilteredVehicles(filtered);
  };

  const handleFilterChange = (filters) => {
    let result = [...vehicles];
    if (filters.priceRange.min) result = result.filter(v => v.price >= filters.priceRange.min);
    if (filters.priceRange.max) result = result.filter(v => v.price <= filters.priceRange.max);
    if (filters.brand) result = result.filter(v => v.make === filters.brand);
    if (filters.year) result = result.filter(v => v.year === parseInt(filters.year));
    if (searchQuery) result = result.filter(v => v.title.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredVehicles(result);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
      handleSearch(searchQuery);
    } else {
      navigate('/marketplace');
      setFilteredVehicles(vehicles);
    }
  };

 if (loading) return <LoadingSkeleton type="card" count={6} />;
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="flex gap-2">
          <input type="text" placeholder="Search by make, model, city..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 p-3 border rounded-lg" />
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg">Search</button>
        </div>
      </form>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4"><FilterSidebar onFilterChange={handleFilterChange} /></div>
        <div className="md:w-3/4">
          {filteredVehicles.length === 0 ? (
            <p className="text-center">No vehicles found.</p>
          ) : (
            <AnimatePresence>
              <motion.div key={filteredVehicles.length} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map(vehicle => <VehicleCard key={vehicle._id} image={vehicle.images[0]} title={vehicle.title} price={vehicle.price} currentBid={vehicle.currentBid} year={vehicle.year} mileage={vehicle.mileage} location={vehicle.location} onClick={() => navigate(`/vehicle/${vehicle._id}`)} />)}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;