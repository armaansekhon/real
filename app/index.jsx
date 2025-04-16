import { Text } from 'react-native'
import { Redirect } from "expo-router";
import React, {useState, useEffect} from 'react';
import AppLoading from 'expo-app-loading'; 
import {useFonts} from "expo-font"
import { SafeAreaView } from 'react-native-safe-area-context'

import { View, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

export  function AppEntry() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();


  useEffect(() => {
    const checkLogin = async () => {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        router.replace("/(drawer)/(tabs)/Home");
      } else {
        router.replace("/Login");
      }
      setCheckingAuth(false);
    };

    checkLogin();
  }, []);

  if (checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return null;
}

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