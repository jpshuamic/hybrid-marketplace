const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Listing = require('../models/Listing');

// GET /api/users/:id
router.get('/:id', async (req, res) => {
  try {
    const seller = await User.findByPk(req.params.id, {
      attributes: ['id', 'username', 'email'],
      include: {
        model: Listing,
        attributes: ['id', 'title', 'price', 'category', 'imageUrl'],
      },
    });

    if (!seller) return res.status(404).json({ error: 'Seller not found' });
    res.json(seller);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;