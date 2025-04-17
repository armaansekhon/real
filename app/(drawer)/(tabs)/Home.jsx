import { View, Text, SafeAreaView } from 'react-native';
import React, {useEffect} from 'react';
import * as SecureStore from 'expo-secure-store';


import { useUser } from '../../../context/UserContext';


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
 
    <SafeAreaView style={{ flex: 1 }}>
    <View style={{ flex: 1, justifyContent: "center", backgroundColor:"white", alignItems: "center" }}>
      <Text>Welcome to the Home Screen!</Text>
      <Text>Welcome {user?.name || 'Guest'}!</Text>
      <Text>User Type: {userType}</Text>
    </View>

    {/* Add the CustomTabBar component */}
   
  </SafeAreaView>

  );
};

export default Home;