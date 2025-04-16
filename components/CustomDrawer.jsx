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
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { modules } from "../constants/modules";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CustomDrawer = ({ state }) => {
  const router = useRouter();
  const [expandedItems, setExpandedItems] = useState({}); // Track expanded/collapsed state
const bot  =useSafeAreaInsets();
  const toggleExpand = (moduleName) => {
    // Trigger animation
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setExpandedItems((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName], // Toggle the expanded state
    }));
  };

  const renderDrawerItems = (modules) => {
    return modules.map((module, index) => {
      if (module.children) {
        const isExpanded = expandedItems[module.name]; // Check if the module is expanded

        return (
          <SafeAreaView key={module.name}>
            {/* Parent Item */}
            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => toggleExpand(module.name)} // Toggle expand/collapse
            >
              <Ionicons name={module.icon || "folder-outline"} size={24} color="#000" />
              <Text style={styles.drawerItemText}>{module.title}</Text>
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
          </SafeAreaView>
        );
      }

      // Render a single item
      return (
        <TouchableOpacity
          key={module.name}
          style={[
            styles.drawerItem,
            state?.index === index && styles.activeDrawerItem,
          ]}
          onPress={() => router.push(module.path)}
        >
          <Ionicons name={module.icon || "folder-outline"} size={24} color="#000" />
          <Text style={styles.drawerItemText}>{module.title}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaView style={styles.drawerContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="person-circle-outline" size={60} color="black" />
          <Text style={styles.username}>Welcome, Admin</Text>
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
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
    top:60,
    marginBottom: 80,
  },
  username: {
    fontSize: 18,
    fontFamily:"PlusR",
    color: "#000",
    marginTop: 10,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  activeDrawerItem: {
    // backgroundColor: "#fff",
  },
  drawerItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
    fontFamily:"Plusr",
  },
  nestedItems: {
    marginLeft: 20,
    marginTop: 5,
    overflow: "hidden", 
  },
  loginButton: {
    width: '80%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:"center",
    bottom:60,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    // fontWeight: 'bold',
    fontFamily:"PlusR"
  },

});

export default CustomDrawer;