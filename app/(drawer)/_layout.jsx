import React from "react";
import { Drawer } from "expo-router/drawer";
import CustomDrawer from "../../components/CustomDrawer";
import { modules } from "../../constants/modules";
import { DrawerContentScrollView } from "@react-navigation/drawer";

const DrawerLayout = () => {
  return (
    <Drawer
   
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "#5aaf57" },
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