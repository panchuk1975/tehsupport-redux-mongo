import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { useHttp } from "../hooks/httpHooks";
import { useMessage } from "../hooks/messageHook";
import { AuthContext } from "../context/authContext";

export const AuthPage = () => {
  //----------------------Use context--------------------------//
  const auth = useContext(AuthContext);
  //-------------------Redirect register-----------------------//
  let history = useHistory();
  //---------------------Use HTTP HOOK-------------------------//
  const { loading, error, request, clearError } = useHttp();
  //-------------------Use message HOOK------------------------//
  const message = useMessage();
  //------------  ----Make form for login----------------------//
  const [form, setForm] = useState({
    email: "",
    password: ""
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
  //-----------------Server request for login----------------//
  const loginHandler = async () => {
    try {
      const data = await request("/api/auth/login", "POST", { ...form });
      auth.login(data.token, data.userId); // put login data
    } catch (e) {}
  };
  //------------------------------------------------------------//
  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>Teh-support</h1>
        <div className="card blue-grey darken-1">
          <div className="card-content black-text">
            <span className="card-title">Авторізація</span>
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
            </div>
          </div>
          <div className="card-action">
            <button
              className="btn yellow darken-3 black-text"
              style={{ marginRight: 10 }}
              onClick={loginHandler}
              disabled={loading}
            >
              Вхід
            </button>
            <button
              className="btn grey lighten-1 black-text "
              onClick={() => {
                history.push("/register");
              }}   
              //onClick={registerHandler}
              disabled={loading}
            >
              Реєстрація
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
