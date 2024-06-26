import LottieView from 'lottie-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../themes/colors';
import { useBackHandler } from '@/src/hooks/use-back-handler';

const Maintainance = ({ navigation }) => {
  useBackHandler();
  const onPress = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LottieView
        source={require('../../assets/lottie/maintenance.json')}
        autoPlay
        loop
      />

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: '20%',
          alignSelf: 'center',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 5,
          backgroundColor: Colors.primary,
          padding: 12,
          width: 120,
        }}
        onPress={onPress}
      >
        <Text
          style={{
            color: '#ffff',
            fontSize: RFValue(13),
            textAlign: 'center',
          }}
        >
          Try again
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Maintainance;
