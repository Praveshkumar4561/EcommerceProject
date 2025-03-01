import React, { useState } from "react";
import UserContext from "./UserContext";

function UserContextProvider5({ children }) {
  let [count6, setCount6] = useState(0);

  return (
    <UserContext.Provider value={{ count6, setCount6 }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider5;