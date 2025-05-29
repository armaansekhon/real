import { Stack } from "expo-router";
import React from "react";


const RootLayout = () => {
  return (

    <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
         <Stack.Screen name="MonthlySalary" options={{ title: "MonthlySalary", headerShown: false }} />
        <Stack.Screen name="ViewSalary" options={{ title: "ViewSalary", headerShown: false }} />
        

    </Stack>
  
  );
};

export default RootLayout;