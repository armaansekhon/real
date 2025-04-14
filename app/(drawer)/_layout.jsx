import { Drawer } from 'expo-router/drawer';
import React from 'react'

const _layout = () => {
  return (
   <Drawer>
     <Drawer.Screen
        name="(tabs)"
        options={{ drawerLabel: 'Main Tabs', title: 'App' }}
      />
   </Drawer>
  )
}

export default _layout