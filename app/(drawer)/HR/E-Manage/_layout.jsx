import { Stack } from "expo-router";
import React from "react";


const RootLayout = () => {
  return (

    <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
         <Stack.Screen name="AddEmp" options={{ title: "Home", headerShown: false }} />
         <Stack.Screen name="MarAttend" options={{ title: "Employee Attendence", headerShown: false }} />
    </Stack>
  
  );
};

export default RootLayout;