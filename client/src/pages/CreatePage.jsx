import React, { useEffect, useState, useContext } from "react";
import { useHttp } from "../hooks/httpHooks";
import { AuthContext } from "../context/authContext";
import { useHistory } from "react-router-dom";
import { useMessage } from "../hooks/messageHook";
import { Loader } from "../components/Loader";
import { useParams } from "react-router-dom";
import { inputRightClassSize } from "../hooks/resizeHook";
import { NavLink } from "react-router-dom";

export const CreatePage = React.memo(({ state }) => {
  //--------------------------Get Cars-------------------------//
  let cars = state.cars.cars;
  //-----------------------Get ID our Car----------------------//
  let carId = useParams().id; //useParams().id
  //-----------------Use authHook for context------------------//
  const auth = useContext(AuthContext);
  //---------------==----Use message HOOK----------------------//
  const message = useMessage();
  //---------------Use http hook for request-------------------//
  const { request, loading, error, clearError } = useHttp();
  //------------------------Get Car----------------------------//
  //--------------------To CarCard page------------------------//
  const prevPage = () => {
    history.push(`/cars/`);
  };
  //------------------------Get Car----------------------------//
  let car = JSON.parse(localStorage.getItem("Car"));
  if (cars) {
    car = state.cars.cars.find((car) => car._id === carId);
  }
  //----------------------New Car Form-------------------------//
  let initialForm = {};
  if (carId) {
    initialForm = car;
  } else {
    initialForm = {
      typeOfCar: "",
      governmentCarNumber: "",
      factoryCarNumber: "",
      dateOfRegistration: "",
      carEngineNumber: "",
      carPassportNumber: "",
      specialCarEquipment: "Відсутнє",
      specialCarEquipmentNumber: "-----",
      carOwnerName: "",
      dateOfCarProduction: "",
      operatingGroup: "",
      category: "2",
      carIndicatorFirst: "0",
      carIndicatorLast: "",
      totalCarMileage: "",
      carTimeFirst: "0",
      carTimeLast: "0",
      carTimeTotal: "0",
      fuelActiveСonsumption: "",
      fuelPassiveСonsumption: "",
      carLiquids: [],
      carLists: [],
    };
  }
  //--------------------Make a form for Car-------------------//
  let [form, setForm] = useState({ ...initialForm });
  //------------------------Math block------------------------//
  let carMileage = 0;
  if (car) {
    car.carLists.map((list) => {
      carMileage = list.indicatorListFinish + carMileage;
      return list;
    });
    form.totalCarMileage = form.carIndicatorLast + carMileage;
  } else {
    form.totalCarMileage = form.carIndicatorLast;
  }
  let carTime = 0;
  if (car) {
    car.carLists.map((list) => {
      carTime = list.timeListLast + carTime;
      return list;
    });
    form.carTimeTotal = parseInt(form.carTimeLast) + parseInt(carTime);
  } else {
    form.carTimeTotal = parseInt(form.carTimeLast);
  }
  //------------------Textarea activation--------------------//
  useEffect(() => {
    window.M.updateTextFields();
  }, []);
  //------------------Event change Handler-------------------//
  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  //------------------------History--------------------------//
  const history = useHistory();
  //-----------------------Create Car------------------------//
  const pressHandler = async () => {
    try {
      const data = await request(
        "/api/car/create",
        "POST",
        { ...form },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      message(data.message);
      history.push("/cars/");
    } catch (e) {}
  };
  //------------------------Update Car------------------------//
  const pressUpdater = async () => {
    try {
      const data = await request(
        "/api/car/update",
        "PUT",
        { ...form },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
      message(data.message);
      history.push(`/detail/${carId}`);
    } catch (e) {}
  };
  //----------------------Error processing---------------------//
  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);
  //-----------------------Loading in process------------------//
  if (loading) {
    return <Loader />;
  }
  //-------------------Initializide class Size-------------------//
  let cardClass = inputRightClassSize(window.innerWidth, window.screen.width);
  //----------------------------JSX---------------------------//
  return (
    <div className="row">
      <form className="col s12">
        <div
          className="col s12 offset-s0 blue-grey darken-0 white-text center-align"
          style={{ marginBottom: 3, marginTop: 10 }}
        >
          <h5>Автомобіль {carId && `№ ${form.governmentCarNumber}`}</h5>
        </div>
        <span className="card-title white-text center-align">
          Створити нове авто
        </span>
        <div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Тип авто"
              id="typeOfCar"
              type="text"
              className="yellow-input"
              name="typeOfCar"
              value={form.typeOfCar}
              onChange={changeHandler}
            />
            <label htmlFor="typeOfCar">Тип авто</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Державний номер"
              id="governmentCarNumber"
              type="text"
              className="yellow-input"
              name="governmentCarNumber"
              value={form.governmentCarNumber}
              onChange={changeHandler}
            />
            <label htmlFor="governmentCarNumber">Державний номер</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Заводський номер"
              id="factoryCarNumber"
              type="text"
              className="yellow-input"
              name="factoryCarNumber"
              value={form.factoryCarNumber}
              onChange={changeHandler}
            />
            <label htmlFor="factoryCarNumber">Заводський номер</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Дата регістрації"
              id="dateOfRegistration"
              type="date"
              className="yellow-input"
              name="dateOfRegistration"
              value={form.dateOfRegistration}
              onChange={changeHandler}
            />
            <label htmlFor="dateOfRegistration">Дата регістрації</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Номер двигуна"
              id="carEngineNumber"
              type="text"
              className="yellow-input"
              name="carEngineNumber"
              value={form.carEngineNumber}
              onChange={changeHandler}
            />
            <label htmlFor="carEngineNumber">Номер двигуна</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Номер паспорта"
              id="carPassportNumber"
              type="text"
              className="yellow-input"
              name="carPassportNumber"
              value={form.carPassportNumber}
              onChange={changeHandler}
            />
            <label htmlFor="carPassportNumber">Номер паспорта</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Спецобладнання"
              id="specialCarEquipment"
              type="text"
              className="yellow-input"
              name="specialCarEquipment"
              value={form.specialCarEquipment}
              onChange={changeHandler}
            />
            <label htmlFor="specialCarEquipment">Спецобладнання</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Номер спецобладнання"
              id="specialCarEquipmentNumber"
              type="text"
              className="yellow-input"
              name="specialCarEquipmentNumber"
              value={form.specialCarEquipmentNumber}
              onChange={changeHandler}
            />
            <label htmlFor="specialCarEquipmentNumber">
              Номер спецобладнання
            </label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Власник"
              id="carOwnerName"
              type="text"
              className="yellow-input"
              name="carOwnerName"
              value={form.carOwnerName}
              onChange={changeHandler}
            />
            <label htmlFor="carOwnerName">Власник авто</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Дата виробництва"
              id="dateOfCarProduction"
              type="text"
              className="yellow-input"
              name="dateOfCarProduction"
              value={form.dateOfCarProduction}
              onChange={changeHandler}
            />
            <label htmlFor="dateOfCarProduction">Дата виробництва</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Група експлуатації"
              id="operatingGroup"
              type="text"
              className="yellow-input"
              name="operatingGroup"
              value={form.operatingGroup}
              onChange={changeHandler}
            />
            <label htmlFor="operatingGroup">Група експлуатації</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Категорія"
              id="category"
              type="text"
              className="yellow-input"
              name="category"
              value={form.category || "2"}
              onChange={changeHandler}
            />
            <label htmlFor="category">Категорія</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Початковий спідометр"
              id="carIndicatorFirst"
              type="number"
              className="yellow-input"
              name="carIndicatorFirst"
              value={form.carIndicatorFirst || "0"}
              onChange={changeHandler}
            />
            <label htmlFor="carIndicatorFirst">Початковий спідометр</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Останній спідометр"
              id="carIndicatorLast"
              type="number"
              className="yellow-input"
              name="carIndicatorLast"
              value={form.carIndicatorLast || ""}
              onChange={changeHandler}
            />
            <label htmlFor="carIndicatorLast">Останній спідометр</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Загальний пробіг"
              id="totalCarMileage"
              type="number"
              className="yellow-input"
              name="totalCarMileage"
              value={form.totalCarMileage || "0"}
              onChange={changeHandler}
            />
            <label htmlFor="totalCarMileage">Загальний пробіг</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Початкові мотогодини"
              id="carTimeFirst"
              type="number"
              className="yellow-input"
              name="carTimeFirst"
              value={form.carTimeFirst || "0"}
              onChange={changeHandler}
            />
            <label htmlFor="carTimeFirst">Початкові мотогодини</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Останні мотогодини"
              id="carTimeLast"
              type="number"
              className="yellow-input"
              name="carTimeLast"
              value={form.carTimeLast || "0"}
              onChange={changeHandler}
            />
            <label htmlFor="carTimeLast">Останні мотогодини</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Всього мотогодин"
              id="carTimeTotal"
              type="number"
              className="yellow-input"
              name="carTimeTotal"
              value={form.carTimeTotal || "0"}
              onChange={changeHandler}
            />
            <label htmlFor="carTimeTotal">Всього мотогодин</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Палива на км"
              id="fuelActiveСonsumption"
              type="number"
              className="yellow-input"
              name="fuelActiveСonsumption"
              value={form.fuelActiveСonsumption || ""}
              onChange={changeHandler}
            />
            <label htmlFor="fuelActiveСonsumption">Палива на км</label>
          </div>
          <div className={`${cardClass} input-field`}>
            <input
              placeholder="Палива на годину"
              id="fuelPassiveСonsumption"
              type="number"
              className="yellow-input"
              name="fuelPassiveСonsumption"
              value={form.fuelPassiveСonsumption || ""}
              onChange={changeHandler}
            />
            <label htmlFor="fuelPassiveСonsumption">Палива на годину</label>
          </div>
        </div>
      </form>

      <form className="col s12">
        {!carId && (
          <button
            className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
            style={{
              padding: 5,
              marginBottom: 4,
              marginLeft: "0%",
              marginRight: "2%",
            }}
            onClick={pressHandler}
            disabled={loading}
          >
            Додати
          </button>
        )}
        {carId && (
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
        {carId && (
          <button
            className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
            style={{
              padding: 5,
              marginBottom: 4,
              marginLeft: "2%",
              marginRight: "2%",
            }}
            onClick={pressUpdater}
            disabled={loading}
          >
            Обновити
          </button>
        )}
        {!carId && (
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
        {carId && (
          <button
            className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
            style={{
              padding: 5,
              marginBottom: 4,
              marginLeft: "2%",
              marginRight: "2%",
            }}
            // onClick={deleteHandler}
          >
            Видалити
          </button>
        )}
        {!carId && (
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

        {carId && (
          <NavLink to={"/list/"}>
            <button
              className="col s2 offset-s0 blue-grey darken-0 white-text center-align"
              style={{
                padding: 5,
                marginBottom: 4,
                marginLeft: "2%",
                marginRight: "2%",
              }}
            >
              + Лист
            </button>
          </NavLink>
        )}
        {!carId && (
          <div
            className="col s2 offset-s0 grey darken-0 white-text center-align"
            style={{
              padding: 5,
              marginBottom: 4,
              marginLeft: "2%",
              marginRight: "2%",
            }}
          >
            + Лист
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
    </div>
  );
});
