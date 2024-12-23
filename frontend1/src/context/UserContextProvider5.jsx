import React, { useState } from "react";
import UserContext from "./UserContext";

function UserContextProvider5({ children }) {
  let [count5, setCount5] = useState(0);

  return (
    <UserContext.Provider value={{ count5, setCount5 }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider5;