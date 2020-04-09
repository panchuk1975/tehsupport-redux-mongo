import React, { useContext, useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export const Navbar = () => {
  //----------------Use useContext and use History----------//
  const auth = useContext(AuthContext); // - use our context
  //-----------------------Make redirect--------------------//
  const history = useHistory(); // for make pages navigation
  //------------------Event handler for logout---------------//
  const logoutHandler = event => {
    event.preventDefault(); // prevent redirect <a>
    auth.logout(); // do logout
    history.push("/"); // redirect to main page
  };
  //--------Chech windows size with  useeffect and Size State---------//
  //-----------------------------Time out------------------------------//
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
  //----------------------------Size State-------------------------------//
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    width: window.innerWidth
  });
  useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth
      });
    }, 100);
    window.addEventListener("resize", debouncedHandleResize);
    return _ => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  });
  //---------------------------JSX------------------------------------------//
  return (
    <nav>
      <div
        key={dimensions}
        className="nav-wrapper card blue-grey darken-1"
        style={{ padding: "0 2rem" }}
      >
        {window.innerWidth > 640 && window.screen.width > 640 && (
          <a href="/" className="brand-logo left">
            Teh-support
          </a>
        )}
        <ul className="right hide-on-med-and-dow" id="mobile-demo">
          <li>
            <NavLink to="/create">Нове авто</NavLink>
          </li>
          <li>
            <NavLink to="/cars">Авто</NavLink>
          </li>
          <li>
            <NavLink to="/liquids">ПММ</NavLink>
          </li>
          <li>
            <NavLink to="/rows">ЕТЗ</NavLink>
          </li>
          <li>
            <a href="/" onClick={logoutHandler}>
              Exit
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
