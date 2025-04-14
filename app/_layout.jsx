import { View, Text } from 'react-native'
import { Stack } from "expo-router";
import React from 'react'

const RootLayout = () => {
  return (
   <Stack  screenOptions={{headerShown:false , gestureEnabled:true}}>
    
    <Stack.Screen name="Login" options={{ headerShown: false }} />
    <Stack.Screen name="Onboard" options={{ headerShown: false }} />
  
   </Stack>
  )
}

export default RootLayout;