import { SafeAreaView,StyleSheet,Text } from 'react-native'
import React from 'react'

const Login = () => {
  return (
    <SafeAreaView>
      <Text style={Styles.text}>Login</Text>
    </SafeAreaView>
  )
}

export default Login

const Styles=StyleSheet.create({
  text:{
    fontFamily:"PlusEL",
    margin:"auto",
    fontSize:"50",

  },

})