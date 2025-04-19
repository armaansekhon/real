// components/StatCard.js
import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const StatCard = ({ title, value, percentage, iconName, gradientColors, valueColor = '#fff', percentColor = '#fff' }) => {
  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-2xl p-4 w-[46%] h-36 justify-between m-2"
    >
      <View className="flex-row justify-between items-center">
        <Text className="text-white text-base font-semibold">{title}</Text>
        <View className="bg-white/20 p-1.5 rounded-full">
          <Ionicons name={iconName} size={18} color="#fff" />
        </View>
      </View>
      <View>
        <Text className="text-white text-2xl font-bold">{value}</Text>
        <Text className="text-white text-sm font-semibold">{percentage}</Text>
      </View>
    </LinearGradient>
  );
};

export default StatCard;
