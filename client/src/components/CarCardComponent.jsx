import React, {
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
import { NavLink } from "react-router-dom";
import { ClassSize } from "../hooks/resizeHook";
import { useHistory } from "react-router-dom";
import { useHttp } from "../hooks/httpHooks";
import { useMessage } from "../hooks/messageHook";
import { AuthContext } from "../context/authContext";
import { Loader } from "./Loader";
import { setCarsActionCreator } from "../redux/carReduser";
import s from "../css/Route.module.css";
import { NewCarLiquidsCount } from "../helpers/newListRoutsCount";

export const CarCardComponent = React.memo(({ car }) => {
  //-----------------------Context with auth------------------------//
  const { token } = useContext(AuthContext);
  //----------------------------Context-----------------------------//
  const auth = useContext(AuthContext);
  //------------------------Use message HOOK------------------------//
  const message = useMessage();
  //--------------------Use http hook for request-------------------//
  const { request, loading, error, clearError } = useHttp();
  //-------Chech windows size with  useeffect and Size State--------//
  //----------------------------Time out----------------------------//
  function debounce(fn, ms) {
    let timer;
    return (_) => {
      clearTimeout(timer);
      timer = setTimeout((_) => {
        timer = null;
        fn.apply(this, arguments);
      }, ms);
    };
  }
  //---------------------------Size State---------------------------//
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });
  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions(
        {
          height: window.innerHeight,
          width: window.innerWidth,
        },
        [dimensions]
      );
    }, 100);
    window.addEventListener("resize", debouncedHandleResize);
    return (_) => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });
  //------------------------------Use ref----------------------------//
  var rafID = useRef(null);
  //------------------------------History----------------------------//
  const history = useHistory();
  //----------------------Links download function--------------------//
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
  //---------------------------Server delete car---------------------//
  const deleteHandler = async () => {
    try {
      const data = await request(`/api/car/${car._id}`, "DELETE", null, {
        Authorization: `Bearer ${auth.token}`,
      });
      rafID.current = requestAnimationFrame(deleteHandler);
      message(data.message);
      history.push("/cars/");
      cancelAnimationFrame(rafID.current);
    } catch (e) {}
  };
  //---------------UseEffect fo fetchLinks (like Mount)---------------//
  useEffect(() => {
    rafID.current = requestAnimationFrame(useEffect);
    fetchCars();
    cancelAnimationFrame(rafID.current);
  }, [fetchCars]);
  //--------------------------Error processing------------------------//
  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);
  //--------------------------Count Car Liquids-----------------------//
  const listLiquids = NewCarLiquidsCount(car.carLists);
  //----------------------------Check Loading-------------------------//
  if (loading) {
    return <Loader />;
  }
  //------------------------------Sort Items--------------------------//
  car.carLists.sort((a, b) => (a.listNumber > b.listNumber ? 1 : -1));
  listLiquids.sort((a, b) => (a.name > b.name ? 1 : -1));
  //---------------------------Get screen size------------------------//
  let cardClass = ClassSize(window.innerWidth, window.screen.width);
  //---------------------------------JSX------------------------------//
  return (
    <div className="row">
      <form className="col s12">
        <div
          className="col s12 offset-s0 blue-grey darken-0 white-text center-align"
          style={{ marginBottom: 3, marginTop: 5 }}
        >
          <h5>
            {car.typeOfCar} № {car.governmentCarNumber}
          </h5>
        </div>
        <div className={cardClass}>З/номер: {car.factoryCarNumber}</div>
        <div className={cardClass}>Номер двигуна: {car.carEngineNumber}</div>
        <div className={cardClass}>Номер паспорта: {car.carPassportNumber}</div>
        <div className={cardClass}>
          Дата реєстрації: {car.dateOfRegistration}
        </div>
        <div className={cardClass}>
          Спецобладнання: {car.specialCarEquipment}
        </div>
        <div className={cardClass}>
          Номер:
          {car.specialCarEquipmentNumber}
        </div>
        <div className={cardClass}>Власник: {car.carOwnerName}</div>
        <div className={cardClass}>
          Дата виробництва: {car.dateOfCarProduction}
        </div>
        <div className={cardClass}>
          Група експлуатації: {car.operatingGroup}
        </div>
        <div className={cardClass}>Категорія: {car.category}</div>
        <div className={cardClass}>
          Початковий спідометр: {car.carIndicatorFirst}
        </div>
        <div className={cardClass}>
          Останній спідометр: {car.carIndicatorLast}
        </div>
        <div className={cardClass}>Загальний пробіг: {car.totalCarMileage}</div>
        <div className={cardClass}>
          Початкові мотогодини: {car.carTimeFirst}
        </div>
        <div className={cardClass}>Останні мотогодини: {car.carTimeLast}</div>
        <div className={cardClass}>Всього мотогодин: {car.carTimeTotal}</div>
        <div className={cardClass}>
          Палива на км: {car.fuelActiveСonsumption}
        </div>
        <div className={cardClass}>
          Палива на годину: {car.fuelPassiveСonsumption}
        </div>
        <div className={cardClass}>Дорожніх листів: {car.carLists.length}</div>
        <div className={cardClass}>Видів ПММ:</div>
        <NavLink to={"/list/"}>
          <button
            className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
            style={{
              marginTop: 6,
              marginLeft: "0%",
              marginRight: "4%",
            }}
          >
            <h6>+Лист</h6>
          </button>
        </NavLink>
        <NavLink to={`/create/${car._id}`}>
          <button
            className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
            style={{
              marginTop: 6,
              marginLeft: "4%",
              marginRight: "4%",
            }}
          >
            <h6>Змінити</h6>
          </button>
        </NavLink>
        <button
          className="col s3 offset-s0 blue-grey darken-0 white-text center-align"
          onClick={deleteHandler}
          style={{
            marginTop: 6,
            marginLeft: "4%",
            marginRight: "4%",
          }}
        >
          <h6>Видалити</h6>
        </button>
        <NavLink to={"/cars/"}>
          <button
            className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
            style={{
              marginTop: 6,
              marginLeft: "4%",
              marginRight: "0%",
            }}
          >
            <h6>Назад</h6>
          </button>
        </NavLink>
      </form>
      <form className="col s12">
        <div
          className="col s12 offset-s0 blue-grey darken-0 white-text center-align"
          style={{ marginBottom: 3, marginTop: 8 }}
        >
          Дорожні листи
        </div>
      </form>
      {car && (
        <form className="col s12">
          <div className={s.liquidTitle}>
            <div className={s.item}>Номер</div>
            <div className={s.item}>Дата</div>
            <div className={s.item}>Водій</div>
            <div className={s.item}>Початковий</div>
            <div className={s.item}>Кінцевий</div>
            <div className={s.item}>Спідометр</div>
          </div>
          {car &&
            car.carLists.map((list) => {
              return (
                <div key={list._id}>
                  <NavLink to={`/list/${list._id}`}>
                    <div className={s.liquid}>
                      <div className={s.item}>{`${list.listNumber}`}</div>
                      <div className={s.item}>{`${list.listDate}`}</div>
                      <div className={s.item}>{`${list.driverName}`}</div>
                      <div className={s.item}>{`${list.listRouteFrom}`}</div>
                      <div className={s.item}>{`${list.listRouteTo}`}</div>
                      <div className={s.item}>{`${list.totalListMileage}`}</div>
                    </div>
                  </NavLink>
                </div>
              );
            })}
        </form>
      )}
      <form className="col s12">
        <div
          className="col s12 offset-s0 blue-grey darken-0 white-text center-align"
          style={{ marginBottom: 3 }}
        >
          Види та кількість ПММ, л
        </div>
      </form>
      {car && (
        <form className="col s12">
          <div className={s.liquidTitle}>
            <div className={s.item}>Назва</div>
            <div className={s.item}>Було</div>
            <div className={s.item}>Надійшло</div>
            <div className={s.item}>Вибуло</div>
            <div className={s.item}>Разом</div>
            <div className={s.item}>Витрата</div>
          </div>
          {car &&
            listLiquids &&
            listLiquids.map((liquid) => {
              return (
                <div key={liquid.name}>
                  <div className={s.liquid}>
                    <div className={s.item}>{`${liquid.name}`}</div>
                    <div className={s.item}>{`${liquid.balanceStart}`}</div>
                    <div className={s.item}>{`${liquid.received}`}</div>
                    <div className={s.item}>{`${liquid.expended}`}</div>
                    <div className={s.item}>{`${liquid.balanceFinish}`}</div>
                    <div className={s.item}>{`${liquid.cost}`}</div>
                  </div>
                </div>
              );
            })}
        </form>
      )}
    </div>
  );
});
