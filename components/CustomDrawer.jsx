import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  SafeAreaView,
 
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { modules } from "../constants/modules";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ImageBackground } from "react-native";

// Import Folder SVG
import FolderIcon from "../assets/svg/Folder.svg";
import { DrawerContentScrollView } from "@react-navigation/drawer";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CustomDrawer = ({ navigation }) => {
  const [clickedItem, setClickedItem] = useState(null); // Track the last clicked item
  const [expandedItems, setExpandedItems] = useState({}); // Track expanded/collapsed state
  const insets = useSafeAreaInsets();
  const Router = useRouter();

  const toggleExpand = (moduleName) => {
    // Trigger animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setExpandedItems((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName], // Toggle the expanded state
    }));
  };

  const handleItemClick = (module) => {
    setClickedItem(module.name); // Set the clicked item
    Router.push(module.path); // Navigate to the screen
  };

  const renderDrawerItems = (modules) => {
    return modules.map((module) => {
      const isClicked = clickedItem === module.name; // Check if the item is clicked

      if (module.children) {
        const isExpanded = expandedItems[module.name]; // Check if the module is expanded

        return (
          <View key={module.name}>
            {/* Parent Item */}
            <TouchableOpacity
              style={[
                styles.drawerItem,
                isClicked && styles.clickedDrawerItem, // Apply clicked background
              ]}
              onPress={() => toggleExpand(module.name)} // Toggle expand/collapse
            >
              {/* Render Folder SVG if no icon is provided */}
              {module.icon ? (
                <module.icon width={24} height={24} fill={isClicked ? "#5aaf57" : "#000"} />
              ) : (
                <FolderIcon width={24} height={24} fill={isClicked ? "#5aaf57" : "#000"} />
              )}
              <Text
                style={[
                  styles.drawerItemText,
                  isClicked && styles.clickedDrawerItemText, // Apply clicked text color
                ]}
              >
                {module.title}
              </Text>
              <Ionicons
                name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}
                size={20}
                color="#000"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>

            {/* Nested Items */}
            {isExpanded && (
              <View style={styles.nestedItems}>
                {renderDrawerItems(module.children)}
              </View>
            )}
          </View>
        );
      }

      // Render a single item
      return (
        <TouchableOpacity
          key={module.name}
          style={[
            styles.drawerItem,
            isClicked && styles.clickedDrawerItem, // Apply clicked background
          ]}
          onPress={() => handleItemClick(module)} // Handle item click
        >
          {/* Render Folder SVG if no icon is provided */}
          {module.icon ? (
            <module.icon width={24} height={24} fill={isClicked ? "#5aaf57" : "#000"} />
          ) : (
            <FolderIcon width={24} height={24} fill={isClicked ? "#5aaf57" : "#000"} />
          )}
          <Text
            style={[
              styles.drawerItemText,
              isClicked && styles.clickedDrawerItemText, // Apply clicked text color
            ]}
          >
            {module.title}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaView style={styles.drawerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="person-circle-outline" size={60} color="black" style={styles.headerIcon} />
          <View style={styles.headerTextContainer}>
          <Text style={styles.welcomeText}>
              Welcome <Text style={styles.adminText}>Admin</Text>
            </Text>
            <Text style={styles.designation}>Executive</Text>
          </View>
          
        </View>

        {renderDrawerItems(modules)}
       
      </ScrollView>
      <View>
             <TouchableOpacity    style={styles.loginButton}>
                        <Text 
                 style={styles.loginButtonText}>Log-Out</Text>
                      </TouchableOpacity>
                      
        </View>
    </SafeAreaView>
    
   
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 75 : 30,
    paddingBottom:20,
    backgroundColor: "#f8f9fa",
    // borderBottomWidth: 1,
    borderColor: "green",
    marginBottom: 10,
  },
  headerIcon: {
    // marginRight: 10,
paddingLeft:20
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 23,
    color: "#000",
    fontFamily:"PlusR"
  },
  adminText: {
    color: "#5aaf57", // Green color for "Admin"
    fontFamily:"PlusR ",
  },
  designation: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  headerSettingsIcon: {
    marginLeft: 10,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth:0.5,
    borderColor:"#d3d3d3",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "transparent",
    shadowColor: '#5aaf57',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  
  },
  clickedDrawerItem: {
    backgroundColor: "rgba(90, 175, 87, 0.2)", // Transparent green background for clicked item
  },
  drawerItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  clickedDrawerItemText: {
    color: "#5aaf57", // Darker green for clicked text
  },
  nestedItems: {
    marginLeft: 20,
    marginTop: 5,
    overflow: "hidden",
  },
  loginButton: {
    width: "40%",
    height: 35,
    // backgroundColor: "black",
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:"center",
    bottom:60,
  },
  loginButtonText: {
    color: "#000",
    fontSize: 16,
    fontFamily:"PlusSB"
  },
});

export default CustomDrawer;