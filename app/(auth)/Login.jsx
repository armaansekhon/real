import React, { useState } from 'react';

import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, Keyboard,
  TouchableWithoutFeedback, Alert
} from 'react-native';

import * as SecureStore from 'expo-secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Userlogo from "../../assets/svg/loguser.svg";
import { useRouter } from 'expo-router';
import useLogin from '../../hooks/useLogin';
import { useModules } from '../../context/ModuleContext';

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useLogin();
  const { refreshModules } = useModules();

  const router = useRouter();

  const handleLogin = async () => {
    if (!identifier || !password) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return;
    }
  
    console.log("Logging in...");
    const result = await login(identifier, password);
    console.log("Login result:", result); // Add this
  
    if (result) {
      try {
        console.log("Fetching modules...");
        await refreshModules();
        console.log("Modules fetched");
        router.replace("/(drawer)/(tabs)/Home");
      } catch (error) {
        console.error("fetchModules error:", error); // Catch issues here
      }
    } else {
      Alert.alert("Login Failed", "Invalid email/usercode or password.");
      setIdentifier("");  // Clear input fields
      setPassword("");
      
    }
  };


  //   if (usercode === 'admin@example.com' && password === 'admin123') {
  //     try {
  //       await SecureStore.setItemAsync('userEmail', email);
  //       await SecureStore.setItemAsync('userToken', 'dummy-token-123');

  //       router.push("/(drawer)/(tabs)/Home");
  //     } catch (e) {
  //       Alert.alert("Secure store error", e.message);
  //     }
  //   } else {
  //     Alert.alert("Invalid email or password.");
  //   }
  // };





//   "privileges": [
//     "/(drawer)/(tabs)/Home",
//     "/(drawer)/MarkAttendance",
//     "/(drawer)/Reports",
//     "/(drawer)/Employee/Performance"
//   ]
// }






  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    
    keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
    
    >
      
      
      <SafeAreaView style={styles.container}>
    <View style={styles.innerContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        bo
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.Iconcontainer}>
          <Ionicons
            onPress={() => router.back()}
            style={styles.backIcon}
            name="chevron-back-sharp"
            size={22}
            color="black"
          />
        </View>

        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>
          Glad to see you, <Text style={styles.textGreen}>again!</Text>
        </Text>

        <View style={styles.userIconContainer}>
          <Userlogo height={80} width={80} />
        </View>

        <View style={styles.centeredContainer}>
          <TextInput
            style={styles.inputField}
            placeholder="Enter the Email or Usercode"
            placeholderTextColor="#444444"
            keyboardType="email-address"
            autoCapitalize="none"
            value={identifier}
            onChangeText={setIdentifier}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordField}
              placeholder="Enter the Password"
              placeholderTextColor="#444444"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={styles.eyeIcon}
            >
              <Ionicons
                name={passwordVisible ? 'eye-off' : 'eye'}
                size={20}
                color="#555"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <Text style={styles.forgetPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
  // onPress={async () => {
  //   const result = await login(identifier, password);
  //   if (result.success) {
  //     await fetchModules();
  //     router.push("/(drawer)/(tabs)/Home");
    
  //   }
  // }}
  onPress={handleLogin}
  style={styles.loginButton}
  disabled={loading}
>
  <Text style={styles.loginButtonText}>{loading ? 'Logging in...' : 'Login'}</Text>
</TouchableOpacity>

          {/* <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
                  <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity> */}

          <View style={styles.fixedBottom}>
        <Text style={styles.bottomText}>
          Don't have an account?{' '}
          <Text style={styles.contactAdmin}>Contact Admin</Text>
        </Text>
      </View>
        </View>
       
      </ScrollView>

      {/* This stays fixed at the bottom */}
     
    </View>
  </SafeAreaView>
</KeyboardAvoidingView>
</TouchableWithoutFeedback>
     
      
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
  scrollContainer: {
    
   flexGrow:1,
   paddingBottom: Platform.OS === 'ios' ? 280 : 10, // Platform-specific padding
 
   
  },
  
  fixedBottom: {
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: 'transparent',
    
    marginTop:"5",
    
  
    borderColor: '#e0e0e0',
    
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
    fontSize: 22,
    color: 'black',
     // Center the text
     marginBottom: 50,
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
  
  },

  innerContainer: {
   
   
   
  },




 
  centeredContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#5aaf57',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3.84,
    elevation: 5,
  },

  userIconContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  inputField: {
    width: '100%',
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderColor:"#d3d3d3",
    borderWidth:0.5,
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
    borderWidth:0.5,
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
  marginLeft:"auto"
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