import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/src/themes/colors';

const BUTTON_WIDTH = Dimensions.get('screen').width - 48;
const SWIPE_RANGE = BUTTON_WIDTH - 74;

type SwipeButtonPropsType = {
  onSwipe: () => void;
  isLoading?: boolean;
};

const SwipeableButton = ({
  onSwipe,
  isLoading = false,
}: SwipeButtonPropsType) => {
  const X = useSharedValue(0);

  useEffect(() => {
    if (!isLoading) {
      X.value = withSpring(0);
    }
  }, [isLoading]);

  const animatedGestureHandler = useAnimatedGestureHandler({
    onActive: (e) => {
      const newValue = e.translationX;

      if (newValue >= 0 && newValue <= SWIPE_RANGE) {
        X.value = newValue;
      }
    },
    onEnd: () => {
      if (X.value < SWIPE_RANGE - 20) {
        X.value = withSpring(0);
      } else {
        runOnJS(onSwipe)();
      }
    },
  });

  const AnimatedStyles = {
    swipeButton: useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: interpolate(
              X.value,
              [20, BUTTON_WIDTH],
              [0, BUTTON_WIDTH],
              Extrapolation.CLAMP
            ),
          },
        ],
      };
    }),
    swipeText: useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          X.value,
          [0, BUTTON_WIDTH / 4],
          [1, 0],
          Extrapolate.CLAMP
        ),
        transform: [
          {
            translateX: interpolate(
              X.value,
              [20, SWIPE_RANGE],
              [0, BUTTON_WIDTH / 3],
              Extrapolate.CLAMP
            ),
          },
        ],
      };
    }),
  };

  return (
    <View style={styles.swipeButtonContainer}>
      <PanGestureHandler
        enabled={!isLoading}
        onGestureEvent={animatedGestureHandler}
      >
        <Animated.View
          style={[styles.swipeButton, AnimatedStyles.swipeButton]}
        >
          {isLoading ? (
            <ActivityIndicator color={'#fff'} />
          ) : (
            <Ionicon
              name={'chevron-forward-outline'}
              size={22}
              color={Colors.white}
            />
          )}
        </Animated.View>
      </PanGestureHandler>
      <Animated.Text
        style={[styles.swipeText, AnimatedStyles.swipeText]}
      >
        Swipe me to CHECK IN
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  swipeButtonContainer: {
    height: 59,
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: BUTTON_WIDTH,
  },
  swipeButton: {
    position: 'absolute',
    left: 0,
    height: 59,
    width: 80,
    borderRadius: 10,
    zIndex: 3,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeButtonDisabled: {
    backgroundColor: '#E4E9EE',
  },
  swipeText: {
    alignSelf: 'center',
    fontSize: 14,
    fontWeight: '400',
    zIndex: 2,
    // color: Colors.white,
    color: Colors.primary,
    marginLeft: 80,
  },
  chevron: {
    height: 25,
    width: 20,
    tintColor: 'white',
  },
});

export default SwipeableButton;
