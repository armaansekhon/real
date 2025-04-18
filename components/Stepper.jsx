import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
} from 'react-native';

const Stepper = ({ currentStep, labels, onStepPress }) => {
  const animatedWidths = useRef(
    labels.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    animatedWidths.forEach((animVal, index) => {
      const toValue = index < currentStep ? 1 : 0;
      Animated.timing(animVal, {
        toValue,
        duration: 400,
        easing: Easing.ease,
        useNativeDriver: false,
      }).start();
    });
  }, [currentStep]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.stepperContainer}>
        {labels.map((label, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === labels.length - 1;

          return (
            <View style={styles.stepSection} key={index}>
              <Pressable
                onPress={() => {
                  if (onStepPress) onStepPress(index);
                }}
                style={styles.stepWrapper}
              >
                <View
                  style={[
                    styles.circle,
                    {
                      backgroundColor: isCompleted
                        ? '#3b82f6'
                        : isActive
                        ? '#5aaf57'
                        : '#ccc',
                    },
                  ]}
                >
                  <Text style={styles.circleText}>{index + 1}</Text>
                </View>
                <Text
                  style={[
                    styles.label,
                    isCompleted && styles.completedLabel,
                    isActive && styles.activeLabel,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>

              {/* Line only if not last */}
              {!isLast && (
                <Animated.View
                  style={[
                    styles.line,
                    {
                      backgroundColor: '#32cd32',
                      width: animatedWidths[index].interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    },
                  ]}
                />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 20,
    backgroundColor: '#fff',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  stepSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 11,
  },
  label: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  completedLabel: {
    color: '#5aaf57',
    fontWeight: '600',
  },
  activeLabel: {
    color: '#5aaf57',
    fontWeight: '600',
  },
  line: {
    height: 2,
    backgroundColor: '#5aaf57',
    marginHorizontal: 8,
    marginTop: -15,
    alignSelf: 'center',
  },
});

export default Stepper;
