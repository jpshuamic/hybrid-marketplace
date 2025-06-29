const { Listing } = require('../models');

exports.getListingById = async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findByPk(id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    console.error('Error fetching listing by ID:', error);
    res.status(500).json({ error: 'Server error' });
  }
};