import { Stack } from "expo-router";
import React from "react";


const Layout = () => {
  return (

    <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
         <Stack.Screen name="ApplyLeave" options={{ title: "Apply Leave", headerShown: false }} />
         <Stack.Screen name="ManageLeaves" options={{ title: "Manage Leaves", headerShown: false }} />
        
    </Stack>
  
  );
};

export default Layout;