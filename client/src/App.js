import React from "react";
import "materialize-css";
import { useRoutes } from "./routes";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/reduxStore";
import { useAuth } from "./hooks/authHook";
import { AuthContext } from "./context/authContext";
import { Navbar } from "./components/Navbar";
import { Loader } from "./components/Loader";

function App(props) {
  //-------------Get contexxt from authContext------------//
  const { token, login, logout, userId, ready } = useAuth();
  //---------Make boolean isAAuth from real token---------//
  const isAuth = !!token;
  //--------Get routes from routes.jsx use isAuth---------//
  const routes = useRoutes(isAuth, props.state);
  //---------------------Loader----------------------------//
  if (!ready) {
    return <Loader />;
  }
 //-------------------------JSX---------------------------//
  return (
    // - common context MAST TO BE "PROVIDER"!!!
    <AuthContext.Provider 
      value={{
        token,
        login,
        logout,
        userId,
        isAuth
      }}
      state={props.state}
      store={store}
    >
      <BrowserRouter>
        {isAuth && <Navbar />}
        <div className="conteiner">
            { routes }
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
