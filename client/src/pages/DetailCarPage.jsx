import React from "react";
import { useParams } from "react-router-dom";
import { CarCardComponent } from "../components/CarCardComponent";

export const DetailCarPage = React.memo(({ state }) => {
  let cars = state.cars.cars;
  //-------------------------Get ID our Car----------------------------//
  let carId = useParams().id; //useParams().id
  //-----------------------Use Local Storage---------------------------//
  if (cars) {
    const storageName = "State";
    localStorage.setItem(
      storageName,
      JSON.stringify(
        [...cars]
      )
    );
  } else {
    cars = JSON.parse(localStorage.getItem("State"));
  }
  //------------------------Get our Car to ID--------------------------//
  let car = cars.find(car => car._id === carId);
  if (state.cars.cars) {
    const storageName = "Car";
    localStorage.setItem(
      storageName,
      JSON.stringify({
        ...car
      })
    );
  } else {
    car = JSON.parse(localStorage.getItem("Car"));
  }
  //-------------------------------JSX---------------------------------//
  return <div>{car && <CarCardComponent car={car} />}</div>;
});
