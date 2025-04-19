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
  const animatedWidths = useRef(labels.map(() => new Animated.Value(0))).current;

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
                        ? '#32cd32'
                        : isActive
                        ? '#5aaf57'
                        : '#ccc',
                    },
                  ]}
                >
                  {isCompleted ? (
                    <Text style={styles.checkmark}>✔</Text>
                  ) : (
                    <View style={styles.innerDot} />
                  )}
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

              {!isLast && (
    <View style={styles.lineWrapper}>
    <View style={styles.staticLine} />
    <Animated.View
      style={[
        styles.animatedLine,
        {
          width: animatedWidths[index].interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
        },
      ]}
    />
  </View>
  
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
    paddingHorizontal: 0,
    width: '100%',
    marginLeft: 30,
    marginTop: 90
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
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  checkmark: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'PlusR',
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
    marginHorizontal: 8,
    marginTop: -15,
    alignSelf: 'center',
    left: -23,
  },






  lineWrapper: {
    position: 'relative',
    flexGrow: 1,
    height: 2,
    marginHorizontal: -5,  // slightly more space
    marginTop: -15,
    justifyContent: 'center',
  },
  staticLine: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ccc',
    borderRadius: 1,
    
  },
  animatedLine: {
    height: 2,
    backgroundColor: '#32cd32',
    borderRadius: 1,
  },
  
});

export default Stepper;
