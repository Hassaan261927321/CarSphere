import SparePart from '../models/SparePart.js';

export const getParts = async (req, res) => {
  const parts = await SparePart.find({});
  res.json(parts);
};

export const getPartById = async (req, res) => {
  const part = await SparePart.findById(req.params.id);
  if (!part) return res.status(404).json({ message: 'Part not found' });
  res.json(part);
};


// @desc    Create spare part (admin only)
// @route   POST /api/parts
// @access  Private/Admin
export const createPart = async (req, res) => {
  const { name, price, image, category, stock, description } = req.body;
  const part = await SparePart.create({ name, price, image, category, stock, description });
  res.status(201).json(part);
};

// @desc    Update spare part (admin only)
// @route   PUT /api/parts/:id
// @access  Private/Admin
export const updatePart = async (req, res) => {
  const part = await SparePart.findById(req.params.id);
  if (!part) return res.status(404).json({ message: 'Part not found' });
  const { name, price, image, category, stock, description } = req.body;
  part.name = name || part.name;
  part.price = price || part.price;
  part.image = image || part.image;
  part.category = category || part.category;
  part.stock = stock !== undefined ? stock : part.stock;
  part.description = description || part.description;
  await part.save();
  res.json(part);
};

// @desc    Delete spare part (admin only)
// @route   DELETE /api/parts/:id
// @access  Private/Admin
export const deletePart = async (req, res) => {
  const part = await SparePart.findById(req.params.id);
  if (!part) return res.status(404).json({ message: 'Part not found' });
  await part.deleteOne();
  res.json({ message: 'Part removed' });
};