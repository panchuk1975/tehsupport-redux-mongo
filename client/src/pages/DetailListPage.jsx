import React, { useRef, useEffect, useContext, useCallback } from "react";
import { useParams } from "react-router-dom";
import { ListComponent } from "../components/ListComponent";
import { useHttp } from "../hooks/httpHooks";
import { AuthContext } from "../context/authContext";
import { setCarsActionCreator } from "../redux/carReduser";
import { useMessage } from "../hooks/messageHook";

export const DetailListPage = React.memo(({ state }) => {
  //----------------------------Get state-----------------------------//
  let cars = state.cars.cars;
  //-------------------------Get ID our List ID------------------------//
  const listId = useParams().id;
  //-----------------Get valid Car from Local Storage------------------//
  let car = JSON.parse(localStorage.getItem("Car"));
  let list = JSON.parse(localStorage.getItem("List"));
  //-----------------------Use Local Storage---------------------------//
  if (cars) {
    localStorage.setItem("State", JSON.stringify([...cars]));
    car = cars.find(c => c._id === car._id);
    localStorage.setItem( "Car", JSON.stringify({ ...car}));
    list = car.carLists.find(List => List._id === listId);
    localStorage.setItem( "List", JSON.stringify({ ...list}));
  } 
  //---------------------Use http hook for request---------------------//
  const { request, error, clearError } = useHttp();
  //-------------------------Context with auth-------------------------//
  const { token } = useContext(AuthContext);
  //--------------------------Use message HOOK-------------------------//
  const message = useMessage();
  //-----------------------Cars download function----------------------//
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
  //------------------------Use ref for component----------------------//
  let rafID = useRef(null);
  //-----------------UseEffect fo fetchLinks (like Mount)--------------//
  useEffect(() => {
    rafID.current = requestAnimationFrame(fetchCars);
    fetchCars();
    cancelAnimationFrame(rafID.current);
  }, [fetchCars]);
  //---------------------------Error processing------------------------//
  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);
  //----------------------------------JSX------------------------------//
  return (
    <div>
      <ListComponent car={car} list={list} listId={listId} />
    </div>
  );
});
