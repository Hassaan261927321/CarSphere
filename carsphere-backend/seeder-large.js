import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import User from './models/User.js';
import Vehicle from './models/Vehicle.js';
import Bid from './models/Bid.js';
import Appointment from './models/Appointment.js';
import SparePart from './models/SparePart.js';
import Order from './models/Order.js';
import Notification from './models/Notification.js';

dotenv.config();

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --------------------------------------------------------------
// Data pools (corrected categories)
// --------------------------------------------------------------
const MAKES = ['Toyota', 'Honda', 'Suzuki', 'Kia', 'Hyundai', 'Audi', 'BMW', 'Mercedes', 'Ford', 'Mazda', 'Nissan', 'Chevrolet', 'Daihatsu', 'Subaru', 'Volkswagen'];
const MODELS = {
  Toyota: ['Corolla', 'Yaris', 'Camry', 'Fortuner', 'Hilux', 'Land Cruiser', 'Prado', 'Passo', 'Vitz', 'Premio', 'Allion', 'Axio', 'Belta', 'Crown'],
  Honda: ['Civic', 'City', 'Accord', 'Fit', 'Jazz', 'HR-V', 'CR-V', 'Odyssey'],
  Suzuki: ['Swift', 'Cultus', 'Wagon R', 'Alto', 'Mehran', 'Every', 'Jimny'],
  Kia: ['Sportage', 'Picanto', 'Sorento', 'Stonic', 'Cerato'],
  Hyundai: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Accent'],
  Audi: ['A4', 'A6', 'Q5', 'Q7', 'R8'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5', 'i8'],
  Mercedes: ['C Class', 'E Class', 'S Class', 'GLC', 'GLE'],
  Ford: ['Fiesta', 'Focus', 'Mustang', 'Ranger', 'Explorer'],
  Mazda: ['3', '6', 'CX-5', 'MX-5'],
  Nissan: ['Sunny', 'Altima', 'Juke', 'X-Trail'],
  Chevrolet: ['Spark', 'Cruze', 'Malibu', 'Camaro'],
  Daihatsu: ['Mira', 'Cuore', 'Move', 'Boon'],
  Subaru: ['Impreza', 'Legacy', 'Forester', 'Outback'],
  Volkswagen: ['Golf', 'Jetta', 'Passat', 'Tiguan']
};

const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG'];
const TRANSMISSIONS = ['Automatic', 'Manual'];
const COLORS = ['White', 'Black', 'Silver', 'Red', 'Blue', 'Grey', 'Green', 'Yellow', 'Orange', 'Maroon', 'Gold'];
const LOCATIONS = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Quetta', 'Multan', 'Faisalabad', 'Gujranwala', 'Sialkot'];

// ✅ Fixed categories – only the enum values allowed by your SparePart model
const PARTS_CATEGORIES = ['Engine', 'Brakes', 'Suspension', 'Electrical', 'Accessories'];

const PARTS_NAMES = [
  'Engine Oil', 'Brake Pads', 'Air Filter', 'Oil Filter', 'Fuel Filter', 'Spark Plugs', 'Battery', 'Alternator', 'Starter Motor',
  'Radiator', 'Water Pump', 'Timing Belt', 'Drive Belt', 'Clutch Kit', 'Brake Disc', 'Brake Caliper', 'Shock Absorber', 'Strut',
  'Control Arm', 'Ball Joint', 'Tie Rod', 'CV Axle', 'Wheel Bearing', 'Exhaust Pipe', 'Muffler', 'Catalytic Converter',
  'Headlight', 'Tail Light', 'Turn Signal', 'Fog Light', 'Wiper Blade', 'Windshield', 'Door Handle', 'Side Mirror', 'Fender',
  'Bumper', 'Hood', 'Trunk Lid', 'Seat Cover', 'Floor Mat', 'Steering Wheel', 'Gear Knob', 'Dashboard Panel', 'AC Compressor',
  'Heater Core', 'Blower Motor', 'Temperature Sensor', 'O2 Sensor', 'Mass Air Flow Sensor', 'Throttle Body', 'Fuel Injector',
  'Fuel Pump', 'Ignition Coil', 'ECU', 'Fuse Box', 'Relay', 'Wire Harness'
];

// --------------------------------------------------------------
// Generate functions (unchanged)
// --------------------------------------------------------------
const generateVehicle = (sellerId) => {
  const make = random(MAKES);
  const model = random(MODELS[make] || [make]);
  const year = faker.date.between({ from: '2010-01-01', to: '2025-01-01' }).getFullYear();
  const price = faker.number.int({ min: 800000, max: 12000000 });
  const currentBid = Math.round(price * faker.number.float({ min: 0.6, max: 0.95 }) / 1000) * 1000;
  const mileage = faker.number.int({ min: 1000, max: 200000 });
  const location = random(LOCATIONS);
  const transmission = random(TRANSMISSIONS);
  const fuelType = random(FUEL_TYPES);
  const engine = `${faker.number.int({ min: 1, max: 3 })}.${faker.number.int({ min: 0, max: 9 })}L ${faker.vehicle.fuel()}`;
  const color = random(COLORS);
  const description = faker.lorem.sentence();
  const images = [`https://picsum.photos/id/${faker.number.int({ min: 1, max: 200 })}/800/600`];
  const auctionStatus = Math.random() < 0.8 ? 'active' : 'closed';
  let auctionEndTime = null;
  if (auctionStatus === 'active') {
    auctionEndTime = faker.date.future({ years: 0.5 });
  }
  return {
    seller: sellerId,
    title: `${make} ${model} ${year}`,
    make,
    model,
    year,
    price,
    currentBid,
    mileage,
    location,
    transmission,
    fuelType,
    engine,
    color,
    description,
    images,
    auctionStatus,
    auctionEndTime,
  };
};

const generateSparePart = () => {
  const name = random(PARTS_NAMES) + (Math.random() > 0.7 ? ` ${faker.commerce.productMaterial()}` : '');
  const price = faker.number.int({ min: 200, max: 50000 });
  const stock = faker.number.int({ min: 0, max: 500 });
  const category = random(PARTS_CATEGORIES); // now uses only valid categories
  const description = faker.commerce.productDescription();
  const image = `https://picsum.photos/id/${faker.number.int({ min: 1, max: 200 })}/200/200`;
  return { name, price, stock, category, description, image };
};

// --------------------------------------------------------------
// Main seed function
// --------------------------------------------------------------
const seedLarge = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear data (optional – uncomment if you want fresh start)
    await User.deleteMany();
    await Vehicle.deleteMany();
    await Bid.deleteMany();
    await Appointment.deleteMany();
    await SparePart.deleteMany();
    await Order.deleteMany();
    await Notification.deleteMany();
    console.log('Data cleared');

    // Create base users
    const salt = await bcrypt.genSalt(10);
    const usersData = [
      { fullName: 'Admin User', email: 'admin@carsphere.com', password: await bcrypt.hash('admin123', salt), role: 'admin', isVerified: true },
      { fullName: 'Buyer One', email: 'buyer@carsphere.com', password: await bcrypt.hash('buyer123', salt), role: 'buyer', isVerified: true },
      { fullName: 'Seller One', email: 'seller@carsphere.com', password: await bcrypt.hash('seller123', salt), role: 'seller', isVerified: true },
      { fullName: 'Mechanic One', email: 'mechanic@carsphere.com', password: await bcrypt.hash('mechanic123', salt), role: 'mechanic', isVerified: true, cnid: '12345-6789012-3', workshopAddress: '123 Auto Street, Lahore', skills: ['Engine Repair', 'Oil Change'], rating: 4.5 },
    ];
    const createdUsers = await User.insertMany(usersData);
    console.log('Users created');

    const seller = createdUsers.find(u => u.role === 'seller');
    const buyer = createdUsers.find(u => u.role === 'buyer');
    const mechanic = createdUsers.find(u => u.role === 'mechanic');

    // Vehicles
    const vehicles = [];
    for (let i = 0; i < 500; i++) {
      vehicles.push(generateVehicle(seller._id));
    }
    const createdVehicles = await Vehicle.insertMany(vehicles);
    console.log(`Inserted ${createdVehicles.length} vehicles`);

    // Bids
    const bids = [];
    for (const vehicle of createdVehicles) {
      const numBids = faker.number.int({ min: 0, max: 5 });
      for (let j = 0; j < numBids; j++) {
        const amount = vehicle.currentBid - faker.number.int({ min: 5000, max: 200000 });
        if (amount > 0) {
          bids.push({
            vehicle: vehicle._id,
            bidder: buyer._id,
            amount: Math.round(amount / 1000) * 1000,
          });
        }
      }
    }
    await Bid.insertMany(bids);
    console.log(`Inserted ${bids.length} bids`);

    // Spare parts (250)
    const parts = [];
    for (let i = 0; i < 250; i++) {
      parts.push(generateSparePart());
    }
    await SparePart.insertMany(parts);
    console.log(`Inserted ${parts.length} spare parts`);

    // Appointments
    const appointments = [];
    for (let i = 0; i < 30; i++) {
      const vehicle = random(createdVehicles);
      appointments.push({
        vehicle: vehicle._id,
        customer: buyer._id,
        mechanic: mechanic._id,
        date: faker.date.future(),
        time: `${faker.number.int({ min: 9, max: 17 })}:00`,
        status: random(['pending', 'confirmed', 'completed', 'cancelled']),
        type: random(['test-drive', 'service']),
      });
    }
    await Appointment.insertMany(appointments);
    console.log(`Inserted ${appointments.length} appointments`);

    console.log('✅ Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedLarge();