import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import RestaurantFinder from '../apis/RestaurantFinder';
import { RestaurantsContext } from '../context/RestaurantsContext';
import StarRating from './StarRating';
function RestaurantList(props) {
  let history = useHistory();
  const { restaurants, setRestaurants } = useContext(RestaurantsContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RestaurantFinder.get('/');
        setRestaurants(response.data.data.restaurants);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleUpdate = (e, id) => {
    e.stopPropagation();
    history.push(`/restaurants/${id}/update`);
  };

  const detailsPage = (id) => {
    history.push(`/restaurants/${id}`);
  };

  const renderRating = (restaurant) => {
    if (!restaurant.count) {
      return <span className="text-warning">0 reviews</span>;
    }
    return (
      <>
        <StarRating rating={restaurant.average_rating} />
        <span className="text-warning ml-1">({restaurant.count})</span>
      </>
    );
  };

  const deleteRestaurant = async (e, id) => {
    e.stopPropagation();
    try {
      const response = await RestaurantFinder.delete(`/${id}`);
      setRestaurants(
        restaurants.filter((restaurant) => {
          return restaurant.id !== id;
        })
      );
    } catch (error) {
      console.log(error.response);
    }
  };

  return (
    <div className="list-group">
      <table className="table table-hover table-dark">
        <thead className="bg-primary">
          <tr>
            <th scope="col">Restaurant</th>
            <th scope="col">Location</th>
            <th scope="col">Price Range</th>
            <th scope="col">Ratings</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {restaurants &&
            restaurants.map((el) => {
              return (
                <tr onClick={() => detailsPage(el.id)} key={el.id}>
                  <td>{el.name}</td>
                  <td>{el.location}</td>
                  <td>{'$'.repeat(el.price_range)}</td>
                  <td>{renderRating(el)}</td>
                  <td>
                    <button
                      onClick={(e) => handleUpdate(e, el.id)}
                      className="btn btn-warning"
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={(e) => deleteRestaurant(e, el.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default RestaurantList;
