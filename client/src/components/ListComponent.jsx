import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { inputRightClassSize } from "../hooks/resizeHook";
import { useHttp } from "../hooks/httpHooks";
import { useMessage } from "../hooks/messageHook";
import { AuthContext } from "../context/authContext";
import { Loader } from "./Loader";
import s from "../css/Route.module.css";
import { NewListLiquidsCount } from "../helpers/newListRoutsCount";

//---------------------Initializide class Size-------------------//
let cardClass = inputRightClassSize(window.innerWidth, window.screen.width);
let initialForm = {};

export const ListComponent = ({ car, list, listId }) => {
  //-----------------------------Get auth------------------------//
  const auth = useContext(AuthContext);
  //------------------------Change class size--------------------//
  let setCardClass = () => {
    cardClass = inputRightClassSize(window.innerWidth, window.screen.width);
  };
  //------------------------Redirect register--------------------//
  let history = useHistory();
  //--------------------Use http hook for request----------------//
  const { request, loading } = useHttp();
  //-------------------------Use message HOOK-------- -----------//
  const message = useMessage();
  //------------------------------Get Car------------------------//
  if (listId) {
    initialForm = list;
  } else {
    initialForm = {
      listNumber: "",
      listDate: "",
      driverName: "Штатний",
      listRouteFrom: "ППД",
      listRouteTo: "ППД",
      seniorName: car.carOwnerName,
      departure: "08:00",
      arrival: "18:00",
      indicatorListStart: car.carIndicatorLast,
      indicatorListFinish: "0",
      totalListMileage: "0",
      timeListFirst:  car.carTimeLast,
      timeListLast: "0",
      timeListTotal: "0",
      season: 1,
      listLiquids: [],
      listRoutes: [],
    };
  }
  //-----------------------Make form for List--------------------//
  const [form, setForm] = useState({
    ...initialForm,
    carId: car._id,
  });
  //--------------------------Check list-------------------------//
  let isListExists = !!car.carLists.find(
    (list) => list.listNumber === form.listNumber
  );
  //---------------------Textarea activation---------------------//
  useEffect(() => {
    window.M.updateTextFields();
  }, []);
  //---------------------Event change Handler--------------------//
  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  //--------------------------Math block-------------------------//
  if (listId) {
    form.indicatorListFinish = 0;
    list.listRoutes.map((route) => {
      form.indicatorListFinish = form.indicatorListFinish + route.routeTotal;
      return route;
    });
  }
  if (form.indicatorListFinish) {
    if (!form.indicatorListStart) {
      form.indicatorListStart = 0;
    }
    form.totalListMileage = form.indicatorListFinish + form.indicatorListStart;
  }
  if (!listId) {
    form.totalListMileage = 0;
    form.indicatorListFinish = 0;
  }

  if (listId) {
    form.timeListLast = 0;
    list.listRoutes.map((route) => {
      form.timeListLast = form.timeListLast + route.routTotalTime;
      return route;
    });
  }
  if (form.timeListLast) {
    if (!form.timeListFirst) {
      form.timeListFirst = 0;
    }
    form.timeListTotal = form.timeListLast + form.timeListFirst;
  }
  if (!listId) {
    form.timeListTotal = 0;
    form.timeListLast = 0;
  }
  //-----------------Server request for new list-----------------//
  const pressHandler = async () => {
    try {
      const data = await request(
        "/api/list/addList",
        "POST",
        { ...form },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      message(data.message);
      history.push("/detail/" + car._id);
    } catch (e) {}
  };
  //------------------Server request for update------------------//
  const updateHandler = async () => {
    try {
      const data = await request(
        "/api/list",
        "PUT",
        { ...form, carId: car._id, listId },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      message(data.message);
      history.push("/detail/" + car._id);
    } catch (e) {}
  };
  //------------------Server request for delete-------------------//
  const deleteHandler = async () => {
    try {
      const data = await request(
        "/api/list/",
        "DELETE",
        { carId: car._id, listId },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      message(data.message);
      history.push("/detail/" + car._id);
    } catch (e) {}
  };
  //-----------------------To CarCard page-------------------------//
  const prevPage = () => {
    history.push("/detail/" + car._id);
  };
  //-------Chech windows size with  useeffect and Size State-------//
  //----------------------------Time out---------------------------//
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
      setCardClass();
      setDimensions(
        {
          height: window.innerHeight,
          width: window.innerWidth,
        },
        [setCardClass, changeHandler, dimensions]
      );
    }, 100);
    window.addEventListener("resize", debouncedHandleResize);
    return (_) => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });
  //-----------------------Count List Liquids-----------------------//
  let newListLiquids = [];
  if (list) {
    if (list.listRoutes) {
      newListLiquids = NewListLiquidsCount(list.listRoutes);
    }
  }
  //---------------------------Sort Items---------------------------//
  newListLiquids.sort((a, b) => (a.name > b.name ? 1 : -1));
  if (listId) {
    list.listRoutes.sort((a, b) => (a.routNumber > b.routNumber ? 1 : -1));
  }
  //--------------------Check is loading exist?---------------------//
  if (loading) {
    return <Loader />;
  }
  //-------------------------------JSX------------------------------//
  return (
    <div className="row">
      <form className="col s12">
        <div
          className="col s12 offset-s0 blue-grey darken-0 white-text center-align"
          style={{ marginBottom: 3, marginTop: 10 }}
        >
          <h5>Дорожній лист{form.listNumber && ` № ${form.listNumber}`}</h5>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Номер листа"
            id="listNumber"
            type="text"
            name="listNumber"
            value={form.listNumber}
            onChange={changeHandler}
          />
          <label htmlFor="listNumber">Номер листа</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Дата"
            id="listDate"
            type="date"
            name="listDate"
            value={form.listDate}
            onChange={changeHandler}
          />
          <label htmlFor="listDate">Дата</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Водій"
            id="driverName"
            type="text"
            name="driverName"
            value={form.driverName || "Штатний"}
            onChange={changeHandler}
          />
          <label htmlFor="driverName">Водій</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Старший машини"
            id="seniorName"
            type="text"
            name="seniorName"
            value={form.seniorName || car.carOwnerName}
            onChange={changeHandler}
          />
          <label htmlFor="seniorName">Старший машини</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Звідки"
            id="listRouteFrom"
            type="text"
            name="listRouteFrom"
            value={form.listRouteFrom || "ППД"}
            onChange={changeHandler}
          />
          <label htmlFor="listRouteFrom">Звідки</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Куди"
            id="listRouteTo"
            type="text"
            name="listRouteTo"
            value={form.listRouteTo || "ППД"}
            onChange={changeHandler}
          />
          <label htmlFor="listRouteTo">Куди</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Час вибуття"
            id="departure"
            type="time"
            name="departure"
            value={form.departure || "08:00"}
            onChange={changeHandler}
          />
          <label htmlFor="departure">Час вибуття</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Час прибуття"
            id="arrival"
            type="time"
            name="arrival"
            value={form.arrival || "18:00"}
            onChange={changeHandler}
          />
          <label htmlFor="arrival">Час прибуття</label>
        </div>

        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Показники убуття"
            id="indicatorListStart"
            type="number"
            name="indicatorListStart"
            value={form.indicatorListStart || car.carIndicatorLast}
            onChange={changeHandler}
          />
          <label htmlFor="indicatorListStart">Показники убуття</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Пробіг по листу"
            id="indicatorListFinish"
            type="number"
            name="indicatorListFinish"
            value={form.indicatorListFinish || "0"}
            onChange={changeHandler}
          />
          <label htmlFor="indicatorListFinish">Пробіг по листу</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Показники прибуття"
            id="totalListMileage"
            type="number"
            name="totalListMileage"
            value={form.totalListMileage || "0"}
            onChange={changeHandler}
          />
          <label htmlFor="totalListMileage">Показники прибуття</label>
        </div>

        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Початковий час"
            id="timeListFirst"
            type="number"
            name="timeListFirst"
            value={form.timeListFirst || car.carTimeLast}
            onChange={changeHandler}
          />
          <label htmlFor="timeListFirst">Мотогодини по убуттю</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Напрацювання мотогодин"
            id="timeListLast"
            type="number"
            name="timeListLast"
            value={form.timeListLast || "0"}
            onChange={changeHandler}
          />
          <label htmlFor="timeListLast">Напрацювання мотогодин</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Загальне напрацювання"
            id="timeListTotal"
            type="number"
            name="timeListTotal"
            value={form.timeListTotal || "0"}
            onChange={changeHandler}
          />
          <label htmlFor="timeListTotal">Загальний час</label>
        </div>
        <div className={`${cardClass} input-field`}>
          <input
            placeholder="Коефіцієнт сезону '1' "
            id="season"
            type="number"
            name="season"
            value={form.season || ""}
            onChange={changeHandler}
          />
          <label htmlFor="season">"Коефіцієнт сезону '1'</label>
        </div>
      </form>
      <form className="col s12">
        {!isListExists && (
          <button
            className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
            style={{
              padding: 5,
              marginBottom: 4,
              marginLeft: "0%",
              marginRight: "2%",
            }}
            onClick={pressHandler}
          >
            Додати
          </button>
        )}
        {isListExists && (
          <div
            className="col s2 offset-s0 grey darken-0 white-text center-align"
            style={{
              padding: 5,
              marginBottom: 4,
              marginLeft: "0%",
              marginRight: "2%",
            }}
          >
            Додати
          </div>
        )}
        {listId && (
          <button
            className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
            style={{
              padding: 5,
              marginBottom: 4,
              marginLeft: "2%",
              marginRight: "2%",
            }}
            onClick={updateHandler}
          >
            Обновити
          </button>
        )}
        {!listId && (
          <div
            className="col s2 offset-s0 grey darken-0 white-text center-align"
            style={{
              padding: 5,
              marginBottom: 2,
              marginLeft: "2%",
              marginRight: "2%",
            }}
          >
            Обновити
          </div>
        )}
        {listId && (
          <button
            className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
            style={{
              padding: 5,
              marginBottom: 4,
              marginLeft: "2%",
              marginRight: "2%",
            }}
            onClick={deleteHandler}
          >
            Видалити
          </button>
        )}
        {!listId && (
          <div
            className="col s2 offset-s0 grey darken-0 white-text center-align"
            style={{
              padding: 5,
              marginBottom: 4,
              marginLeft: "2%",
              marginRight: "2%",
            }}
          >
            Видалити
          </div>
        )}

        {listId && (
          <NavLink to={"/route/"}>
            <button
              className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
              style={{
                padding: 5,
                marginBottom: 4,
                marginLeft: "2%",
                marginRight: "2%",
              }}
            >
              +Маршрут
            </button>
          </NavLink>
        )}
        {!listId && (
          <div
            className="col s2 offset-s0 grey darken-0 white-text center-align"
            style={{
              padding: 5,
              marginBottom: 4,
              marginLeft: "2%",
              marginRight: "2%",
            }}
          >
            +Mаршрут
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
      {listId && (
        <form className="col s12">
          <div
            className="col s12 offset-s0 blue-grey darken-0 white-text center-align"
            style={{ marginBottom: 3, marginTop: 5 }}
          >
            Маршрути :
          </div>
        </form>
      )}
      {listId && (
        <form className="col s12">
          <div className={s.liquidTitle}>
            <div className={s.item}>Номер</div>
            <div className={s.item}>Дата</div>
            <div className={s.item}>Звідки</div>
            <div className={s.item}>Куди</div>
            <div className={s.item}>Пробіг</div>
            <div className={s.item}>Годин</div>
          </div>
          {list &&
            list.listRoutes &&
            list.listRoutes.map((rout) => {
              return (
                <div key={rout._id}>
                  <NavLink to={`/route/${rout._id}`}>
                    <div className={s.liquid}>
                      <div className={s.item}>{`${rout.routNumber}`}</div>
                      <div className={s.item}>{`${rout.routDate}`}</div>
                      <div className={s.item}>{`${rout.routeFrom}`}</div>
                      <div className={s.item}>{`${rout.routeTo}`}</div>
                      <div className={s.item}>{`${rout.routeTotal}`}</div>
                      <div className={s.item}>{`${rout.routTotalTime}`}</div>
                    </div>
                  </NavLink>
                </div>
              );
            })}
        </form>
      )}
      {listId && (
        <form className="col s12">
          <div
            className="col s12 offset-s0 blue-grey darken-0 white-text center-align"
            style={{ marginBottom: 3, marginTop: 7 }}
          >
            ПММ :
          </div>
        </form>
      )}
      {listId && (
        <form className="col s12">
          <div className={s.liquidTitle}>
            <div className={s.item}>Назва</div>
            <div className={s.item}>Було</div>
            <div className={s.item}>Надійшло</div>
            <div className={s.item}>Вибуло</div>
            <div className={s.item}>Разом</div>
            <div className={s.item}>Витрата</div>
          </div>
          {newListLiquids &&
            newListLiquids.map((liquid) => {
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
};
