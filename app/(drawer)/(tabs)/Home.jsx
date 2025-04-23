import { View, Text, SafeAreaView } from 'react-native';
import React, {useEffect} from 'react';
import * as SecureStore from 'expo-secure-store';
import { useUser } from '../../../context/UserContext';
import Adminhome from '../../../components/Adminhome';

import Employeehome from '../../../components/Employeehome';

const Home = () => {

  const { user, userType } = useUser();
  

  useEffect(() => {
    // console.log("HomeScreen - User Context:", user);
    console.log("HomeScreen - User Type:", userType);
  }, [user, userType]);
  if (userType === undefined || userType === null) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  return userType === '0' ? <Adminhome /> : <Employeehome />;
};

export default Home;