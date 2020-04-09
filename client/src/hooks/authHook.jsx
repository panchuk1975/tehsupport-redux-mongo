import { useState, useCallback, useEffect } from "react";

export const useAuth = () => {
  //--------------------Set LOCAL STORAGE NAME------------------------//
  const storageName = "userData";
  //-------------------State for TOKEN and userID---------------------//
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [ready, setReady] = useState(false);
  //--------------------------Auth methods---------------------------//
  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserId(id);
    localStorage.setItem(
      storageName,
      JSON.stringify({
        userId: id,
        token: jwtToken
      })
    )
  }, []);
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(storageName);
  }, []);
  //-----------------Autologin if localStorage exist------------------//
  useEffect(() => {
    // make object from JSON
    const data = JSON.parse(localStorage.getItem(storageName));
    if (data && data.token) {
      // write into state for autologin
      login(data.token, data.userId);
    }
    setReady(true);
  }, [login]);
  //------------Export to App.js--------------//
  return { login, logout, token, userId, ready };
};
