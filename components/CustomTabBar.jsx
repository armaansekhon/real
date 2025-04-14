import React from "react";  // ✅ Import React
import { View, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";


const tabs = [
  { name: "Home", label: "Home", icon: "home-outline" },
  { name: "Notification", label: "Notifications", icon: "heart-outline" },
 
  { name: "profile", label: "Profile", icon: "person-outline" },
];

const CustomTabBar = ({ state, navigation }) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab, index) => {
        const isActive = state.index === index;

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => router.push(tab.name === "Home" ? "/" : `/${tab.name}`)}
            style={[styles.tabItem, isActive && styles.activeTab]}
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={isActive ? "#fff" : "#aaa"}
            />
            <Text style={[styles.tabText, isActive && styles.activeText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = {
    tabBar: {
      position: "absolute", // Makes it float above the bottom
      bottom: 30, // Moves it slightly up from the extreme bottom
      left: 20, // Ensures it's not touching screen edges
      right: 20, // Ensures it's not touching screen edges
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      height: 60,
      backgroundColor: "white",
      borderRadius: 40, // More rounded corners
      elevation: 5, // Adds shadow on Android
      shadowColor: "#000", // Shadow for iOS
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
    },
    tabItem: {
      alignItems: "center",
      padding: 10,
    },
    tabText: {
      fontSize: 12,
      color: "#aaa",
      marginTop: 4,
    },
    activeTab: {
      backgroundColor: "#54AD56",
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 20,
    },
    activeText: {
      color: "#fff",
      fontWeight: "bold",
    },
  };
  

export default CustomTabBar;
