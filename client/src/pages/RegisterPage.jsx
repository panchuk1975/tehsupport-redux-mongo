import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useHttp } from "../hooks/httpHooks";
import { useMessage } from "../hooks/messageHook";


export const RegisterPage = () => {
 
  //-------------------Redirect register-----------------------//
  let history = useHistory();
  //---------------------Use HTTP HOOK-------------------------//
  const { loading, error, request, clearError } = useHttp();
  //-------------------Use message HOOK------------------------//
  const message = useMessage();
  //------------------Make form for login----------------------//
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    secondName: "",
    mobilePhon: "",
    address: "",
    company: "",
    liquids: [], 
    cars: [] 
  });
  //---------------------Error processing----------------------//
  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);
  //-------------------Textarea activation---------------------//
  useEffect(() => {
    window.M.updateTextFields();
  }, []);
  //-------------------Event change Handler--------------------//
  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  //-----------------Server request for register----------------//
  const registerHandler = async () => {
    try {
      const data = await request("/api/auth/register", "POST", { ...form });
      message(data.message); // Message User was created
    } catch (e) {}
  };
  //------------------------------------------------------------//
  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Teh-support</h1>
        <div className="card blue-grey darken-1">
          <div className="card-content black-text">
            <span className="card-title">Регістрація</span>
            <div>
              
              <div className="input-field">
                <input // - get input from https://materializecss.com/
                  placeholder="Введіть email"
                  id="email"
                  type="email"
                  className="yellow-input"
                  name="email"
                  value = {form.email}
                  onChange={changeHandler}
                  required
                />
                <label htmlFor="email">Email</label>
              </div>
              
              <div className="input-field">
                <input
                  placeholder="Введіть пароль"
                  id="password"
                  type="password"
                  className="yellow-input"
                  name="password"
                  value = {form.password}
                  onChange={changeHandler}
                  required
                />
                <label htmlFor="password">Password</label>
              </div>
              
              <div className="input-field">
                <input
                  placeholder="Вaше ім'я"
                  id="firstName"
                  type="text"
                  className="yellow-input"
                  name="firstName"
                  value = {form.firstName}
                  onChange={changeHandler}
                  required
                />
                <label htmlFor="firstName">Ваше ім'я</label>
              </div>
              
              <div className="input-field">
                <input
                  placeholder="Ваше призвіще"
                  id="secondName"
                  type="text"
                  className="yellow-input"
                  name="secondName"
                  value = {form.secondName}
                  onChange={changeHandler}
                  required
                />
                <label htmlFor="secondName">Ваше призвіще</label>
              </div>

              <div className="input-field">
                <input
                  placeholder="Телефон"
                  id="mobilePhon"
                  type="tel"
                  className="yellow-input"
                  name="mobilePhon"
                  value = {form.mobilePhon}
                  onChange={changeHandler}
                  required
                />
                <label htmlFor=" mobilePhon">Телефон</label>
              </div>

              <div className="input-field">
                <input
                  placeholder="Адреса"
                  id="address"
                  type="text"
                  className="yellow-input"
                  name="address"
                  value = {form.address}
                  onChange={changeHandler}
                  required
                />
                <label htmlFor="address">Адреса</label>
              </div>

              <div className="input-field">
                <input
                  placeholder="Організація"
                  id="company"
                  type="text"
                  className="yellow-input"
                  name="company"
                  value = {form.company}
                  onChange={changeHandler}
                  required
                />
                <label htmlFor="company">Організація</label>
              </div>
            </div>
          </div>
          <div className="card-action">
            <button
              style={{ marginRight: 10 }}
              className="btn grey lighten-1 black-text "
              onClick={registerHandler}
              disabled={loading}
            >
              Реєстрація
            </button>
            <button
              className="btn yellow darken-3 black-text"
              onClick={() => {
                history.push("/");
              }}   
              disabled={loading}
            >
              Вхід
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
