import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';


const Home = () => {

  return (
    <SafeAreaView style={{ backgroundColor:"white", flex: 1 }}>
    <View style={{ flex: 1, justifyContent: "center", backgroundColor:"white", alignItems: "center" }}>
      <Text>Welcome to the Home Screen!</Text>
    </View>

    {/* Add the CustomTabBar component */}
   
  </SafeAreaView>
  );
};

export default Home;