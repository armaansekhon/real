import { Drawer } from "expo-router/drawer";
import React from "react";
import { Slot } from "expo-router";

const DrawerLayout = () => {
  return (
    <Drawer>
    
    <Drawer.Screen name="Geolocation" options={{ title: "Geolocation" }} />
     
    <Drawer.Screen name="MarkAttendence" options={{ title: "MarkAttendence" }} />
      <Drawer.Screen
        name="(tabs)"
        options={{ drawerLabel: "Main Tabs", title: "App",  }}
      />
    </Drawer>
  );
};

export default DrawerLayout;