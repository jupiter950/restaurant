const db = require('../db');
module.exports = {
    async createReview (req, res){
        try {
          const result = await db.query(
            'INSERT INTO reviews (restaurant_id, name, review, rating) VALUES ($1, $2, $3, $4)',
            [req.body.restaurant_id, req.body.name, req.body.review, req.body.rating]
          );
      
          res.json({
            status: 'success',
          });
        } catch (error) {
          return res.status(500).json({
            status: 'fail',
            error,
          });
        }
    },
}