import { Stack } from "expo-router";
import React from "react";


const RootLayout = () => {
  return (

    <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
         <Stack.Screen name="ExistingEmployees" options={{ title: "Update Status", headerShown: false }} />
       

    </Stack>
  
  );
};

export default RootLayout;