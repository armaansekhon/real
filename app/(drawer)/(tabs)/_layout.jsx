import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import CustomTabBar from "../../../components/CustomTabBar"



const TabLayout = () => {
  return (

    <Tabs
      screenOptions={{
        gestureEnabled: true,
      }}
      tabBar={(props) => <CustomTabBar {...props} />} // Pass all props to CustomTabBar
    >
      <Tabs.Screen name="Home" options={{ title: "Home", headerShown: false }} />
      <Tabs.Screen name="Notification" options={{ title: "Notifications", headerShown: false }} />
      <Tabs.Screen name="Profile" options={{ title: "Profile", headerShown: false }} />
    </Tabs>

  );
};

export default TabLayout;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "white" },
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      zIndex: 100,
    },
  });
  




  // AIzaSyBfn929pa3P522jsnDS8gn7mvxcYY7Z_RU