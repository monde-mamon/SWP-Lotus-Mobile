import {
  BackHandler,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';

import {Colors} from '../../themes/colors';

const UpdateScreen = ({route}) => {
  console.log('woowow! : ', route);
  const {data: BUILD_URL} = route.params || {};
  const checkBackHandler = () => {
    return true;
  };
  const downloadNewUpdate = () => {
    Linking.openURL(BUILD_URL);
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', checkBackHandler);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', checkBackHandler);
    };
  }, [checkBackHandler]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <Image
        source={require('../../assets/images/lsc_logo.png')}
        style={{height: 300, width: 300}}
        resizeMode={'contain'}
      />
      <Text>We have a new update, Please install!</Text>

      <TouchableOpacity
        style={{
          padding: 15,
          borderRadius: 10,
          backgroundColor: Colors.primary,
          marginTop: 40,
        }}
        onPress={() => downloadNewUpdate()}>
        <Text style={{color: '#fff'}}>UPDATE</Text>
      </TouchableOpacity>
    </View>
  );
};

export default UpdateScreen;
