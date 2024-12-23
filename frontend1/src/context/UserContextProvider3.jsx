import React, { useState } from 'react'
import UserContext from './UserContext'

function UserContextProvider3({children}) {
   let [count2,setCount2]=useState(0)

  return (
    <UserContext.Provider value={{count2,setCount2}}>
       {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider3
