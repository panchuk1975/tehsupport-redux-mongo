import { createContext } from "react";

//-------------------Empty function NOOP-------------------//
function noop() {}
//----------------------Common context---------------------//
export const AuthContext = createContext({
  token: null,
  userId: null,
  login: noop,
  logout: noop,
  isAuth: false
});
