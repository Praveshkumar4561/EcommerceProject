// import React, { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import UserContext from "../context/UserContext"; 

// const Protected = ({children}) => {
//   const { isAuthenticated } = useContext(UserContext);

//   if (!isAuthenticated) {
//     return <Navigate to="/login" />;
//   }
//   else if(isAuthenticated){
//     return <Navigate to="/home-page"/>
//   }
//   return children;
// };

// export default Protected;