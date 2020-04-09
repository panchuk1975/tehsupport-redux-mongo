import React from "react";
import { useParams } from "react-router-dom";
import { StatisticLiquidComponent } from "../components/StatisticLiquidComponent";
import { NewCarsLiquidsCount } from "../helpers/newCarLiquidsCount";

export const StatisticLiquidsPage = React.memo(({ state }) => {
  //-----------------------Get ID our Liquid ID------------------------//
  const liquidId = useParams().id;
  //-----------------Get valid Cars from Local Storage-----------------//
  let cars = state.cars.cars;
  if (!cars) {
    cars = JSON.parse(localStorage.getItem("State"));
  }
  //----------------Get valid Liquids from Local Storage---------------//
  let liquids = state.liquids.liquids;
  console.log(liquids);
  if (!liquids) {
    liquids = JSON.parse(localStorage.getItem("Liquids"));
  }
  const oldDate = JSON.parse(localStorage.getItem("Date"));
  const countListLiquids = NewCarsLiquidsCount(
    cars,
    oldDate.firstDate,
    oldDate.endDate
  );
  //---------------------------Get our Liquid---------------------------//
  let liquid =  countListLiquids.find((Liq) => Liq.name.replace(/\s/g, "") === liquidId);
  if (!liquid) {
    liquid = liquids.find((Liq) => Liq._id === liquidId);
  } else if (!liquid) {
    liquid = countListLiquids.find((Liq) => Liq._id === liquidId);
  }
  localStorage.setItem(
    "Liquid",
    JSON.stringify({
      ...liquid,
    })
  );
  //--------------------------------JSX---------------------------------//
  return (
    <div>
      <StatisticLiquidComponent liquid={liquid} liquidId={liquidId} />
    </div>
  );
});
