import { NewCarLiquidsCount } from "./newListRoutsCount";

export const NewCarsLiquidsCount = (cars, firstDate, endDate) => {
  let arrayOfAllLiquids = [];
  let listLiquids = [];
  //--------------------------Find Array of all Liquids--------------------------//
  if (cars) {
    cars.map((car) => {
      arrayOfAllLiquids = arrayOfAllLiquids.concat(
        NewCarLiquidsCount(car.carLists, firstDate, endDate)
      );
      return car;
    });
  }
  //------------------------------Sort list of Liquids---------------------------//
  arrayOfAllLiquids.map((newLiquid) => {
    let balanceStart = 0;
    let received = 0;
    let expended = 0;
    let balanceFinish = 0;

    let existLiquid = listLiquids.find((liq) => liq.name === newLiquid.name);
    if (!existLiquid) {
      balanceStart = balanceStart + parseInt(newLiquid.balanceStart);
      received = received + parseInt(newLiquid.received);
      expended = expended + parseInt(newLiquid.expended);
      balanceFinish = balanceFinish + parseInt(newLiquid.balanceFinish);

      let Liquid = {
        name: newLiquid.name,
        balanceStart: balanceStart,
        received: received,
        expended: expended,
        balanceFinish: balanceFinish,
        cost: newLiquid.cost,
        density: newLiquid.density,
        _id: newLiquid._id,
      };
      listLiquids = listLiquids.concat([Liquid]);
    } else {
      let modifyLiquid = listLiquids.find((liq) => liq.name === newLiquid.name);
      let modifyLiquidList = listLiquids.filter(
        (liq) => liq.name !== newLiquid.name
      );
      balanceStart =
        parseInt(modifyLiquid.balanceStart) + parseInt(newLiquid.balanceStart);
      received = parseInt(modifyLiquid.received) + parseInt(newLiquid.received);
      expended = parseInt(modifyLiquid.expended) + parseInt(newLiquid.expended);
      balanceFinish =
        parseInt(modifyLiquid.balanceFinish) +
        parseInt(newLiquid.balanceFinish);
      let Liquid = {
        name: newLiquid.name,
        balanceStart: balanceStart,
        received: received,
        expended: expended,
        balanceFinish: balanceFinish,
        cost: newLiquid.cost,
        density: newLiquid.density,
        _id: newLiquid._id,
      };
      listLiquids = modifyLiquidList.concat([Liquid]);
    }
    return newLiquid;
  });
  return listLiquids;
};
