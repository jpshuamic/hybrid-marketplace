const express = require('express');
const router = express.Router();
const { getListingById } = require('../controllers/listingControllers');

// GET /api/listings/:id
router.get('/:id', getListingById);

module.exports = router;