// import { SafeAreaView, Text, Touchable, TouchableOpacity } from 'react-native'
// import React from 'react'
// import { useRouter } from 'expo-router'

// const Onboard = () => {
//   const Router=useRouter();
//   return (
//     <SafeAreaView>
//       <Text>Onboard</Text>
//       <TouchableOpacity onPress={()=>{Router.push({
//         pathname:"/Login"
//       })}}><Text>click</Text></TouchableOpacity>

//     </SafeAreaView>
//   )
// }

// export default Onboard

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
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router'
const { height } = Dimensions.get("window");
type Props = {};

const Onboard = (props) => {

  const Router=useRouter();
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
  Let's  <Text style={styles.greenText}>Work</Text>
</Text>

<TouchableOpacity
  style={styles.button}
  onPress={() => Router.push("/Login")}
>
  <Ionicons name="chevron-forward-circle-sharp" size={60} color="black" />
</TouchableOpacity>
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
    marginTop: "-120",
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
    backgroundColor: "#fff",
    height: height * 0.30, 
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  
  },
  bottomText: {
    fontSize: 32,
    color: Colors.black,
    fontFamily: "PlusSB",
    top: -40,
    left: -72
  },
  bottomText2: {
    fontSize: 23,
    color: "Colors.black",
    fontFamily: "PlusR",
    top: -50,
    left: -90
  },
  greenText: {
    color: "green",
  },

  button: {
    alignItems: "center", 
    justifyContent: "center",
    marginBottom: -40, 
    right: -120,
    top: -12
  },
});
