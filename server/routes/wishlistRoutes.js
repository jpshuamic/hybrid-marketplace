const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const { Wishlist, Listing, User } = require('../models');

// ✅ Add to wishlist
router.post('/', authenticate, async (req, res) => {
  const { listingId } = req.body;

  if (!listingId) return res.status(400).json({ error: 'listingId is required' });

  try {
    const exists = await Wishlist.findOne({ where: { userId: req.user.id, listingId } });
    if (exists) return res.status(400).json({ error: 'Already in wishlist' });

    const wishlistItem = await Wishlist.create({ userId: req.user.id, listingId });
    res.status(201).json(wishlistItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add to wishlist' });
  }
});

// ✅ Get user’s wishlist
router.get('/', authenticate, async (req, res) => {
  try {
    const items = await Wishlist.findAll({
      where: { userId: req.user.id },
      include: {
        model: Listing,
        include: [{ model: User, attributes: ['username'] }],
      },
    });

    const formatted = items.map(item => ({
      id: item.id,
      listing: item.Listing,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// ✅ Remove from wishlist
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const item = await Wishlist.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!item) return res.status(404).json({ error: 'Wishlist item not found' });

    await item.destroy();
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error removing wishlist item' });
  }
});

module.exports = router;