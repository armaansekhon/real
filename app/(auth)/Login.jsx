import React, { useState } from 'react';
import { StyleSheet, Text, View , TextInput, TouchableOpacity,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Userlogo from "../../assets/svg/loguser.svg";
import { useRouter } from 'expo-router';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
const Router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.Iconcontainer}>
        <Ionicons onPress={()=>{Router.back()}} style={styles.backIcon}  name="chevron-back-sharp" size={22} color="black" />

        </View>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>
          Glad to see you, <Text style={styles.textGreen}>again!</Text>
        </Text>

        {/* login */}


        <SafeAreaView style={styles.boxcontainer}>
        <View style={styles.centeredContainer}>
        {/* User Icon */}
        <View style={styles.userIconContainer}>
        <Userlogo height={80} width={80} />
        </View>
        <TextInput
          style={styles.inputField}
          placeholder="Enter the Email"
          placeholderTextColor="#444444" // Slightly darker grey
          keyboardType="email-address"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordField}
            placeholder="enter the Password"
            placeholderTextColor="#444444"
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={passwordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#a9a9a9"
            />
          </TouchableOpacity>
        </View>

        {/* Forget Password */}
        <TouchableOpacity>
          <Text style={styles.forgetPassword}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>

      
      <View style={styles.bottomTextContainer}>
  <Text style={styles.bottomText}>
    Don't have an account?{' '}
    <Text style={styles.contactAdmin}>Contact Admin</Text>
  </Text>
</View>

        </SafeAreaView>

      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16, // Add horizontal padding to the container
    paddingVertical: 16, // Add vertical padding for safe spacing
    backgroundColor: '#ffff', // Light background color
  },
  content: {
    flex: 1,
   
  },
  title: {
    fontFamily: 'PlusSB',
    fontSize: 28,
    color: 'black',
    marginBottom: 4,
     // Center the text
  },
  subtitle: {
    fontFamily: 'PlusR',
    fontSize: 23,
    color: 'black',
     // Center the text
  },
  textGreen: {
    fontFamily: 'PlusSB',
    color: '#5aaf57', // Green color for "again"
  },
  Iconcontainer:{
    // position:"absolute",

    height:"18",
    width:"28",
    backgroundColor:"#ffff",
   marginBottom:"12",
   alignItems:"center",
   justifyContent:"center",
   borderRadius:"20%",
  //  borderWidth: 1, 
    // borderColor: "#d3d3d3", 
   
  //  shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 3.84,
  
  //   elevation: 2,

   




  },
  backIcon:{
    
  },

  boxcontainer: {
    flex: 1,
// justifyContent:"center",
    alignItems: 'center',
    // backgroundColor: 'black',
  },
  centeredContainer: {
      justifyContent:"center",
       top:"15",
    height:"60%",
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#5aaf57',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userIconContainer: {
    position: 'absolute',
    top: -45,
    backgroundColor: 'transparent',
    borderRadius: 30,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputField: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderColor:"#d3d3d3",
    borderWidth:"0.5",
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 15,
  fontFamily:"PlusR"
  },
  passwordContainer: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor:"#d3d3d3",
    borderWidth:"0.5",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  passwordField: {
    flex: 1,
    fontSize: 15,
    color: 'black',
    fontFamily:"PlusR"
  },
  eyeIcon: {
    marginLeft: 10,
  },
  forgetPassword: {
    color: '#5a5a5a',
    fontSize: 14,
    marginBottom: 10,
    fontFamily:"PlusSB",
    left:"70",
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#000',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:"10",
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    // fontWeight: 'bold',
    fontFamily:"PlusR"
  },


  bottomTextContainer: {
    position: 'absolute',
    bottom: 20, // Position the text near the bottom of the screen
    alignSelf: 'center',
  },
  bottomText: {
    fontSize: 14,
    color: '#444', // Slightly darker grey for the main text
    fontFamily: 'PlusR',
  },
  contactAdmin: {
    color: '#5aaf57', // Green color for "Contact Admin"
    fontFamily: 'PlusSB',
  },
});