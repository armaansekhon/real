import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // stores full user info
  const [userType, setUserType] = useState(null); // just userCategoryCode
  const [img, setimg] = useState(null); // just userCategoryCode
  const [date, setdate]= useState(null)
  const [branch, setbranch]=useState(null);
  const [userData,setuserData]=useState(null);

  return (
    <UserContext.Provider value={{ user, setUser, userType, setUserType ,img ,setimg, date , setdate,branch, setbranch,userData,setuserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
