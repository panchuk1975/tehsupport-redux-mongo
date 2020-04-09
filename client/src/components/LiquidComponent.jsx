import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { inputRightClassSize } from "../hooks/resizeHook";
import { useHttp } from "../hooks/httpHooks";
import { useMessage } from "../hooks/messageHook";
import { AuthContext } from "../context/authContext";
import { Loader } from "./Loader";
import {
  NewListAddedRoutes,
  NewListDeletedRoutes,
  NewListUpdatedRoutes
} from "../helpers/newListRoutsCount";

//------------------------Initializide class Size-----------------------//
let cardClass = inputRightClassSize(window.innerWidth, window.screen.width);
let initialForm = {};
export const LiquidComponent = React.memo(
  ({ Car, List, Route, Liquid, liquidId }) => {
    //------------------------------Get auth------------------------------//
    const auth = useContext(AuthContext);
    //--------------------------Change class size-------------------------//
    let setCardClass = () => {
      cardClass = inputRightClassSize(window.innerWidth, window.screen.width);
    };
    //--------------------------Redirect register-------------------------//
    let history = useHistory();
    //----------------------Use http hook for request---------------------//
    const { request, loading } = useHttp();
    //--------------------------Use message HOOK--------------------------//
    const message = useMessage();
    //--------------------------List distribution-------------------------//
    const { listRoutes } = List;
    const { routLiquids } = Route;
    //-------------------------------Get Car------------------------------//
    if (liquidId) {
      initialForm = Liquid;
    } else {
      initialForm = {
        name: "",
        balanceStart: 0,
        received: 0,
        expended: 0,
        balanceFinish: 0,
        cost: Car.fuelActiveСonsumption,
        density: 0.745
      };
    }
    //-------------------------Make form for login------------------------//
    const [form, setForm] = useState({
      ...initialForm
    });
    //-------------------------Textarea activation------------------------//
    useEffect(() => {
      window.M.updateTextFields();
    }, []);
    //-------------------------Event change Handler-----------------------//
    const changeHandler = event => {
      setForm({ ...form, [event.target.name]: event.target.value });
    };
    //------------------------------Math block---------------------------//
    const expendedWithoutCargo =
      Math.round(
        (parseInt(Route.routeTotal) - parseInt(Route.routeInaTow)) *
          form.cost *
          100
      ) / 100;
    const expendedWithCargo =
      Math.round(
        form.cost *
          0.02 *
          100 *
          parseInt(Route.routeWithCargo) *
          parseInt(Route.cargoWeight)
      ) / 100;
    const expendedWithTrailer =
      Math.round(
        form.cost *
          0.02 *
          100 *
          parseInt(Route.routeWithTrailer) *
          parseInt(Route.trailerWeight)
      ) / 100;
    const expendedWithTimeOnSite =
      Math.round(
        parseInt(
          ((Car.fuelPassiveСonsumption * Route.timeOnSite * form.cost) /
            0.365) *
            100
        )
      ) / 100;
    const expendedWithTimeInaMotion =
      Math.round(
        parseInt(
          ((Car.fuelPassiveСonsumption * Route.timeInaMotion * form.cost) /
            0.365) *
            100
        )
      ) / 100;

    if (!expendedWithCargo & !expendedWithTrailer & !expendedWithoutCargo) {
      form.expended =
        (Math.round(expendedWithTimeOnSite + expendedWithTimeInaMotion) * 100) /
        100;
    }
    if (!expendedWithCargo & !expendedWithTrailer & expendedWithoutCargo) {
      form.expended =
        (Math.round(
          expendedWithoutCargo * List.season +
            expendedWithTimeOnSite +
            expendedWithTimeInaMotion
        ) *
          100) /
        100;
    } else if (
      !expendedWithTrailer &
      expendedWithoutCargo &
      expendedWithCargo
    ) {
      form.expended =
        (Math.round(
          (expendedWithoutCargo + expendedWithCargo) * List.season +
            expendedWithTimeOnSite +
            expendedWithTimeInaMotion
        ) *
          100) /
        100;
    }
    if (!expendedWithoutCargo & expendedWithCargo & expendedWithTrailer) {
      form.expended =
        (Math.round(
          (expendedWithCargo + expendedWithTrailer) * List.season +
            expendedWithTimeOnSite +
            expendedWithTimeInaMotion
        ) *
          100) /
        100;
    } else {
      form.expended =
        (Math.round(
          (expendedWithoutCargo + expendedWithCargo + expendedWithTrailer) *
            List.season +
            expendedWithTimeOnSite +
            expendedWithTimeInaMotion
        ) *
          100) /
        100;
    }
    form.balanceFinish = Math.round(
      (parseInt(form.balanceStart) * 100 +
        parseInt(form.received) * 100 -
        form.expended * 100) /
        100
    );
    //----------------------------Check new route-------------------------//
    if (routLiquids) {
      var isLiquidExists = !!routLiquids.find(liq => liq.name === form.name);
    }
    //-----------------------Server request for new list-----------------//
    const createLiquidHandler = async () => {
      const newListRoutes = NewListAddedRoutes(listRoutes, Route, form);
      try {
        const data = await request(
          "/api/list",
          "PUT",
          {
            ...List,
            listRoutes: newListRoutes,
            carId: Car._id,
            listId: List._id
          },
          {
            Authorization: `Bearer ${auth.token}`
          }
        );
        message(data.message);
        history.push("/route/" + Route._id);
      } catch (e) {}
    };
    //------------------------------Delete Route--------------------------//
    const deleteLiquidHandler = async () => {
      const deletedListRoutes = NewListDeletedRoutes(
        listRoutes,
        Route,
        liquidId
      );
      try {
        const data = await request(
          "/api/list",
          "PUT",
          {
            ...List,
            listRoutes: deletedListRoutes,
            carId: Car._id,
            listId: List._id
          },
          {
            Authorization: `Bearer ${auth.token}`
          }
        );
        message(data.message);
        history.push("/route/" + Route._id);
      } catch (e) {}
    };
    //-----------------------Server request for update--------------------//
    const updateLiquidHandler = async () => {
      const updatedListRoutes = NewListUpdatedRoutes(
        listRoutes,
        form,
        Route,
        liquidId
      );
      try {
        const data = await request(
          "/api/list",
          "PUT",
          {
            ...List,
            listRoutes: updatedListRoutes,
            carId: Car._id,
            listId: List._id
          },
          {
            Authorization: `Bearer ${auth.token}`
          }
        );
        message(data.message);
        history.push("/route/" + Route._id);
      } catch (e) {}
    };
    //--------------------------To CarCard page---------------------------//
    const prevPage = () => {
      history.push("/route/" + Route._id);
    };
    //----------Chech windows size with  useeffect and Size State---------//
    //------------------------------Time out------------------------------//
    function debounce(fn, ms) {
      let timer;
      return _ => {
        clearTimeout(timer);
        timer = setTimeout(_ => {
          timer = null;
          fn.apply(this, arguments);
        }, ms);
      };
    }
    //----------------------------Size State------------------------------//
    const [dimensions, setDimensions] = useState({
      height: window.innerHeight,
      width: window.innerWidth
    });
    useEffect(() => {
      const debouncedHandleResize = debounce(function handleResize() {
        setCardClass();
        setDimensions(
          {
            height: window.innerHeight,
            width: window.innerWidth
          },
          [setCardClass, changeHandler, dimensions]
        );
      }, 100);
      window.addEventListener("resize", debouncedHandleResize);
      return _ => {
        window.removeEventListener("resize", debouncedHandleResize);
      };
    });
    //-----------------------Check is loading exist?----------------------//
    if (loading) {
      return <Loader />;
    }
    //---------------------------------JSX--------------------------------//
    return (
      <div className="row">
        <form className="col s12">
          <div
            className="col s12 offset-s0 blue-grey darken-0 white-text center-align"
            style={{ marginBottom: 3, marginTop: 10 }}
          >
            <h5>ПММ: {Liquid && ` ${form.name}`}</h5>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Найменування ПММ"
              id="name"
              type="text"
              name="name"
              value={form.name}
              onChange={changeHandler}
            />
            <label htmlFor="name">Найменування ПММ</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Перед виїздом"
              id="balanceStart"
              type="number"
              name="balanceStart"
              value={form.balanceStart || ""}
              onChange={changeHandler}
            />
            <label htmlFor="balanceStart">Перед виїздом</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Отримано"
              id="received"
              type="number"
              name="received"
              value={form.received || ""}
              onChange={changeHandler}
            />
            <label htmlFor="received">Отримано</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Витрата/км"
              id="cost"
              type="number"
              name="cost"
              value={form.cost || ""}
              onChange={changeHandler}
            />
            <label htmlFor="cost">Витрата/км</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Витрачено"
              id="expended"
              type="number"
              name="expended"
              value={form.expended || ""}
              onChange={changeHandler}
            />
            <label htmlFor="expended">Витрачено</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Разом"
              id="balanceFinish"
              type="number"
              name="balanceFinish"
              value={form.balanceFinish || ""}
              onChange={changeHandler}
            />
            <label htmlFor="balanceFinish">Разом</label>
          </div>
        </form>
        <form className="col s12">
          {isLiquidExists && (
            <div
              className="col s2 offset-s0 grey darken-0 white-text center-align"
              style={{
                padding: 4,
                marginBottom: 4,
                marginLeft: "5%",
                marginRight: "3%"
              }}
            >
              Додати
            </div>
          )}
          {!isLiquidExists && (
            <button
              className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
              style={{
                padding: 4,
                marginBottom: 4,
                marginLeft: "5%",
                marginRight: "3%"
              }}
              onClick={createLiquidHandler}
            >
              Додати
            </button>
          )}
          {liquidId && (
            <button
              className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
              style={{
                padding: 4,
                marginBottom: 4,
                marginLeft: "5%",
                marginRight: "3%"
              }}
              onClick={updateLiquidHandler}
            >
              Виправити
            </button>
          )}
          {!liquidId && (
            <div
              className="col s2 offset-s0 grey darken-0 white-text center-align"
              style={{
                padding: 4,
                marginBottom: 4,
                marginLeft: "5%",
                marginRight: "3%"
              }}
            >
              Виправити
            </div>
          )}
          {liquidId && (
            <button
              className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
              style={{
                padding: 4,
                marginBottom: 4,
                marginLeft: "3%",
                marginRight: "5%"
              }}
              onClick={deleteLiquidHandler}
            >
              Видалити
            </button>
          )}
          {!liquidId && (
            <div
              className="col s2 offset-s0 grey darken-0 white-text center-align"
              style={{
                padding: 4,
                marginBottom: 4,
                marginLeft: "3%",
                marginRight: "5%"
              }}
            >
              Видалити
            </div>
          )}
          <button
            className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
            style={{
              padding: 4,
              marginBottom: 4,
              marginLeft: "4%",
              marginRight: "4%"
            }}
            onClick={prevPage}
          >
            Назад
          </button>
        </form>
      </div>
    );
  }
);
