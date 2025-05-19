import { Stack } from "expo-router";
import React from "react";


const Layout = () => {
  return (

    <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
         <Stack.Screen name="MovementRequest" options={{ title: "Movement Request", headerShown: false }} />
         <Stack.Screen name="ManageMovement" options={{ title: "Manage Movement", headerShown: false }} />

    </Stack>
  
  );
};

export default Layout;