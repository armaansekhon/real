import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { useFonts } from 'expo-font';
import { UserProvider } from '../context/UserContext';
import useLogin from '../hooks/useLogin';

const Index = () => {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const { checkAuth } = useLogin();

  const [fontsLoaded] = useFonts({
    PlusEL: require('../assets/fonts/PlusJakartaSans-ExtraLight.ttf'),
    PlusL: require('../assets/fonts/PlusJakartaSans-Light.ttf'),
    PlusR: require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
    PlusSB: require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
    PlusB: require('../assets/fonts/PlusJakartaSans-Bold.ttf'),
  });

  useEffect(() => {
    const initializeApp = async () => {
      const { isAuthenticated } = await checkAuth();
      setIsAuthenticated(isAuthenticated);
      setCheckingAuth(false);
    };

    if (fontsLoaded) {
      initializeApp();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || checkingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#5aaf57" />
      </View>
    );
  }

  return (
    <UserProvider>
      {isAuthenticated ? (
        <Redirect href="/(drawer)/(tabs)/Home" />
      ) : (
        <Redirect href="/Onboard" />
      )}
    </UserProvider>
  );
};

export default Index;