const express = require('express');
const router = express.Router();
const reviewsController = require('../controller/reviewsController');

router.post('/', reviewsController.createReview);

module.exports = router;