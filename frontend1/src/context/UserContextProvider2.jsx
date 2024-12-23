import React, { useState } from "react";
import UserContext from "./UserContext";

function UserContextProvider2({ children }) {
  let [count1, setCount1] = useState(0);

  return (
    <UserContext.Provider value={{ count1, setCount1 }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider2;
