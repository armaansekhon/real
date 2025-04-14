import { Stack } from "expo-router";
import React from "react";

const AuthLayout = () => {
  return (
    <Stack initialRouteName="Onboard" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" />
      <Stack.Screen name="Onboard" />
    </Stack>
  );
};

export default AuthLayout;