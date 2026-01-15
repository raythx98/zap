/* eslint-disable react/prop-types */

import {createContext, useContext, useEffect, useState} from "react";
import {isAuthenticated as checkAuth} from "./helper/session";

const UrlContext = createContext();

const UrlProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuth());

  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, []);

  const logoutAction = () => {
    setIsAuthenticated(false);
  };

  return (
    <UrlContext.Provider value={{isAuthenticated, setIsAuthenticated, logoutAction}}>
      {children}
    </UrlContext.Provider>
  );
};

export const UrlState = () => {
  return useContext(UrlContext);
};

export default UrlProvider;