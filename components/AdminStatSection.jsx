import React from 'react';
import { View, StyleSheet } from 'react-native';
import StatCard from './StatCard';

const AdminStatsSection = () => {
  return (
    <View style={styles.container}>
      <View style={styles.cardWrapper}>
        <StatCard
          title="Views"
          value="29"
          percentage="+11.02%"
          iconName="trending-up"
          gradientColors={['#66d17a', '#48c68a']}
        />
      </View>

      <View style={styles.cardWrapper}>
        <StatCard
          title="Customers"
          value="715"
          percentage="-0.03%"
          iconName="trending-down"
          gradientColors={['#111', '#333']}
        />
      </View>

      <View style={styles.cardWrapper}>
        <StatCard
          title="Orders"
          value="316"
          percentage="+6.08%"
          iconName="trending-up"
          gradientColors={['#111', '#333']}
        />
      </View>

      <View style={styles.cardWrapper}>
        <StatCard
          title="Revenue"
          value="$695"
          percentage="+15.03%"
          iconName="trending-up"
          gradientColors={['#f6b042', '#f7931e']}
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
    paddingHorizontal: 16,
    marginTop: 16,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
});

export default AdminStatsSection;
