const db = require('../db');
module.exports = {
    async getRestaurants(req, res){
        try {
          const offset = (req.params.page - 1) * req.params.limit;
          const limit = req.params.limit;
          const restaurantRatingsData = await db.query(
            'select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id LIMIT $2 offset $1;',
            [offset, limit]
          );
          const restaurantAllData = await db.query(
            'select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;'
          );
      
          res.status(200).json({
            status: 'success',
            results: restaurantRatingsData.rows.length,
            allCounts: restaurantAllData.rows.length,
            data: {
              restaurants: restaurantRatingsData.rows,
            },
          });
        } catch (error) {
          res.status(500).json({
            status: 'fail',
            error: error,
          });
        }
    },
    //Search restaurans
    async searchRestaurants (req, res){
        try {
        const offset = (req.params.page - 1) * req.params.limit;
        const limit = req.params.limit;
        const {location, name} = req.body;
        let restaurantRatingsData, restaurantAllData; 
        if(location != '' && name != ''){
            restaurantRatingsData = await db.query(
            `select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where restaurants.location=$3 AND restaurants.name=$4 LIMIT $2 offset $1;`,
            [offset, limit, location, name]
            );
            restaurantAllData = await db.query(
            `select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where restaurants.location=$1 AND restaurants.name=$2;`,
            [location, name]
            );
        }
        else if(location == '' && name != ''){
            restaurantRatingsData = await db.query(
            `select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where restaurants.name=$3 LIMIT $2 offset $1;`,
            [offset, limit, name]
            );
            restaurantAllData = await db.query(
            `select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where restaurants.name=$1;`,
            [name]
            );
        }
        else if(location != '' && name == ''){
            restaurantRatingsData = await db.query(
            `select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id WHERE restaurants.location=$3 LIMIT $2 offset $1;`,
            [offset, limit, location]
            );
            restaurantAllData = await db.query(
            `select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id WHERE restaurants.location=$1;`,
            [location]
            );
        }
        else {
            restaurantRatingsData = await db.query(
            `select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id LIMIT $2 offset $1;`,
            [offset, limit]
            );
            restaurantAllData = await db.query(
            `select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;`
            );
        }
    
        res.status(200).json({
            status: 'success',
            results: restaurantRatingsData.rows.length,
            allCounts: restaurantAllData.rows.length,
            data: {
            restaurants: restaurantRatingsData.rows,
            },
        });
        } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error,
        });
        }
    },
    //Get restaurant by id
    async getRestaurantById (req, res){
        try {
        // const restaurant = await db.query(
        //   'SELECT * FROM restaurants WHERE id = $1',
        //   [req.params.id]
        // );
    
        const restaurant = await db.query(
            'select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id where id = $1',
            [req.params.id]
        );
    
        const reviews = await db.query(
            'SELECT * FROM reviews WHERE restaurant_id = $1',
            [req.params.id]
        );
        res.status(200).json({
            status: 'success',
            data: {
            restaurant: restaurant.rows[0],
            reviews: reviews.rows,
            },
        });
        } catch (error) {
        res.status(500).json({
            status: 'fail',
            error: error,
        });
        }
    },
    //Create restaurant
    async createRestaurant(req, res){
        const data = {
          name: req.body.name,
          location: req.body.location,
          price_range: req.body.price_range,
        };
      
        try {
          const results = await db.query(
            'INSERT INTO restaurants (name, location, price_range) VALUES ($1, $2, $3) returning *',
            [data.name, data.location, data.price_range]
          );
      
          if (results) {
            return res.json({
              status: 'success',
              data: results.rows[0],
            });
          }
        } catch (error) {
          res.status(500).json({
            status: 'fail',
            error,
          });
        }
    },
    //update restaurant
    async updateRestaurantById (req, res){
        try {
          const results = await db.query(
            'UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id = $4 returning *',
            [req.body.name, req.body.location, req.body.price_range, req.params.id]
          );
      
          return res.json({
            status: 'success',
            data: results.rows[0],
          });
        } catch (error) {
          return res.status(500).json({
            status: 'fail',
            error,
          });
        }
    },
    //delete restaurant
    async deleteRestaurantById (req, res){
        try {
          const results = await db.query('DELETE FROM restaurants WHERE id = $1', [
            req.params.id,
          ]);
          res.status(204).json({
            status: 'success',
            message: 'Restaurant deleted sucessfully',
          });
        } catch (error) {
          return res.status(500).json({
            status: 'fail',
            message: 'Something went wrong!',
          });
        }
    },
}

  
  
  
  

  
  
  
  