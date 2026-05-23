import Order from '../models/Order.js';
import SparePart from '../models/SparePart.js';
import Cart from '../models/Cart.js';

// @desc    Create order from cart
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const { address, paymentMethod } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.part');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let total = 0;
    const orderItems = [];
    for (const item of cart.items) {
      const part = item.part;
      if (part.stock < item.quantity) {
        return res.status(400).json({ message: `${part.name} has insufficient stock` });
      }
      total += part.price * item.quantity;
      orderItems.push({
        part: part._id,
        quantity: item.quantity,
        price: part.price,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount: total,
      address,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      status: 'pending',
      paymentStatus: 'pending',
    });

    // Deduct stock
    for (const item of cart.items) {
      await SparePart.findByIdAndUpdate(item.part._id, { $inc: { stock: -item.quantity } });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.part').sort('-createdAt');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order details
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.part');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};