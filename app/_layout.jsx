import { UserProvider } from "@/context/UserContext";
import { ModuleProvider } from "@/context/ModuleContext";
import { Stack } from "expo-router";
import React from "react";

const RootLayout = () => {
  return (
 
    <UserProvider>
    <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>


        

      
  
    </Stack>
    </UserProvider>
 
  );
};

export default RootLayout;