// LeaveRequest.jsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const LeaveRequest = ({ leaveId }) => {
  const [leaveData, setLeaveData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://192.168.6.210:8686/pipl/api/v1/employee/getLeaveById/${leaveId}`)
      .then(res => res.json())
      .then(data => {
        setLeaveData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching leave details:", err);
        setLoading(false);
      });
  }, [leaveId]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;

  if (!leaveData) return <Text>Failed to load leave details.</Text>;

  return (
    <View style={styles.container}>
      <Text>Leave Type: {leaveData["Leave Type"]}</Text>
      <Text>Status: {leaveData.Status}</Text>
      <Text>From: {leaveData.From}</Text>
      <Text>To: {leaveData.To}</Text>
      <Text>Reason: {leaveData.Reason}</Text>
      <Text>Requested Date: {leaveData["Leave Requested Date"]}</Text>
      <Text>Currently At: {leaveData["Leave Currently At"]}</Text>
      <Text>Initiated By: {leaveData["Initiated By"]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#eef",
    borderRadius: 10,
    marginVertical: 10,
  },
});

export default LeaveRequest;
