require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const express = require('express');
const app = express();
const restaurantRoute = require('./routes/restaurant');
const reviewsRoute = require('./routes/reviews');

app.use(cors());

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/v1/restaurants', restaurantRoute);
app.use('/api/v1/reviews', reviewsRoute);

const port = process.env.PORT || 3005;
app.listen(port, () => {
  console.log(`Server started and running on port: ${port}`);
});
