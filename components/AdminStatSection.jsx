import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import StatCard from './StatCard';

const AdminStatsSection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.cardWrapper}>
        <StatCard
          title="Properties"
          value="29"
          percentage="+11.02%"
          iconName="home"
          gradientColors={['#32D07D', '#0DAF69']}
        />
      </View>

      <View style={styles.cardWrapper}>
        <StatCard
          title="Customers"
          value="715"
          percentage="-0.03%"
          iconName="people-outline"
          gradientColors={['#0F0F0F', '#2B2B2B']}
        />
      </View>
<View style={styles.cardWrapper}>
        <StatCard
          title="Attendence"
          value="32"
          percentage="+6.08%"
          iconName="hand-left"
          gradientColors={['#0F0F0F', '#2B2B2B']}
        />
      </View> 
      

      <View style={styles.cardWrapper}>
        <StatCard
          title="Leads"
          value="$695"
          percentage="+15.03%"
          iconName="trending-up"
          gradientColors={['#F4A500', '#FEC301']}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 18,
    marginTop: -10
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 14,
  },
});

export default AdminStatsSection;
