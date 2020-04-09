import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { CarsPage } from "./pages/CarsPage";
import { DetailLiquidsPage } from "./pages/DetailLiquidsPage";
import { AuthPage } from "./pages/AuthPage";
import { CreatePage } from "./pages/CreatePage";
import { RegisterPage } from "./pages/RegisterPage";
import { DetailCarPage } from "./pages/DetailCarPage";
import { DetailListPage } from "./pages/DetailListPage";
import { DetailRoutePage } from './pages/DetailRoutePage';
import { CarLiquidsPage } from "./pages/CarLiquidsPage";
import { CarRowsPage } from "./pages/CarRowsPage";
import { StatisticLiquidsPage } from "./pages/StatisticLiquidsPage";

export const useRoutes = (isAuth, state) => {
  if (isAuth) {
    return (
      <Switch>
        <Route path="/cars" exact render={() => <CarsPage state = {state}/>} />
        <Route path="/create/:id" render={() => <CreatePage state = {state}/>} />
        <Route path="/create/" render={() => <CreatePage state = {state}/>} />
        <Route path="/detail/:id"  render={() => <DetailCarPage state = {state}/>} />
        <Route path="/detail/"  exact render={() => <DetailCarPage state = {state}/>} />
        <Route path="/list/:id"  render={() => <DetailListPage state = {state}/>} />
        <Route path="/list/"  exact render={() => <DetailListPage state = {state}/>} />
        <Route path="/route/:id"  render={() => <DetailRoutePage state = {state}/>} />
        <Route path="/route/" exact  render={() => <DetailRoutePage state = {state}/>} />
        <Route path="/liquid/:id" render={() => <DetailLiquidsPage state = {state} />} />
        <Route path="/liquid/" exact render={() => <DetailLiquidsPage state = {state}/>} />
        <Route path="/liquids/" exact render={() => <CarLiquidsPage state = {state}/>} />
        <Route path="/rows/" exact render={() => <CarRowsPage state = {state}/>} />
        <Route path="/liq/:id" render={() => <StatisticLiquidsPage state = {state} />} />
        <Route path="/liq/" exact render={() => <StatisticLiquidsPage state = {state} />} />
        <Redirect to="/cars" />
      </Switch>
    );
  }
  return (
    <Switch>
      <Route path="/" exact render={() => <AuthPage />} />
      <Route path="/register" exact render={() => <RegisterPage />} />
      <Redirect to="/" />
    </Switch>
  );
};
