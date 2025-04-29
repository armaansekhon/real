import { Stack } from "expo-router";
import React from "react";

const InventoryManagementLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: true }}>
      <Stack.Screen name="ViewLeads" options={{ title: "View Leads", headerShown: false }} />
      <Stack.Screen name="AssignLead" options={{ title: "Assign Lead", headerShown: false }} />
      <Stack.Screen name="AddLead" options={{ title: "Add Lead", headerShown: false }} />
      <Stack.Screen name="FollowUp" options={{ title: "Follow Up", headerShown: false }} />
    </Stack>
  );
};

export default InventoryManagementLayout;
