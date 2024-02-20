require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const db = require('./db');
const app = express();

app.use(cors());

app.use(morgan('dev'));
app.use(express.json());
//Get all restaurans
app.get('/api/v1/restaurants', async (req, res) => {
  try {
    // const result = await db.query('SELECT * FROM restaurants');
    const restaurantRatingsData = await db.query(
      'select * from restaurants left join (select restaurant_id, COUNT(*), TRUNC(AVG(rating),1) as average_rating from reviews group by restaurant_id) reviews on restaurants.id = reviews.restaurant_id;'
    );

    res.status(200).json({
      status: 'success',
      results: restaurantRatingsData.rows.length,
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
});

//Get restaurant by id
app.get('/api/v1/restaurants/:id', async (req, res) => {
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
});

//Create a restaurant
app.post('/api/v1/restaurants', async (req, res) => {
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
});

app.put('/api/v1/restaurants/:id', async (req, res) => {
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
});

app.delete('/api/v1/restaurants/:id', async (req, res) => {
  console.log(req.params.id);
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
});

app.post('/api/v1/reviews', async (req, res) => {
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
});

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server started and running on port: ${port}`);
});
