import React from "react";
import { NavLink } from "react-router-dom";
import s from "../css/Route.module.css";

export const CarsComponent = React.memo(({ cars }) => {
    cars.sort((a, b) => a.governmentCarNumber > b.governmentCarNumber ? 1 : -1);
  return (
    <div className="row">
      {cars && (
        <form className="col s12">
          <div
            className="col s12 offset-s0 blue-grey darken-0 white-text center-align"
            style={{ marginBottom: 3, marginTop: 5 }}
          >
            Список наявних автомобілів
          </div>
        </form>
      )}
      {cars && (
        <form className="col s12">
          {window.innerWidth < 792 && (
            <div className={s.liquidTitle}>
              <div className={s.item}>Тип</div>
              <div className={s.item}>Д/номер</div>
              <div className={s.item}>Н/шасі</div>
              <div className={s.item}>Н/двигуна</div>
              <div className={s.item}>Пробіг</div>
              <div className={s.item}>Мотогодин</div>
            </div>
          )}
          {window.innerWidth >= 792 && (
            <div className={s.liquidTitle}>
              <div className={s.item}>Тип авто</div>
              <div className={s.item}>Державний номер</div>
              <div className={s.item}>Номер шасі</div>
              <div className={s.item}>Номер двигуна</div>
              <div className={s.item}>Пробіг авто</div>
              <div className={s.item}>Всього мотогодин</div>
            </div>
          )}
          {cars &&
            cars.map((car) => {
              return (
                <div key={car._id}>
                  <NavLink to={`/detail/${car._id}`}>
                    <div className={s.liquid}>
                      <div className={s.item}>{`${car.typeOfCar}`}</div>
                      <div
                        className={s.item}
                      >{`${car.governmentCarNumber}`}</div>
                      <div className={s.item}>{`${car.factoryCarNumber}`}</div>
                      <div className={s.item}>{`${car.carEngineNumber}`}</div>
                      <div className={s.item}>{`${car.totalCarMileage}`}</div>
                      <div className={s.item}>{`${car.carTimeTotal}`}</div>
                    </div>
                  </NavLink>
                </div>
              );
            })}
        </form>
      )}
    </div>
  );
});
