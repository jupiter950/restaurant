const express = require('express');
const router = express.Router();
const restaurantController = require('../controller/restaurantController');

//Get restaurants
router.get('/:page/:limit', restaurantController.getRestaurants);
  
//Search restaurans
router.post('/search/:page/:limit', restaurantController.searchRestaurants);
  
//Get restaurant by id
router.get('/:id', restaurantController.getRestaurantById);

//create restaurant
router.post('/', restaurantController.createRestaurant);
  
//update restaurant
router.put('/:id', restaurantController.updateRestaurantById);
  
//delete restaurant
router.delete('/:id', restaurantController.deleteRestaurantById);

module.exports = router;