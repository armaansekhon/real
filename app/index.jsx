import { Text } from 'react-native'
import { Redirect } from "expo-router";
import React from 'react';
import AppLoading from 'expo-app-loading'; 
import {useFonts} from "expo-font"
import { SafeAreaView } from 'react-native-safe-area-context'



const index = () => {
    const [fontsLoaded]=useFonts({
        "PlusEL":require("../assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
        "PlusL":require("../assets/fonts/PlusJakartaSans-Light.ttf"),
        "PlusR":require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
        "PlusSB":require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
        "PlusB":require("../assets/fonts/PlusJakartaSans-Bold.ttf")
    });
    if (!fontsLoaded) {
      return <AppLoading />; }

  return (
    <Redirect href="/Onboard" />

   
  )
}

export default index