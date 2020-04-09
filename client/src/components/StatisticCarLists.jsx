import React from "react";
import { NewListLiquidsCount } from "../helpers/newListRoutsCount";
import s from "../css/Route.module.css";

var moment = require("moment");

export const StatisticCarLists = ({ carLists, firstDate, endDate }) => {
    carLists.sort((a, b) => a.listNumber > b.listNumber ? 1 : -1);
  return (
    <div>
      {carLists &&
        carLists.map((list) => {
          if (list.listDate <= endDate) {
            if (list.listDate >= firstDate) {
              let listLiquids = NewListLiquidsCount(list.listRoutes);
              listLiquids.sort((a, b) => a.name > b.name ? 1 : -1);
              let listWithoutCargo = 0;
              let listWithCargo = 0;
              let listTotal = 0;
              let listWithTrailer = 0;
              let listInATow = 0;
              let listWeight = 0;
              let listTrailerWeight = 0;
              let listCargoWeight = 0;
              let listTime = 0;
              list.listRoutes.map((route) => {
                listWithoutCargo = listWithoutCargo + route.routeWithoutCargo;
                listWithCargo = listWithCargo + route.routeWithCargo;
                listWithTrailer = listWithTrailer + route.routeWithTrailer;
                listInATow = listInATow + route.routeInaTow;
                listTrailerWeight = listTrailerWeight + route.trailerWeight;
                listCargoWeight = listCargoWeight + route.cargoWeight;
                listTime = listTime + route.routTotalTime;
                listTotal = listTotal + route.routeTotal;
                return route;
              });
              listWeight = listTrailerWeight + listTrailerWeight;
              return (
                <div key={list._id}>
                  {window.innerWidth < 792 && (
                    <div className={s.liquid}>
                      <div className={s.item}>Дата</div>
                      <div className={s.item}>№ ДЛ</div>
                      <div className={s.item}>З вант.</div>
                      <div className={s.item}>Без в.</div>
                      <div className={s.item}>Заг.</div>
                      <div className={s.item}>З прич.</div>
                      <div className={s.item}>Букс.</div>
                      <div className={s.item}>Т(прич)</div>
                      <div className={s.item}>М/год</div>
                    </div>
                  )}
                  {window.innerWidth >= 792 && (
                    <div className={s.liquid}>
                      <div className={s.item}>Дата</div>
                      <div className={s.item}>№ листа</div>
                      <div className={s.item}>З вантажем</div>
                      <div className={s.item}>Без вантажу</div>
                      <div className={s.item}>Загалом</div>
                      <div className={s.item}>З причіпом</div>
                      <div className={s.item}>На буксирі</div>
                      <div className={s.item}>Тонн(причіпу)</div>
                      <div className={s.item}>М/г(Т/км)</div>
                    </div>
                  )}
                  <div className={s.liquid}>
                    <div className={s.item}>{`${moment(list.listDate).format(
                      "DD/MM/YY"
                    )}`}</div>
                    <div className={s.item}>{`${list.listNumber}`}</div>
                    <div className={s.item}>{`${listWithCargo}`}</div>
                    <div className={s.item}>{`${listWithoutCargo}`}</div>
                    <div className={s.item}>{`${listTotal}`}</div>
                    <div className={s.item}>{`${listWithTrailer}`}</div>
                    <div className={s.item}>{`${listInATow}`}</div>
                    <div className={s.item}>{`${listWeight}`}</div>
                    <div className={s.item}>{`${listTime}`}</div>
                  </div>
                  <div className={s.liquidTitle}>
                    <div className={s.item}>ПММ</div>
                    <div className={s.item}>Було</div>
                    <div className={s.item}>Надійшло</div>
                    <div className={s.item}>Вибуло</div>
                    <div className={s.item}>Разом</div>
                    <div className={s.item}>Витрата</div>
                  </div>
                  {listLiquids &&
                    listLiquids.map((liquid) => {
                      return (
                        <div key={liquid.name}>
                          <div className={s.liquidTitle}>
                            <div className={s.item}>{`${liquid.name}`}</div>
                            <div
                              className={s.item}
                            >{`${liquid.balanceStart}`}</div>
                            <div className={s.item}>{`${liquid.received}`}</div>
                            <div className={s.item}>{`${liquid.expended}`}</div>
                            <div
                              className={s.item}
                            >{`${liquid.balanceFinish}`}</div>
                            <div className={s.item}>{`${liquid.cost}`}</div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              );
            }
          }
          return undefined;
        })}
    </div>
  );
};
