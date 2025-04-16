import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import * as SecureStore from 'expo-secure-store';


const Home = () => {
  const token =  SecureStore.getItemAsync('auth_token');
  const type = SecureStore.getItemAsync('userType');
  
  console.log("hello",type);
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={{ flex: 1, justifyContent: "center", backgroundColor:"white", alignItems: "center" }}>
      <Text>Welcome to the Home Screen!</Text>
    </View>

    {/* Add the CustomTabBar component */}
   
  </SafeAreaView>
  );
};

export default Home;