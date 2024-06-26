import { useSetAtom } from 'jotai';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '../../themes/colors';
import { authAtom } from '@/src/atom';
import CustomModal from '@/src/components/CustomModal';
import { useBackHandler } from '@/src/hooks/use-back-handler';
import * as Services from '@/src/services';
const FourOrFour = ({ navigation }): JSX.Element => {
  useBackHandler();

  const [logoutLoading, setLogoutLoading] = useState<boolean>(true);
  const [logoutVisible, setLogoutVisible] = useState<boolean>(false);
  const setAuth = useSetAtom(authAtom);
  const onPress = (): void => {
    setLogoutLoading(true);
    setLogoutVisible(true);
    setTimeout(() => {
      setLogoutLoading(false);
      setAuth(null);
      Services.LogoutUser();

      setTimeout(() => {
        setLogoutVisible(false);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }, 500);
    }, 1500);
  };

  return (
    <>
      <CustomModal
        visible={logoutVisible}
        loading={logoutLoading}
        onTouchOutside={onPress}
        text={'Successfully Logout!'}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <LottieView
          source={require('../../assets/lottie/404.json')}
          autoPlay
          loop
        />

        <Text
          style={{
            textAlign: 'center',
            paddingHorizontal: 20,
            fontSize: 20,
          }}
        >
          Please coordinate with dispatch for route assignments or
          truck assignments.
        </Text>
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
    </>
  );
};

export default FourOrFour;
