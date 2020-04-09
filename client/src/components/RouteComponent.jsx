import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { inputRightClassSize } from "../hooks/resizeHook";
import { useHttp } from "../hooks/httpHooks";
import { useMessage } from "../hooks/messageHook";
import { AuthContext } from "../context/authContext";
import { Loader } from "./Loader";
import { NavLink } from "react-router-dom";
import s from "../css/Route.module.css";

let initialForm = {};

export const RouteComponent = ({ Car, List, Route, routeId }) => {
  //------------------------------Get auth------------------------------//
  const auth = useContext(AuthContext);
  //--------------------------Redirect register-------------------------//
  let history = useHistory();
  //----------------------Use http hook for request---------------------//
  const { request, loading } = useHttp();
  //--------------------------Use message HOOK--------------------------//
  const message = useMessage();
  //--------------------------List distribution-------------------------//
  const { listRoutes } = List;
  //-------------------------------Get Car------------------------------//
  if (routeId) {
    initialForm = Route;
  } else {
    initialForm = {
      routNumber: List.listNumber + '-',
      routDate: "",
      routeFrom: "ППД",
      routeTo: "ППД",
      routDeparture: "08:00",
      routArrival: "18:00",
      routeWithCargo: 0,
      routeWithoutCargo: 0,
      routeWithTrailer: 0,
      routeInaTow: 0,
      routeTotal: 0,
      timeOnSite: 0,
      timeInaMotion: 0,
      routTotalTime: 0,
      trailerWeight: 0,
      cargoWeight: 0,
      cargoName: "Відсутній",
      typeOfPavement: 1,
      routLiquids: [],
    };
  }
  //-------------------------Make form for login------------------------//
  const [form, setForm] = useState({
    ...initialForm,
    carId: Car._id,
    listId: List._id,
  });
  //-------------------------Textarea activation------------------------//
  useEffect(() => {
    window.M.updateTextFields();
  }, []);
  //-------------------------Event change Handler-----------------------//
  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  //------------------------------Math block---------------------------//
  form.routeWithoutCargo = form.routeTotal - form.routeWithCargo;
  form.routTotalTime = parseInt(form.timeInaMotion) + parseInt(form.timeOnSite);
  //----------------------------Check new route-------------------------//
  if (listRoutes) {
    var isRouteExists = !!listRoutes.find(
      (r) => r.routNumber === form.routNumber
    );
  }
  //-----------------------Server request for new list-----------------//
  const createRouteHandler = async () => {
    try {
      const data = await request(
        "/api/rout/addRoute",
        "POST",
        { ...form },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      message(data.message);
      history.push("/list/" + List._id);
    } catch (e) {}
  };
  //-----------------------Server request for update--------------------//
  const updateRouteHandler = async () => {
    var modifyRoute = listRoutes.filter((rout) => rout._id === routeId);
    var modifyListRoutes = listRoutes.filter((rout) => rout._id !== routeId);
    const newRoute = {
      routNumber: form.routNumber,
      routDate: form.routDate,
      routeFrom: form.routeFrom,
      routeTo: form.routeTo,
      routDeparture: form.routDeparture,
      routArrival: form.routArrival,
      routeWithCargo: form.routeWithCargo,
      routeWithoutCargo: form.routeWithoutCargo,
      routeWithTrailer: form.routeWithTrailer,
      routeInaTow: form.routeInaTow,
      routeTotal: form.routeTotal,
      timeOnSite: form.timeOnSite,
      timeInaMotion: form.timeInaMotion,
      routTotalTime: form.routTotalTime,
      trailerWeight: form.trailerWeight,
      cargoWeight: form.cargoWeight,
      cargoName: form.cargoName,
      typeOfPavement: form.typeOfPavement,
      routLiquids: form.routLiquids,
      _id: modifyRoute._id,
    };
    const newListRoutes = modifyListRoutes.concat([newRoute]);
    try {
      const data = await request(
        "/api/list",
        "PUT",
        {
          ...List,
          listRoutes: newListRoutes,
          carId: Car._id,
          listId: List._id,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      message(data.message);
      history.push("/list/" + List._id);
    } catch (e) {}
  };
  //------------------------------Delete Route--------------------------//
  const deleteRouteHandler = async () => {
    try {
      if (listRoutes) {
        var newListRoutes = listRoutes.filter((rout) => rout._id !== routeId);
      } else {
        newListRoutes = listRoutes;
      }
      const data = await request(
        "/api/list",
        "PUT",
        {
          ...List,
          listRoutes: newListRoutes,
          carId: Car._id,
          listId: List._id,
        },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      message(data.message);
      history.push("/list/" + List._id);
    } catch (e) {}
  };
  //--------------------------To CarCard page---------------------------//
  const prevPage = () => {
    history.push("/list/" + List._id);
  };
  //----------Chech windows size with  useeffect and Size State---------//
  //------------------------------Time out------------------------------//
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
  //----------------------------Size State------------------------------//
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
        [changeHandler, dimensions]
      );
    }, 100);
    window.addEventListener("resize", debouncedHandleResize);
    return (_) => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });
  //-----------------------------Sort Liquids---------------------------//
  if (routeId & Route) {
    Route.routLiquids.sort((a, b) => (a.name > b.name ? 1 : -1));
  }
  //-----------------------Check is loading exist?----------------------//
  if (loading) {
    return <Loader />;
  }
  //--------------------------Change class size-------------------------//
  let cardClass = inputRightClassSize(window.innerWidth, window.screen.width);
  //---------------------------------JSX--------------------------------//
  return (
    <div className="row">
      <form className="col s12">
        <div
          className="col s12 offset-s0 blue-grey darken-0 white-text center-align"
          style={{ marginBottom: 3, marginTop: 10 }}
        >
          <h5>Маршрут {Route && `№ ${form.routNumber}`}</h5>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Номер маршрута"
            id="routNumber"
            type="text"
            name="routNumber"
            value={form.routNumber}
            onChange={changeHandler}
          />
          <label htmlFor="routNumber">Номер маршрута</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Дата та час"
            id="routDate"
            type="date"
            name="routDate"
            value={form.routDate}
            onChange={changeHandler}
          />
          <label htmlFor="routDate">Дата та час</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Звідки"
            id="routeFrom"
            type="text"
            name="routeFrom"
            value={form.routeFrom}
            onChange={changeHandler}
          />
          <label htmlFor="routeFrom">Звідки</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Куди"
            id="routeTo"
            type="text"
            name="routeTo"
            value={form.routeTo}
            onChange={changeHandler}
          />
          <label htmlFor="routeTo">Куди</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Час вибуття"
            id="routDeparture"
            type="time"
            name="routDeparture"
            value={form.routDeparture}
            onChange={changeHandler}
          />
          <label htmlFor="routDeparture">Час вибуття</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Час прибуття"
            id="routArrival"
            type="time"
            name="routArrival"
            value={form.routArrival}
            onChange={changeHandler}
          />
          <label htmlFor="routArrival">Час прибуття</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="З вантажем"
            id="routeWithCargo"
            type="number"
            name="routeWithCargo"
            value={form.routeWithCargo || 0}
            onChange={changeHandler}
          />
          <label htmlFor="routeWithCargo">З вантажем</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Без вантажу"
            id="routeWithoutCargo"
            type="number"
            name="routeWithoutCargo"
            value={form.routeWithoutCargo || 0}
            onChange={changeHandler}
          />
          <label htmlFor="routeWithoutCargo">Без вантажу</label>
        </div>

        <div className={`${cardClass} input-field`}>
          <input
            placeholder="З причепом"
            id="routeWithTrailer"
            type="number"
            name="routeWithTrailer"
            value={form.routeWithTrailer || 0}
            onChange={changeHandler}
          />
          <label htmlFor="routeWithTrailer">З причепом</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="На буксирі"
            id="routeInaTow"
            type="number"
            name="routeInaTow"
            value={form.routeInaTow || 0}
            onChange={changeHandler}
          />
          <label htmlFor="routeInaTow">На буксирі</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Загальний пробіг"
            id="routeTotal"
            type="number"
            name="routeTotal"
            value={form.routeTotal || ""}
            onChange={changeHandler}
          />
          <label htmlFor="routeTotal">Загальний пробіг</label>
        </div>

        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Мотогодин на місці"
            id="timeOnSite"
            type="number"
            name="timeOnSite"
            value={form.timeOnSite || 0}
            onChange={changeHandler}
          />
          <label htmlFor="timeOnSite">Мотогодин на місці</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Мотогодин у русі"
            id="timeInaMotion"
            type="number"
            name="timeInaMotion"
            value={form.timeInaMotion || 0}
            onChange={changeHandler}
          />
          <label htmlFor="timeInaMotion">Мотогодин у русі</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Всього мотогодин"
            id="routTotalTime"
            type="number"
            name="routTotalTime"
            value={form.routTotalTime || 0}
            onChange={changeHandler}
          />
          <label htmlFor="routTotalTime">Всього мотогодин</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Вага причепу"
            id="trailerWeight"
            type="number"
            name="trailerWeight"
            value={form.trailerWeight || 0}
            onChange={changeHandler}
          />
          <label htmlFor="trailerWeight">Вага причепу</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Вага вантажу"
            id="cargoWeight"
            type="number"
            name="cargoWeight"
            value={form.cargoWeight || 0}
            onChange={changeHandler}
          />
          <label htmlFor="cargoWeight">Вага вантажу</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Назва вантажу"
            id="cargoName"
            type="text"
            name="cargoName"
            value={form.cargoName || 0}
            onChange={changeHandler}
          />
          <label htmlFor="cargoName">Назва вантажу</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Коефіцієнт шляху"
            id="typeOfPavement"
            type="number"
            name="typeOfPavement"
            value={form.typeOfPavement || ""}
            onChange={changeHandler}
          />
          <label htmlFor="typeOfPavement">Коефіціент шляху</label>
        </div>
      </form>
      <form className="col s12">
        {isRouteExists && (
          <div
            className="col s2 offset-s0 grey darken-0 white-text center-align"
            style={{
              padding: 5,
              marginBottom: 4,
              marginLeft: "1%",
              marginRight: "2%",
            }}
          >
            Додати
          </div>
        )}
        {!isRouteExists && (
          <button
            className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
            style={{
              padding: 5,
              marginBottom: 4,
              marginLeft: "1%",
              marginRight: "2%",
            }}
            onClick={createRouteHandler}
          >
            Додати
          </button>
        )}
        {routeId && (
          <button
            className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
            style={{
              padding: 5,
              marginBottom: 4,
              marginLeft: "2%",
              marginRight: "2%",
            }}
            onClick={updateRouteHandler}
          >
            Виправити
          </button>
        )}
        {!routeId && (
          <div
            className="col s2 offset-s0 grey darken-0 white-text center-align"
            style={{
              padding: 5,
              marginBottom: 4,
              marginLeft: "2%",
              marginRight: "2%",
            }}
          >
            Виправити
          </div>
        )}
        {routeId && (
          <button
            className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
            style={{
              padding: 5,
              marginBottom: 4,
              marginLeft: "2%",
              marginRight: "1%",
            }}
            onClick={deleteRouteHandler}
          >
            Видалити
          </button>
        )}
        {!routeId && (
          <div
            className="col s2 offset-s0 grey darken-0 white-text center-align"
            style={{
              padding: 5,
              marginBottom: 4,
              marginLeft: "2%",
              marginRight: "1%",
            }}
          >
            Видалити
          </div>
        )}
        {routeId && (
          <NavLink to={"/liquid/"}>
            <button
              className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
              style={{
                padding: 5,
                marginBottom: 4,
                marginLeft: "2%",
                marginRight: "1%",
              }}
            >
              + ПММ
            </button>
          </NavLink>
        )}
        {!routeId && (
          <div
            className="col s2 offset-s0 grey darken-0 white-text center-align"
            style={{
              padding: 5,
              marginBottom: 4,
              marginLeft: "2%",
              marginRight: "1%",
            }}
          >
            + ПММ
          </div>
        )}
        <button
          className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
          style={{
            padding: 5,
            marginBottom: 4,
            marginLeft: "2%",
            marginRight: "0%",
          }}
          onClick={prevPage}
        >
          Назад
        </button>
      </form>
      {routeId && (
        <form className="col s12">
          <div
            className="col s12 offset-s0 blue-grey darken-0 white-text center-align"
            style={{ marginBottom: 3, marginTop: 8 }}
          >
            ПММ :
          </div>
        </form>
      )}
      {routeId && (
        <form className="col s12">
          <div className={s.liquidTitle}>
            <div className={s.item}>Назва</div>
            <div className={s.item}>Було</div>
            <div className={s.item}>Надійшло</div>
            <div className={s.item}>Вибуло</div>
            <div className={s.item}>Разом</div>
            <div className={s.item}>Витрата</div>
          </div>
          {Route &&
            Route.routLiquids &&
            Route.routLiquids.map((liquid) => {
              return (
                <div key={liquid._id}>
                  <NavLink to={`/liquid/${liquid._id}`}>
                    <div className={s.liquid}>
                      <div className={s.item}>{`${liquid.name}`}</div>
                      <div className={s.item}>{`${liquid.balanceStart}`}</div>
                      <div className={s.item}>{`${liquid.received}`}</div>
                      <div className={s.item}>{`${liquid.expended}`}</div>
                      <div className={s.item}>{`${liquid.balanceFinish}`}</div>
                      <div className={s.item}>{`${liquid.cost}`}</div>
                    </div>
                  </NavLink>
                </div>
              );
            })}
        </form>
      )}
    </div>
  );
};
