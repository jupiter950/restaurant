import React, { useState, useContext } from 'react';
import RestaurantFinder from '../apis/RestaurantFinder';
import { RestaurantsContext } from '../context/RestaurantsContext';

function AddRestaurant() {
  const { addRestaurants } = useContext(RestaurantsContext);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('Price range');

  const addRestaurant = async (e) => {
    e.preventDefault();
    try {
      const response = await RestaurantFinder.post('/', {
        name: name,
        location: location,
        price_range: priceRange,
      });

      addRestaurants(response.data.data);
    } catch (error) {}
  };
  return (
    <div className="mb-4">
      <form action="">
        <div className="form-row">
          <div className="col">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              name="name"
              placeholder="name"
              className="form-control"
            />
          </div>

          <div className="col">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              name="location"
              type="text"
              placeholder="location"
              className="form-control"
            />
          </div>

          <div className="col">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="custom-select my-1 mr-sm-2"
            >
              <option disabled>Price range</option>
              <option value="1">$</option>
              <option value="2">$$</option>
              <option value="3">$$$</option>
              <option value="4">$$$$</option>
              <option value="5">$$$$$</option>
            </select>
          </div>
          <button
            onClick={addRestaurant}
            type="submit"
            className="btn btn-primary"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddRestaurant;
