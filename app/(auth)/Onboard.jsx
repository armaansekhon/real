import { SafeAreaView, Text, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'

const Onboard = () => {
  const Router=useRouter();
  return (
    <SafeAreaView>
      <Text>Onboard</Text>
      <TouchableOpacity onPress={()=>{Router.push({
        pathname:"/Login"
      })}}><Text>click</Text></TouchableOpacity>
      
    </SafeAreaView>
  )
}

export default Onboard