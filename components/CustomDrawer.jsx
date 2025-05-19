import React, { useState, useEffect } from "react";
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
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import LottieView from 'lottie-react-native';
import Logout from "../assets/svg/logout.svg";
import { useModules } from "../context/ModuleContext";
import { useUser } from "../context/UserContext";
import useLogin from "../hooks/useLogin";
import FolderIcon from "../assets/svg/Folder.svg";

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CustomDrawer = ({ navigation }) => {
  const [clickedItem, setClickedItem] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { modules } = useModules();
  const { user } = useUser();
  const { logout, loading } = useLogin();

  // Set initial active tab when component mounts
  useEffect(() => {
    if (modules.length > 0) {
      setClickedItem(modules[0].name); // Set first module as active initially
    }
  }, [modules]);

  const toggleExpand = (moduleName) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItems((prev) => ({
      ...prev,
      [moduleName]: !prev[moduleName],
    }));
  };

  const handleItemClick = (module) => {
    setClickedItem(module.name);
    router.push(module.path);
    navigation.closeDrawer(); // Close the drawer after navigation
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            await logout();
            router.replace('/Login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderDrawerItems = (modules) => {
    return modules.map((module) => {
      const isClicked = clickedItem === module.name;

      if (module.children) {
        const isExpanded = expandedItems[module.name];

        return (
          <View key={module.name}>
            <TouchableOpacity
              style={[
                styles.drawerItem,
                isClicked && styles.clickedDrawerItem,
              ]}
              onPress={() => toggleExpand(module.name)}
            >
              {module.icon ? (
                <module.icon width={24} height={24} fill={isClicked ? "#4CAF50" : "#000"} />
              ) : (
                <FolderIcon width={24} height={24} fill={isClicked ? "#4CAF50" : "#000"} />
              )}
              <Text
                style={[
                  styles.drawerItemText,
                  isClicked && styles.clickedDrawerItemText,
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

            {isExpanded && (
              <View style={styles.nestedItems}>
                {renderDrawerItems(module.children)}
              </View>
            )}
          </View>
        );
      }

      return (
        <TouchableOpacity
          key={module.name}
          style={[
            styles.drawerItem,
            isClicked && styles.clickedDrawerItem,
          ]}
          onPress={() => handleItemClick(module)}
        >
          {module.icon ? (
            <module.icon width={24} height={24} fill={isClicked ? "#4CAF50" : "#000"} />
          ) : (
            <FolderIcon width={24} height={24} fill={isClicked ? "#4CAF50" : "#000"} />
          )}
          <Text
            style={[
              styles.drawerItemText,
              isClicked && styles.clickedDrawerItemText,
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
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <LottieView
            source={require('../assets/svg/reales2.json')}
            autoPlay={true}
            loop={true}
            speed={0.5}
            style={styles.ani}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.welcomeText}>
              Hello ! <Text style={styles.adminText}>{user?.name?.split(' ')[0] || 'User'}</Text>
            </Text>
            <Text style={styles.designation}>Executive</Text>
          </View>
        </View>

        {renderDrawerItems(modules)}
      </ScrollView>
      <View style={{ borderTopWidth: 0, paddingTop: 10, borderColor: "#d3d3d3", backgroundColor: "#f0fff0" }}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogout}
          disabled={loading}
        >
          <Logout height={30} width={30} />
          <Text style={styles.loginButtonText}>
            {loading ? 'Logging out...' : 'Log-Out'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
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
    paddingBottom: 20,
    top: 0,
    left: 0,
    right: 0,
    borderColor: "green",
    marginBottom: 10,
  },
  ani: {
    height: 50,
    width: 90,
    paddingLeft: 20,
    transform: [{ scale: 2.5 }],
    marginBottom: 30,
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 23,
    color: "#000",
    fontFamily: "PlusR",
  },
  adminText: {
    color: "#4CAF50",
    fontFamily: "PlusL",
  },
  designation: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginLeft: Platform.OS === "android" ? 0 : 10,
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  clickedDrawerItem: {
    backgroundColor: "rgba(76, 175, 80, 0.15)", // More natural green with reduced opacity
    width: "95%", // Slightly reduced width for active tab
  },
  drawerItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: "black",
    fontFamily: "PlusR",
  },
  clickedDrawerItemText: {
    color: "#4CAF50",
    fontFamily: "PlusSB",
  },
  nestedItems: {
    marginLeft: 20,
    marginTop: 5,
    overflow: "hidden",
  },
  loginButton: {
    flexDirection: "row",
    width: "45%",
    height: 35,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: Platform.OS === "ios" ? 50 : 10,
  },
  loginButtonText: {
    fontSize: 20,
    paddingLeft: 10,
    fontFamily: "PlusSB",
  },
});

export default CustomDrawer;