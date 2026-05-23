// @desc    Get mechanic profile by ID
// @route   GET /api/users/mechanic/:id
// @access  Public
export const getMechanicProfile = async (req, res) => {
  try {
    const mechanic = await User.findById(req.params.id).select('-password');
    if (!mechanic || mechanic.role !== 'mechanic') {
      return res.status(404).json({ message: 'Mechanic not found' });
    }
    res.json(mechanic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
