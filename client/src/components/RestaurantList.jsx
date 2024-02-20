import React, { useEffect, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import RestaurantFinder from '../apis/RestaurantFinder';
import { RestaurantsContext } from '../context/RestaurantsContext';
import StarRating from './StarRating';
function RestaurantList(props) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  let history = useHistory();
  const { restaurants, setRestaurants, counts, setCounts } = useContext(RestaurantsContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await RestaurantFinder.get(`/${page}/${limit}`);
        setRestaurants(response.data.data.restaurants);
        setCounts(response.data.allCounts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if(name == '' && location == '')
          response = await RestaurantFinder.get(`/${page}/${limit}`);
        else {
          response = await RestaurantFinder.post(`/search/${page}/${limit}`, {
            location: location,
            name: name
          });
        }
        setRestaurants(response.data.data.restaurants);
        setCounts(response.data.allCounts);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [page]);

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

  const pageSet = (e, page) => {
    e.preventDefault();
    setPage(page);
  };

  const searchRestaurant = async (e) => {
    e.preventDefault();
    try {
      const response = await RestaurantFinder.post(`/search/${page}/${limit}`, {
        location: location,
        name: name
      });

      setRestaurants(response.data.data.restaurants);
      setCounts(response.data.allCounts);
    } catch (error) {}
  };

  return (
    <div className="list-group">
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

            <button
              onClick={searchRestaurant}
              type="submit"
              className="btn btn-primary"
            >
              Search
            </button>
          </div>
        </form>
      </div>
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
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item"><a class="page-link" href="#" onClick={e => {
            let temp = page;
            pageSet(e, --temp <= 0 ? 1 : temp);
          }}>Previous</a></li>
          {
            Array(Math.ceil(counts / 5)).fill(0).map((_, index) => (
              <li class="page-item"><a class="page-link" href="#" onClick={e => pageSet(e, index + 1)}>{index + 1}</a></li>
            ))
          }
          <li class="page-item"><a class="page-link" href="#" onClick={e => {
            let temp = page;
            pageSet(e, ++temp >= Math.ceil(counts / 5) ? Math.ceil(counts / 5) : temp)
          }}>Next</a></li>
        </ul>
      </nav>
    </div>
  );
}

export default RestaurantList;
