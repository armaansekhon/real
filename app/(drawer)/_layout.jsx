import React from "react";
import { Drawer } from "expo-router/drawer";
// import { ModuleProvider } from "../../context/ModuleContext";
import CustomDrawer from "../../components/CustomDrawer";
// import { modules } from "../../constants/modules";
import { useModules } from "../../context/ModuleContext";

const DrawerLayout = () => {
  const { modules , loading } = useModules();
  console.log("Modules in CustomDrawer:", modules);

  if (loading) return null;

  const flattenModules = (modules) => {
    if (!Array.isArray(modules)) return [];
    return modules.flatMap((mod) =>
      mod.children ? [mod, ...flattenModules(mod.children)] : [mod]
    );
  };
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
     

  {/* {modules.map((module) => (
      <Drawer.Screen
        key={module.name}
        name={module.name}
        options={{ title: module.title }}
      />
    ))} */}
  {flattenModules(modules).map((module) => (
    <Drawer.Screen
      key={module.name}
      name={module.name}
      options={{
        title: module.title,
        drawerIcon: ({ size, color }) =>
          module.icon ? (
            <module.icon width={24} height={24} fill={color} />
          ) : null,
      }}
    />
  ))}
   
  </Drawer>
    
  );
};

export default DrawerLayout;