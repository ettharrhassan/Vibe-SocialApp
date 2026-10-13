import React, { createContext, useEffect, useState } from "react";

export let AuthCreatedContext = createContext();

export default function AuthContext(props) {

  const [token, setToken] = useState(function(){return localStorage.getItem("token")});

  function addDataToToken(tkn: string) {

    setToken(tkn);

    localStorage.setItem("token", tkn);

  }
  function removeToken(){
    localStorage.removeItem("token")
    setToken(null)

  }
  return (
    <>
      <AuthCreatedContext.Provider value={{ token, addDataToToken ,removeToken }}>
        {props.children}
      </AuthCreatedContext.Provider>
    </>
  );
}
