export const NewListAddedRoutes = (listRoutes, Route, form) => {
  if (listRoutes) {
    const modifyListRoutes = listRoutes.filter(
      (rout) => rout._id !== Route._id
    );
    const newRouteLiquid = form;
    const newRouteLiquids = Route.routLiquids.concat([newRouteLiquid]);
    const newRoute = {
      ...Route,
      routLiquids: newRouteLiquids,
      _id: Route._id,
    };
    const newListRoutes = modifyListRoutes.concat([newRoute]);
    return newListRoutes;
  } else {
    const newListRoutes = listRoutes;
    return newListRoutes;
  }
};

export const NewListDeletedRoutes = (listRoutes, Route, liquidId) => {
  if (listRoutes) {
    const modifyRouteLiquids = Route.routLiquids.filter(
      (liq) => liq._id !== liquidId
    );
    const modifyListRoutes = listRoutes.filter(
      (rout) => rout._id !== Route._id
    );
    const newRoute = {
      ...Route,
      routLiquids: modifyRouteLiquids,
      _id: Route._id,
    };
    const deletedListRoutes = modifyListRoutes.concat([newRoute]);
    return deletedListRoutes;
  } else {
    const deletedListRoutes = listRoutes;
    return deletedListRoutes;
  }
};

export const NewListUpdatedRoutes = (listRoutes, form, Route, liquidId) => {
  if (listRoutes) {
    const modifyListRoutes = listRoutes.filter(
      (rout) => rout._id !== Route._id
    );
    const modifyRouteLiquids = Route.routLiquids.filter(
      (liq) => liq._id !== liquidId
    );
    const updatedRouteLiquids = modifyRouteLiquids.concat([form]);
    const newRoute = {
      ...Route,
      routLiquids: updatedRouteLiquids,
      _id: Route._id,
    };
    const updatedListRoutes = modifyListRoutes.concat([newRoute]);
    return updatedListRoutes;
  } else {
    const updatedListRoutes = listRoutes;
    return updatedListRoutes;
  }
};

export const NewListLiquidsCount = (listRoutes) => {
  let oldRouteDate = "2050.01.01";
  let oldRouteArrival = "24.00";
  let listLiquids = [];
  if (!listRoutes) {
    listRoutes = [];
  }
  //--------------------------Find Array of all Liquids--------------------------//
  listRoutes.map((rout) => {
    rout.routLiquids.map((newLiquid) => {
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
        };
        listLiquids = listLiquids.concat([Liquid]);
      } else {
        let modifyLiquid = listLiquids.find(
          (liq) => liq.name === newLiquid.name
        );
        let modifyLiquidList = listLiquids.filter(
          (liq) => liq.name !== newLiquid.name
        );
        if (rout.routDate < oldRouteDate) {
          balanceStart = parseInt(newLiquid.balanceStart);
        } else if (rout.routDate > oldRouteDate) {
          balanceStart = parseInt(modifyLiquid.balanceStart);
        } else if (rout.routArrival < oldRouteArrival) {
          balanceStart = parseInt(newLiquid.balanceStart);
        } else {
          balanceStart = parseInt(modifyLiquid.balanceStart);
        }
        received =
          parseInt(modifyLiquid.received) + parseInt(newLiquid.received);
        expended =
          parseInt(modifyLiquid.expended) + parseInt(newLiquid.expended);
        if (rout.routDate < oldRouteDate) {
          balanceFinish = parseInt(modifyLiquid.balanceFinish);
        } else if (rout.routDate > oldRouteDate) {
          balanceFinish = parseInt(newLiquid.balanceFinish);
        } else if (rout.routArrival < oldRouteArrival) {
          balanceFinish = parseInt(modifyLiquid.balanceFinish);
        } else if (rout.routArrival > oldRouteArrival) {
          balanceFinish = parseInt(newLiquid.balanceFinish);
        }
        let Liquid = {
          name: newLiquid.name,
          balanceStart: balanceStart,
          received: received,
          expended: expended,
          balanceFinish: balanceFinish,
          cost: newLiquid.cost,
        };
        listLiquids = modifyLiquidList.concat([Liquid]);
      }
      return newLiquid;
    });
    oldRouteArrival = rout.routArrival;
    oldRouteDate = rout.routDate;
    return rout;
  });
  return listLiquids;
};

