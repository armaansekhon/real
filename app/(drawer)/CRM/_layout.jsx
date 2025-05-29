import { Stack } from "expo-router";
import React from "react";


const Layout = () => {
  return (

    <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
         <Stack.Screen name="AddLeads" options={{ title: "Add Leads", headerShown: false }} />
         <Stack.Screen name="ManageLeads" options={{ title: "Manage Leads", headerShown: false }} />
         <Stack.Screen name="Appointments" options={{ title: "Appointments", headerShown: false }} />
         <Stack.Screen name="Followup" options={{ title: "Followups", headerShown: false }} />
         <Stack.Screen name="AddCustomers" options={{ title: "Add Customers", headerShown: false }} />
         <Stack.Screen name="ManageCustomers" options={{ title: "Manage Customers", headerShown: false }} />

    </Stack>
  
  );
};

export default Layout;