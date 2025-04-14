import { Text } from 'react-native'
import { Redirect } from "expo-router";
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const index = () => {
  return (
    <Redirect href="/Onboard" />
   
  )
}

export default index