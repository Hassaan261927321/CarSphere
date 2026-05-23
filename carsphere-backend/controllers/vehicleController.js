import Vehicle from '../models/Vehicle.js';

export const getVehicles = async (req, res) => {
  const { search, brand, minPrice, maxPrice, year } = req.query;
  let filter = { auctionStatus: 'active' };
  if (search) filter.title = { $regex: search, $options: 'i' };
  if (brand) filter.make = brand;
  if (minPrice || maxPrice) filter.price = {};
  if (minPrice) filter.price.$gte = Number(minPrice);
  if (maxPrice) filter.price.$lte = Number(maxPrice);
  if (year) filter.year = Number(year);
  const vehicles = await Vehicle.find(filter).populate('seller', 'fullName email');
  res.json(vehicles);
};

export const getVehicleById = async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id).populate('seller', 'fullName email');
  if (vehicle) res.json(vehicle);
  else res.status(404).json({ message: 'Vehicle not found' });
};

export const createVehicle = async (req, res) => {
  const { title, make, model, year, price, mileage, location, images, description } = req.body;
  const vehicle = await Vehicle.create({
    seller: req.user._id,
    title,
    make,
    model,
    year,
    price,
    mileage,
    location,
    images,
    description,
  });
  res.status(201).json(vehicle);
};

export const getSellerVehicles = async (req, res) => {
  const vehicles = await Vehicle.find({ seller: req.user._id });
  res.json(vehicles);
};
// @desc    Update a vehicle listing
// @route   PUT /api/vehicles/:id
// @access  Private/Seller (only owner)
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    if (vehicle.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this listing' });
    }
    const {
      title, make, model, year, price, mileage, location,
      transmission, fuelType, engine, color, description, images,
      auctionStatus, auctionEndTime
    } = req.body;
    vehicle.title = title || vehicle.title;
    vehicle.make = make || vehicle.make;
    vehicle.model = model || vehicle.model;
    vehicle.year = year || vehicle.year;
    vehicle.price = price || vehicle.price;
    vehicle.mileage = mileage || vehicle.mileage;
    vehicle.location = location || vehicle.location;
    vehicle.transmission = transmission || vehicle.transmission;
    vehicle.fuelType = fuelType || vehicle.fuelType;
    vehicle.engine = engine || vehicle.engine;
    vehicle.color = color || vehicle.color;
    vehicle.description = description || vehicle.description;
    vehicle.images = images || vehicle.images;
    vehicle.auctionStatus = auctionStatus || vehicle.auctionStatus;
    vehicle.auctionEndTime = auctionEndTime || vehicle.auctionEndTime;
    await vehicle.save();
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a vehicle listing
// @route   DELETE /api/vehicles/:id
// @access  Private/Seller (only owner)
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    if (vehicle.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }
    await vehicle.deleteOne();
    res.json({ message: 'Vehicle removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};