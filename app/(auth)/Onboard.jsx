import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from "react-native";
import React from "react";
import { Link, Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import { Platform } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import useTestAPIs from "../../hooks/useTestAPIs";

const { height } = Dimensions.get("window");

const Onboard = () => {
  const Router = useRouter();
  // useTestAPIs();

  return (
    <>
      <ImageBackground
        source={require("../../assets/images/onboard.jpg")}
        style={[styles.imageBackground, { height: height * 0.79 }]}
        resizeMode="cover"
      >
        <Stack.Screen options={{ headerShown: false }} />

        <SafeAreaView style={styles.container}>
          <StatusBar
            barStyle="dark-content"
            backgroundColor="transparent"
            translucent
          />
          <View style={styles.wrapper}>
            <Text style={styles.title}>Get Started</Text>
            <Text style={styles.description}>Discover Your Dream</Text>
          </View>
        </SafeAreaView>

        {/* White container at the bottom */}
        <View style={styles.bottomContainer}>
          <Text style={styles.bottomText}>Welcome!</Text>
          <Text style={styles.bottomText2}>
            Let's <Text style={styles.greenText}>Work</Text>
          </Text>


  
          <View style={styles.bottomView}>
  <View style={styles.rowContainer}>
    <Text style={styles.bottomText3}>
      Click here to proceed for Login
    </Text>

    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        // console.log("Navigating to Login");
        Router.push("/(auth)/Login");
        // Router.push("/(drawer)/(tabs)/Home");
        // Router.push("/(drawer)/HR/E-Manage/AddEmp");
      }}
    >
      <Ionicons
        name="chevron-forward-circle-sharp"
        size={60}
        color="black"
      />
    </TouchableOpacity>
  </View>
</View>
        </View>
      </ImageBackground>
    </>
  );
};

export default Onboard;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    flex: 1,
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
  },
  wrapper: {
    paddingBottom: 50,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    color: "#fff",
    letterSpacing: 2.4,
    marginTop: -120,
    fontFamily: "PlusB",
  },
  description: {
    fontSize: 12,
    color: "#fff",
    letterSpacing: 1.1,
    lineHeight: 20,
    top: 14,
    fontFamily: "PlusR",
    marginTop: -16,
    marginLeft: 9,
  },
  bottomContainer: {
    position: "relative",
    backgroundColor: "#fff",
    height: height * 0.3,
    justifyContent: "center",
    paddingHorizontal: 30,
    marginBottom: 10,
    alignItems: "flex-start", 
    width: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    minHeight: 150,
    
  },
  bottomText: {
    fontSize: 32,
    color: Colors.black,
    fontFamily: "PlusSB",
    marginBottom: 6,

  },
  bottomText2: {
    fontSize: 22,
    color: "Colors.black",
    fontFamily: "PlusR",
    marginBottom: 4,
    
  },

  greenText: {
    color: "green",
  },
  button: {
    right: 1,
    //  position: "static",
    // alignSelf: "flex-end",
    
  },





  bottomView: {
    padding: 20,
    backgroundColor: '#fff',
  },
  
  rowContainer: {
    flexDirection: 'row',
    gap: Platform.OS === 'ios' ? 50 : 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    left: -16
  },
  
  bottomText3: {
    fontSize: 14,
    color: 'black',
    fontFamily: 'PlusR',
  
  },
  
  button: {
    // Optional: add margin or padding if needed
  },
});