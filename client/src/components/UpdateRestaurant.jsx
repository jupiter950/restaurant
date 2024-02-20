import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import RestaurantFinder from '../apis/RestaurantFinder';

function UpdateRestaurant(props) {
  let { id } = useParams();
  let history = useHistory();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await RestaurantFinder.get(`/${id}`);
      setName(response.data.data.restaurant.name);
      setLocation(response.data.data.restaurant.location);
      setPriceRange(response.data.data.restaurant.price_range);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      location,
      price_range: priceRange,
    };
    const response = await RestaurantFinder.put(`/${id}`, data);
    history.push('/');
  };

  return (
    <div>
      <form action="">
        <div className="form col-md-6 mt-5" style={{ margin: '0 auto' }}>
          <div className="col mb-4">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="col mb-4">
            <label>Location</label>
            <input
              name="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              type="text"
              className="form-control"
            />
          </div>

          <div className="col">
            <label>Price Range</label>
            <input
              name="price_range"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              type="text"
              className="form-control"
            />
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="mt-2 ml-3 btn btn-primary"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateRestaurant;
