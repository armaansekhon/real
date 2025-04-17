import React from "react";
import { Drawer } from "expo-router/drawer";

import CustomDrawer from "../../components/CustomDrawer";
import { modules } from "../../constants/modules";

const DrawerLayout = () => {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "white" },
        drawerHideStatusBarOnOpen:"true",
        drawerActiveBackgroundColor: "rgba(90, 175, 87, 0.2)", // Transparent green background for active item
        drawerActiveTintColor: "#5aaf57", // Darker green for active text and icon
        drawerInactiveTintColor: "#000", // Default color for inactive text and icon
       
     
        
        // headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
       
 
    {modules.map((module) => (
        <Drawer.Screen
          key={module.name}
          name={module.name}
          options={{ title: module.title }}
        />
      ))}
    
     
    </Drawer>
  );
};

export default DrawerLayout;