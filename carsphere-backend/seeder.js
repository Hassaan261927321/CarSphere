// // import mongoose from 'mongoose';
// // import dotenv from 'dotenv';
// // import User from './models/User.js';
// // import Vehicle from './models/Vehicle.js';
// // import Bid from './models/Bid.js';
// // import Appointment from './models/Appointment.js';
// // import bcrypt from 'bcryptjs';

// // dotenv.config();

// // mongoose.connect(process.env.MONGO_URI);

// // // Users (same as before)
// // const sampleUsers = [
// //   {
// //     fullName: 'Admin User',
// //     email: 'admin@carsphere.com',
// //     password: 'admin123',
// //     role: 'admin',
// //     isVerified: true,
// //   },
// //   {
// //     fullName: 'Premium Seller',
// //     email: 'seller@carsphere.com',
// //     password: 'seller123',
// //     role: 'seller',
// //     isVerified: true,
// //   },
// //   {
// //     fullName: 'John Buyer',
// //     email: 'buyer@carsphere.com',
// //     password: 'buyer123',
// //     role: 'buyer',
// //     isVerified: true,
// //   },
// //   {
// //     fullName: 'Ali Mechanic',
// //     email: 'mechanic@carsphere.com',
// //     password: 'mechanic123',
// //     role: 'mechanic',
// //     isVerified: true,
// //     cnid: '12345-6789012-3',
// //     workshopAddress: 'Karachi Auto Workshop, Main Blvd',
// //     skills: ['Engine Repair', 'AC Service'],
// //     rating: 4.5,
// //   },
// // ];

// // // Generate 50 vehicles
// // const generateVehicles = (sellerId) => {
// //   const makes = ['Toyota', 'Honda', 'Suzuki', 'Kia', 'Hyundai', 'Nissan', 'Mitsubishi'];
// //   const models = {
// //     Toyota: ['Corolla', 'Camry', 'Yaris', 'Fortuner', 'Land Cruiser', 'Prado', 'Supra'],
// //     Honda: ['Civic', 'City', 'Accord', 'CR-V', 'BR-V', 'HR-V'],
// //     Suzuki: ['Swift', 'Cultus', 'Wagon R', 'Alto', 'Jimny', 'Every'],
// //     Kia: ['Sportage', 'Picanto', 'Sorento', 'Stonic', 'Carnival'],
// //     Hyundai: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Accent'],
// //     Nissan: ['Sunny', 'Juke', 'X-Trail', 'Patrol', 'Dayz'],
// //     Mitsubishi: ['Lancer', 'Pajero', 'Outlander', 'Mirage', 'ASX'],
// //   };
// //   const locations = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'];
// //   const colors = ['White', 'Black', 'Silver', 'Red', 'Blue', 'Grey', 'Green', 'Brown'];
// //   const transmissions = ['Automatic', 'Manual'];
// //   const fuelTypes = ['Petrol', 'Diesel', 'Hybrid'];
// //   const statuses = ['active', 'active', 'active', 'active', 'active', 'closed']; // mostly active

// //   const vehicles = [];
// //   for (let i = 1; i <= 50; i++) {
// //     const make = makes[Math.floor(Math.random() * makes.length)];
// //     const modelList = models[make];
// //     const model = modelList[Math.floor(Math.random() * modelList.length)];
// //     const year = 2015 + Math.floor(Math.random() * 10); // 2015-2024
// //     const basePrice = 
// //       make === 'Toyota' && model === 'Land Cruiser' ? 15000000 :
// //       make === 'Honda' && model === 'Accord' ? 9000000 :
// //       make === 'Suzuki' && model === 'Alto' ? 1800000 :
// //       2000000 + Math.floor(Math.random() * 8000000);
// //     const price = Math.round(basePrice / 100000) * 100000;
// //     const currentBid = price - Math.floor(Math.random() * 500000);
// //     const mileage = 5000 + Math.floor(Math.random() * 80000);
// //     const location = locations[Math.floor(Math.random() * locations.length)];
// //     const transmission = transmissions[Math.floor(Math.random() * transmissions.length)];
// //     const fuelType = fuelTypes[Math.floor(Math.random() * fuelTypes.length)];
// //     const color = colors[Math.floor(Math.random() * colors.length)];
// //     const engine = `${Math.floor(Math.random() * 2500 + 1000)}cc`;
// //     const description = `Well-maintained ${year} ${make} ${model} in ${color}. ${mileage.toLocaleString()} km driven. ${transmission} transmission, ${fuelType} engine. Great condition.`;
// //     const images = [
// //       `https://source.unsplash.com/featured/800x600?car&${make}-${model}`,
// //       `https://source.unsplash.com/featured/800x600?vehicle&${make}`,
// //     ];
// //     const auctionStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
// //     vehicles.push({
// //       title: `${make} ${model} ${year}`,
// //       make,
// //       model,
// //       year,
// //       price,
// //       currentBid: auctionStatus === 'active' ? currentBid : 0,
// //       mileage,
// //       location,
// //       transmission,
// //       fuelType,
// //       engine,
// //       color,
// //       description,
// //       images,
// //       auctionStatus,
// //       seller: sellerId,
// //     });
// //   }
// //   return vehicles;
// // };

// // const seedDatabase = async () => {
// //   try {
// //     // Clear existing data
// //     await User.deleteMany();
// //     await Vehicle.deleteMany();
// //     await Bid.deleteMany();
// //     await Appointment.deleteMany();
// //     console.log('Cleared existing collections');

// //     // Hash passwords
// //     const usersWithHashedPasswords = await Promise.all(
// //       sampleUsers.map(async (user) => ({
// //         ...user,
// //         password: await bcrypt.hash(user.password, 10),
// //       }))
// //     );

// //     const createdUsers = await User.insertMany(usersWithHashedPasswords);
// //     console.log(`Inserted ${createdUsers.length} users`);

// //     const seller = createdUsers.find(u => u.role === 'seller');
// //     const buyer = createdUsers.find(u => u.role === 'buyer');
// //     const mechanic = createdUsers.find(u => u.role === 'mechanic');

// //     // Generate 50 vehicles
// //     const vehiclesToInsert = generateVehicles(seller._id);
// //     const createdVehicles = await Vehicle.insertMany(vehiclesToInsert);
// //     console.log(`Inserted ${createdVehicles.length} vehicles`);

// //     // Create sample bids (20 random bids on active vehicles)
// //     const activeVehicles = createdVehicles.filter(v => v.auctionStatus === 'active');
// //     const sampleBids = [];
// //     for (let i = 0; i < Math.min(20, activeVehicles.length); i++) {
// //       const vehicle = activeVehicles[i];
// //       const bidAmount = vehicle.currentBid + Math.floor(Math.random() * 100000) + 10000;
// //       sampleBids.push({
// //         vehicle: vehicle._id,
// //         bidder: buyer._id,
// //         amount: Math.min(bidAmount, vehicle.price),
// //       });
// //     }
// //     if (sampleBids.length) {
// //       await Bid.insertMany(sampleBids);
// //       console.log(`Inserted ${sampleBids.length} sample bids`);
// //     }

// //     // Create sample appointments
// //     const sampleAppointments = [
// //       {
// //         vehicle: createdVehicles[0]._id,
// //         customer: buyer._id,
// //         mechanic: mechanic._id,
// //         date: new Date('2025-06-01'),
// //         time: '10:00 AM',
// //         status: 'pending',
// //         type: 'test-drive',
// //       },
// //       {
// //         vehicle: createdVehicles[1]._id,
// //         customer: buyer._id,
// //         mechanic: mechanic._id,
// //         date: new Date('2025-06-05'),
// //         time: '2:30 PM',
// //         status: 'confirmed',
// //         type: 'service',
// //       },
// //     ];
// //     await Appointment.insertMany(sampleAppointments);
// //     console.log(`Inserted ${sampleAppointments.length} appointments`);

// //     console.log('✅ Database seeded successfully with 50 vehicles!');
// //     process.exit();
// //   } catch (error) {
// //     console.error('❌ Error seeding database:', error);
// //     process.exit(1);
// //   }
// // };

// // seedDatabase();


// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import User from './models/User.js';
// import Vehicle from './models/Vehicle.js';
// import Bid from './models/Bid.js';
// import Appointment from './models/Appointment.js';
// import SparePart from './models/SparePart.js';
// import Order from './models/Order.js';
// import Notification from './models/Notification.js';
// import bcrypt from 'bcryptjs';

// dotenv.config();
// mongoose.connect(process.env.MONGO_URI);

// const users = [{ fullName: 'Admin User', email: 'admin@carsphere.com', password: 'admin123', role: 'admin', isVerified: true },
//   { fullName: 'Buyer One', email: 'buyer@carsphere.com', password: 'buyer123', role: 'buyer', isVerified: true },
//   { fullName: 'Seller One', email: 'seller@carsphere.com', password: 'seller123', role: 'seller', isVerified: true },
//   { fullName: 'Mechanic One', email: 'mechanic@carsphere.com', password: 'mechanic123', role: 'mechanic', isVerified: true, cnid: '12345-6789012-3', workshopAddress: '123 Auto Street, Lahore', skills: ['Engine Repair', 'Oil Change'], rating: 4.5 },
// ];
// const vehicles = [
//   {
//     seller: null, // will be replaced with seller's ObjectId after seeding
//     title: 'Toyota Corolla 2022',
//     make: 'Toyota',
//     model: 'Corolla',
//     year: 2022,
//     price: 4500000,
//     currentBid: 4200000,
//     mileage: 15000,
//     location: 'Karachi',
//     transmission: 'Automatic',
//     fuelType: 'Petrol',
//     engine: '1.8L 4-Cylinder',
//     color: 'White',
//     description: 'Excellent condition, full service history.',
//     images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500'],
//     auctionStatus: 'active',
//     auctionEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
//   },
//   {
//     title: 'Honda Civic 2023',
//     make: 'Honda',
//     model: 'Civic',
//     year: 2023,
//     price: 5200000,
//     currentBid: 5000000,
//     mileage: 8000,
//     location: 'Lahore',
//     transmission: 'Automatic',
//     fuelType: 'Petrol',
//     engine: '1.5L Turbo',
//     color: 'Black',
//     description: 'Like new, fully loaded.',
//     images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500'],
//     auctionStatus: 'active',
//     auctionEndTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
//   },
//   {
//     title: 'Suzuki Swift 2021',
//     make: 'Suzuki',
//     model: 'Swift',
//     year: 2021,
//     price: 2800000,
//     currentBid: 2600000,
//     mileage: 25000,
//     location: 'Islamabad',
//     transmission: 'Manual',
//     fuelType: 'Petrol',
//     engine: '1.2L',
//     color: 'Red',
//     description: 'Good fuel economy, well maintained.',
//     images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500'],
//     auctionStatus: 'active',
//     auctionEndTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
//   },
//   {
//     title: 'Kia Sportage 2023',
//     make: 'Kia',
//     model: 'Sportage',
//     year: 2023,
//     price: 6200000,
//     currentBid: 6000000,
//     mileage: 5000,
//     location: 'Rawalpindi',
//     transmission: 'Automatic',
//     fuelType: 'Petrol',
//     engine: '2.0L',
//     color: 'Blue',
//     description: 'SUV, fully loaded.',
//     images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500'],
//     auctionStatus: 'active',
//     auctionEndTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
//   },
//   {
//     title: 'Toyota Yaris 2020',
//     make: 'Toyota',
//     model: 'Yaris',
//     year: 2020,
//     price: 3200000,
//     currentBid: 3000000,
//     mileage: 35000,
//     location: 'Karachi',
//     transmission: 'Automatic',
//     fuelType: 'Petrol',
//     engine: '1.3L',
//     color: 'Silver',
//     description: 'Well maintained, good condition.',
//     images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500'],
//     auctionStatus: 'active',
//     auctionEndTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
//   },
// ];

// const spareParts = [
//   {
//     name: 'Engine Oil 5W-30',
//     price: 3500,
//     image: 'https://via.placeholder.com/200?text=Engine+Oil',
//     category: 'Engine',
//     stock: 100,
//     description: 'High quality synthetic oil.',
//   },
//   {
//     name: 'Brake Pads (Front)',
//     price: 2500,
//     image: 'https://via.placeholder.com/200?text=Brake+Pads',
//     category: 'Brakes',
//     stock: 50,
//     description: 'Ceramic brake pads for all sedans.',
//   },
//   {
//     name: 'Car Battery 12V',
//     price: 8500,
//     image: 'https://via.placeholder.com/200?text=Car+Battery',
//     category: 'Electrical',
//     stock: 20,
//     description: 'Maintenance-free battery.',
//   },
//   {
//     name: 'Air Filter',
//     price: 800,
//     image: 'https://via.placeholder.com/200?text=Air+Filter',
//     category: 'Engine',
//     stock: 150,
//     description: 'Reusable air filter.',
//   },
// ];

// const appointments = [
//   {
//     vehicle: null, // will fill after vehicle IDs
//     customer: null, // will fill after user IDs
//     mechanic: null,
//     date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
//     time: '10:00 AM',
//     status: 'pending',
//     type: 'test-drive',
//   },
//   {
//     vehicle: null,
//     customer: null,
//     mechanic: null,
//     date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
//     time: '2:00 PM',
//     status: 'confirmed',
//     type: 'service',
//   },
// ];

// const importData = async () => {
//   try {
//     await User.deleteMany();
//     await Vehicle.deleteMany();
//     await Bid.deleteMany();
//     await Appointment.deleteMany();
//     await SparePart.deleteMany();
//     await Order.deleteMany();
//     await Notification.deleteMany();
//     console.log('Data cleared...');

//     // Hash passwords
//     const salt = await bcrypt.genSalt(10);
//     const hashedUsers = await Promise.all(users.map(async (user) => ({
//       ...user,
//       password: await bcrypt.hash(user.password, salt)
//     })));
//     const createdUsers = await User.insertMany(hashedUsers);
//     console.log('Users inserted');

//     const seller = createdUsers.find(u => u.role === 'seller');
//     const buyer = createdUsers.find(u => u.role === 'buyer');
//     const mechanic = createdUsers.find(u => u.role === 'mechanic');

//     // Vehicles with seller reference
//     const vehiclesWithSeller = vehicles.map(v => ({ ...v, seller: seller._id }));
//     const createdVehicles = await Vehicle.insertMany(vehiclesWithSeller);
//     console.log('Vehicles inserted');

//     // Sample bids (using buyer as bidder)
//     const sampleBids = createdVehicles.map(v => ({
//       vehicle: v._id,
//       bidder: buyer._id,
//       amount: v.currentBid - 50000
//     }));
//     await Bid.insertMany(sampleBids);
//     console.log('Sample bids inserted');

//     await SparePart.insertMany(spareParts);
//     console.log('Spare parts inserted');

//     const appointmentsWithRefs = appointments.map(apt => ({
//       ...apt,
//       vehicle: createdVehicles[0]._id,
//       customer: buyer._id,
//       mechanic: mechanic._id
//     }));
//     await Appointment.insertMany(appointmentsWithRefs);
//     console.log('Appointments inserted');

//     console.log('✅ All data imported successfully!');
//     process.exit();
//   } catch (error) {
//     console.error(`❌ Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// const destroyData = async () => {
//   try {
//     await User.deleteMany();
//     await Vehicle.deleteMany();
//     await Bid.deleteMany();
//     await Appointment.deleteMany();
//     await SparePart.deleteMany();
//     await Order.deleteMany();
//     await Notification.deleteMany();
//     console.log('Data destroyed!');
//     process.exit();
//   } catch (error) {
//     console.error(`Error: ${error.message}`);
//     process.exit(1);
//   }
// };

// if (process.argv[2] === '-d') {
//   destroyData();
// } else {
//   importData();
// }


import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Vehicle from './models/Vehicle.js';
import Bid from './models/Bid.js';
import Appointment from './models/Appointment.js';
import SparePart from './models/SparePart.js';
import Order from './models/Order.js';
import Notification from './models/Notification.js';

dotenv.config();

const users = [
  { fullName: 'Admin User', email: 'admin@carsphere.com', password: 'admin123', role: 'admin', isVerified: true },
  { fullName: 'Buyer One', email: 'buyer@carsphere.com', password: 'buyer123', role: 'buyer', isVerified: true },
  { fullName: 'Seller One', email: 'seller@carsphere.com', password: 'seller123', role: 'seller', isVerified: true },
  { fullName: 'Mechanic One', email: 'mechanic@carsphere.com', password: 'mechanic123', role: 'mechanic', isVerified: true, cnid: '12345-6789012-3', workshopAddress: '123 Auto Street, Lahore', skills: ['Engine Repair', 'Oil Change'], rating: 4.5 },
];

const vehicles = [
  {
    title: 'Toyota Corolla 2022',
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    price: 4500000,
    currentBid: 4200000,
    mileage: 15000,
    location: 'Karachi',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engine: '1.8L 4-Cylinder',
    color: 'White',
    description: 'Excellent condition, full service history.',
    images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500'],
    auctionStatus: 'active',
    auctionEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Honda Civic 2023',
    make: 'Honda',
    model: 'Civic',
    year: 2023,
    price: 5200000,
    currentBid: 5000000,
    mileage: 8000,
    location: 'Lahore',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engine: '1.5L Turbo',
    color: 'Black',
    description: 'Like new, fully loaded.',
    images: ['https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500'],
    auctionStatus: 'active',
    auctionEndTime: new Date(Date.now() + 300 * 1000),
  },
  {
    title: 'Suzuki Swift 2021',
    make: 'Suzuki',
    model: 'Swift',
    year: 2021,
    price: 2800000,
    currentBid: 2600000,
    mileage: 25000,
    location: 'Islamabad',
    transmission: 'Manual',
    fuelType: 'Petrol',
    engine: '1.2L',
    color: 'Red',
    description: 'Good fuel economy, well maintained.',
    images: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500'],
    auctionStatus: 'active',
    auctionEndTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Kia Sportage 2023',
    make: 'Kia',
    model: 'Sportage',
    year: 2023,
    price: 6200000,
    currentBid: 6000000,
    mileage: 5000,
    location: 'Rawalpindi',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engine: '2.0L',
    color: 'Blue',
    description: 'SUV, fully loaded.',
    images: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500'],
    auctionStatus: 'active',
    auctionEndTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Toyota Yaris 2020',
    make: 'Toyota',
    model: 'Yaris',
    year: 2020,
    price: 3200000,
    currentBid: 3000000,
    mileage: 35000,
    location: 'Karachi',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    engine: '1.3L',
    color: 'Silver',
    description: 'Well maintained, good condition.',
    images: ['https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500'],
    auctionStatus: 'active',
    auctionEndTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
  },
];

const spareParts = [
  { name: 'Engine Oil 5W-30', price: 3500, image: 'https://via.placeholder.com/200?text=Engine+Oil', category: 'Engine', stock: 100, description: 'High quality synthetic oil.' },
  { name: 'Brake Pads (Front)', price: 2500, image: 'https://via.placeholder.com/200?text=Brake+Pads', category: 'Brakes', stock: 50, description: 'Ceramic brake pads for all sedans.' },
  { name: 'Car Battery 12V', price: 8500, image: 'https://via.placeholder.com/200?text=Car+Battery', category: 'Electrical', stock: 20, description: 'Maintenance-free battery.' },
  { name: 'Air Filter', price: 800, image: 'https://via.placeholder.com/200?text=Air+Filter', category: 'Engine', stock: 150, description: 'Reusable air filter.' },
];

const appointments = [
  { date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), time: '10:00 AM', status: 'pending', type: 'test-drive' },
  { date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), time: '2:00 PM', status: 'confirmed', type: 'service' },
];

const importData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Vehicle.deleteMany();
    await Bid.deleteMany();
    await Appointment.deleteMany();
    await SparePart.deleteMany();
    await Order.deleteMany();
    await Notification.deleteMany();
    console.log('Data cleared...');

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedUsers = await Promise.all(users.map(async (user) => ({
      ...user,
      password: await bcrypt.hash(user.password, salt)
    })));
    const createdUsers = await User.insertMany(hashedUsers);
    console.log('Users inserted');

    const seller = createdUsers.find(u => u.role === 'seller');
    const buyer = createdUsers.find(u => u.role === 'buyer');
    const mechanic = createdUsers.find(u => u.role === 'mechanic');

    // Vehicles with seller reference
    const vehiclesWithSeller = vehicles.map(v => ({ ...v, seller: seller._id }));
    const createdVehicles = await Vehicle.insertMany(vehiclesWithSeller);
    console.log('Vehicles inserted');

    // Sample bids
    const sampleBids = createdVehicles.map(v => ({
      vehicle: v._id,
      bidder: buyer._id,
      amount: v.currentBid - 50000
    }));
    await Bid.insertMany(sampleBids);
    console.log('Sample bids inserted');

    await SparePart.insertMany(spareParts);
    console.log('Spare parts inserted');

    const appointmentsWithRefs = appointments.map(apt => ({
      ...apt,
      vehicle: createdVehicles[0]._id,
      customer: buyer._id,
      mechanic: mechanic._id
    }));
    await Appointment.insertMany(appointmentsWithRefs);
    console.log('Appointments inserted');

    console.log('✅ All data imported successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    await mongoose.disconnect();
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    await User.deleteMany();
    await Vehicle.deleteMany();
    await Bid.deleteMany();
    await Appointment.deleteMany();
    await SparePart.deleteMany();
    await Order.deleteMany();
    await Notification.deleteMany();
    console.log('Data destroyed!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    await mongoose.disconnect();
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}