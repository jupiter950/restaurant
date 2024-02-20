import React, { useState, useContext } from 'react';
import { RestaurantsContext } from '../context/RestaurantsContext';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';

function AddReview() {
  let history = useHistory();
  const location = useLocation();
  const [name, setName] = useState('');
  const [rating, setRating] = useState('Rating');
  const [review, setReview] = useState('');
  const { selectedRestaurant, setSelectedRestaurant } = useContext(
    RestaurantsContext
  );
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const restaurant_id = selectedRestaurant.restaurant.id;

      const response = await axios.post(
        'http://localhost:3004/api/v1/reviews',
        {
          restaurant_id: restaurant_id,
          name: name,
          review: review,
          rating: rating,
        }
      );
      history.push('/');
      history.push(location.pathname);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mb-2">
      <form action="">
        <div className="form-row">
          <div className="form-group col-8">
            <label htmlFor="name">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              id="name"
              placeholder="Name"
              className="form-control"
            />
          </div>
          <div className="form-group col-4">
            <label htmlFor="rating">Rating</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="custom-select"
            >
              <option disabled>Rating</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="review">Review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            id="review"
            className="form-control"
            cols="30"
            rows="10"
          ></textarea>
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddReview;
