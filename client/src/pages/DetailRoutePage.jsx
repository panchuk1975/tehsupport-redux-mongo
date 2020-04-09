import React, { useRef, useContext, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RouteComponent } from "../components/RouteComponent";
import { AuthContext } from "../context/authContext";
import { setCarsActionCreator } from "../redux/carReduser";
import { useHttp } from "../hooks/httpHooks";
import { useMessage } from "../hooks/messageHook";

export const DetailRoutePage = React.memo(({ state }) => {
  //----------------------------Get state-----------------------------//
  let cars = state.cars.cars;
  //-------------------------Get ID our List ID-----------------------//
  const routeId = useParams().id;
  //-----------------Get valid Car from Local Storage-----------------//
  let car = JSON.parse(localStorage.getItem("Car"));
  let list = JSON.parse(localStorage.getItem("List"));
  let route = JSON.parse(localStorage.getItem("Route"));
  //-----------------------Use Local Storage---------------------------//
  if (cars) {
    localStorage.setItem("State", JSON.stringify([...cars]));
    car = cars.find((Car) => Car._id === car._id);
    localStorage.setItem("Car", JSON.stringify({ ...car }));
    list = car.carLists.find((List) => List._id === list._id);
    localStorage.setItem("List", JSON.stringify({ ...list }));
    route = list.listRoutes.find((Route) => Route._id === routeId);
    // if (routeId & !route) {
    //   route = list.listRoutes.find(
    //     (Route) => Route.routNumber === route.routNumber
    //   );
    // }
    localStorage.setItem("Route", JSON.stringify({ ...route }));
  }
  //---------------------------Use ref---------------------------//
  var rafID = useRef(null);
  //--------------------Use http hook for request----------------//
  const { request } = useHttp();
  //------------------------Context with auth--------------------//
  const { token } = useContext(AuthContext);
  //-------------------------Use message HOOK-------- -----------//
  const message = useMessage();
  //--------------------Links download function------------------//
  const fetchCars = useCallback(async () => {
    try {
      const fetched = await request(`/api/car`, "GET", null, {
        Authorization: `Bearer ${token}`,
      });
      rafID.current = requestAnimationFrame(fetchCars);
      setCarsActionCreator(fetched);
      message(fetched.message);
      cancelAnimationFrame(rafID.current);
    } catch (e) {}
  }, [token, request, message]);
  //----------------UseEffect fo fetchLinks (like Mount)---------------//
  useEffect(() => {
    rafID.current = requestAnimationFrame(fetchCars);
    fetchCars();
    cancelAnimationFrame(rafID.current);
  }, [fetchCars]);
  //-----------------------JSX------------------------//
  return (
    <div>
      <RouteComponent Car={car} List={list} Route={route} routeId={routeId} />
    </div>
  );
});
