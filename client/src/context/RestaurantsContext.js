import React, { useState, createContext } from 'react';

export const RestaurantsContext = createContext();

export const RestaurantsContextProvider = (props) => {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [counts, setCounts] = useState(0);

  const addRestaurants = (restaurant) => {
    restaurants.length < 5 ? setRestaurants([...restaurants, restaurant]) : setRestaurants([...restaurants]);
  };

  return (
    <RestaurantsContext.Provider
      value={{
        restaurants,
        counts,
        setRestaurants,
        addRestaurants,
        selectedRestaurant,
        setSelectedRestaurant,
        setCounts
      }}
    >
      {props.children}
    </RestaurantsContext.Provider>
  );
};
