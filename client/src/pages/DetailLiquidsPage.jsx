import React, {useRef, useContext, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { LiquidComponent } from "../components/LiquidComponent";
import { AuthContext } from "../context/authContext";
import { setCarsActionCreator } from "../redux/carReduser";
import { useHttp } from "../hooks/httpHooks";
import { useMessage } from "../hooks/messageHook";

export const DetailLiquidsPage = React.memo(({ state }) => {
  //-------------------------Get ID our List ID-----------------------//
  const liquidId = useParams().id;
  //-----------------Get valid Car from Local Storage-----------------//
  const oldCar = JSON.parse(localStorage.getItem("Car"));
  const oldList = JSON.parse(localStorage.getItem("List"));
  const oldRoute = JSON.parse(localStorage.getItem("Route"));
  const oldLiquid = JSON.parse(localStorage.getItem("Liquid"));
  if (state.cars.cars) {
    //--------------------------Get our Route--------------------------//
    var car = state.cars.cars.find(Car => Car._id === oldCar._id);
    var list = car.carLists.find(List => List._id === oldList._id);
    var route = list.listRoutes.find(Route => Route._id === oldRoute._id);
    var liquid = route.routLiquids.find(Liq => Liq._id === liquidId);
    if (!liquid) {
        liquid = route.routLiquids.find(Liq => Liq._name === oldLiquid._name);
      }
      localStorage.setItem(
        "Liquid",
        JSON.stringify({
          ...liquid
        })
      );
  } else {
    //----------------Get valid Car from Local Storage-----------------//
    car = oldCar;
    list = oldList;
    route = oldRoute;
    liquid = oldLiquid;
  }
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
        Authorization: `Bearer ${token}`
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
      <LiquidComponent Car={car} List={list} Route={route} Liquid = {liquid} liquidId={liquidId} /> 
    </div>
  );
});