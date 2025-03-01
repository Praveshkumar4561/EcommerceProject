import React, { useEffect, useState } from "react";
import UserContext from "./UserContext";

function UserContextProvider({ children }) {
  let [count, setCount] = useState(0);

  return (
    <UserContext.Provider value={{ count, setCount }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;
