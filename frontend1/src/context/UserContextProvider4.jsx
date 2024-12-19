import React, { useState } from "react";
import UserContext from "./UserContext";

function UserContextProvider4({ children }) {
  let [count3, setCount3] = useState(0);

  return (
    <UserContext.Provider value={{ count3, setCount3 }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider4;
