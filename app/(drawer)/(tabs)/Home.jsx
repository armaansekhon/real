import { View, Text, SafeAreaView } from 'react-native';
import React, {useEffect} from 'react';
import * as SecureStore from 'expo-secure-store';


import { useUser } from '../../../context/UserContext';
import Adminhome from '../../../components/Adminhome';


const Home = () => {

  const { user, userType } = useUser();
  const token =  SecureStore.getItemAsync('auth_token');
  const type = SecureStore.getItemAsync('userType');
  

  useEffect(() => {
    // console.log("HomeScreen - User Context:", user);
    console.log("HomeScreen - User Type:", userType);
  }, [user, userType]);

  // console.log("hello",type);
  return (
 
 
    
      <Adminhome></Adminhome>
    
   
 

  );
};

export default Home;