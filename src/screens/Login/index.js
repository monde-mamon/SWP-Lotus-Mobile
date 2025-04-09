'use strict';

import {
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { compare } from 'compare-versions';
import { useSetAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Input } from 'react-native-elements';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Services from '../../services';
import { Colors } from '../../themes/colors';
import firebaseRemoteConfig from '../../utils/firebase';
import { authAtom, languageAtom, locationAtom } from '@/src/atom';
import { language } from '@/src/utils/language';

const LoginScreen = (props) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState(
    __DEV__ ? 'mond@lsctms.sys' : ''
  );
  const [emailError, setEmailError] = useState('');
  const [pass, setPass] = useState(__DEV__ ? 'testpassword' : '');
  const setAuth = useSetAtom(authAtom);
  const setLocationConfig = useSetAtom(locationAtom);
  const setLang = useSetAtom(languageAtom);
  const [passError, setPassError] = useState('');
  const [showPass, setShowPass] = useState(true);
  const [initializing, setInitializing] = useState(
    props.loading ? false : false
  );
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const [logo, setLogo] = useState(null);

  const clearFields = () => {
    setEmail('');
    setEmailError('');
    setPass('');
    setPassError('');
  };

  const goToHomeScreen = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const onLogin = () => {
    // goToHomeScreen();
    // setInitializing(true);
    try {
      Keyboard.dismiss();
      setLoading(true);
      const data = {
        email: email,
        password: pass,
      };
      Services.signinUser(data).then(({ status, data: response }) => {
        setTimeout(() => {
          if (status === 'success') {
            if (
              !response?.user?.hub_code ||
              !response?.user?.driver_name ||
              !response?.user?.truck_license ||
              !response?.user?.route_code
            ) {
              navigation.push('FourOrFour');
              return;
            }

            setAuth(response);
            clearFields();
            goToHomeScreen();
            setLoading(false);
            setLang(
              response?.user?.language === 'ENG'
                ? language.ENG
                : language.THAI
            );
          } else {
            setEmailError('Credentials does not match');
            setPassError('Credentials does not match');
            setLoading(false);
          }
        }, 2000);
      });
    } catch (err) {
      setLoading(false);
    }
  };

  const onProcess = () => {
    setEmailError('');
    setPassError('');
    var score = 0;
    if (!email) {
      setEmailError('Enter email here');
      score++;
    } else if (!validateEmail(email)) {
      setEmailError('Enter a valid email');
      score++;
    }
    if (!pass) {
      setPassError('Enter password here');
      score++;
    } else if (pass.length <= 7) {
      setPassError('Password must contain 8 characters');
      score++;
    }
    //remember this !shit
    if (!score) {
      onLogin();
    }
  };

  const validateEmail = (data) => {
    var re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(data).toLowerCase());
  };

  const onChangeText = (id, data) => {
    const fields = [
      {
        setData: setEmail,
        setError: setEmailError,
      },
      {
        setData: setPass,
        setError: setPassError,
      },
    ];
    fields[id].setData(data);
    fields[id].setError('');
  };

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => {
        const init = async () => {
          const data = await firebaseRemoteConfig();
          if (!data.IS_APPLICATION_ON) {
            navigation.push('Maintainance');
          } else if (
            !compare(data.APP_VERSION, DeviceInfo.getVersion(), '<=')
          ) {
            navigation.push('Update', { data: data.BUILD_URL });
          } else {
            setLocationConfig({
              timer: data.LOCATION_TIMER_INTERVAL,
            });
            Services.storeData('api_url', data.API_URL); // Saving API URL setted from firebase

            if (!data.IS_PDA_MODE_ON) {
              Services.storeData('ispdamode', false);
            }

            Services.retrieveData('user').then((res) => {
              if (!res || res.status === 'failed') {
                setInitializing(true);
              } else {
                setAuth(res);
                clearFields();
                goToHomeScreen();
                setInitializing(true);
                setLang(
                  res?.user?.language === 'ENG'
                    ? language.ENG
                    : language.THAI
                );
              }
            });
          }
        };

        init();
      }, 2000);
    }
  }, [setInitializing, isFocused]);
  useEffect(() => {
    if (isFocused) {
      Services.getLogo().then((res) => {
        setLogo(res.logo);
        Services.storeData('app_logo', res.logo);
      });
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {!initializing ? (
        <View
          style={{
            backgroundColor: '#fff',
            flex: 1,
            justifyContent: 'center',
            alignSelf: 'center',
          }}
        >
          {logo && (
            <Image
              source={{
                uri: logo,
              }}
              style={{ height: 200, width: 200 }}
              resizeMode={'contain'}
            />
          )}
          <Text
            style={{
              textAlign: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              padding: 5,
              color: 'gray',
            }}
          >{`v ${DeviceInfo.getVersion()}`}</Text>
          <ActivityIndicator size="small" color={Colors.primary} />
        </View>
      ) : (
        <>
          <View style={styles.height} />

          <View>
            {logo && (
              <Image
                source={{
                  uri: logo,
                }}
                style={{
                  height: 200,
                  width: 200,
                  alignSelf: 'center',
                  top: 20,
                }}
                resizeMode={'contain'}
              />
            )}
          </View>
          <View style={styles.formContainer}>
            <Input
              placeholder="Email"
              rightIcon={
                <Icon name="mail-outline" size={24} color="black" />
              }
              errorStyle={styles.errorMessage}
              errorMessage={emailError}
              value={email}
              onChangeText={(value) => onChangeText(0, value)}
            />
            <Input
              placeholder="Password"
              secureTextEntry={showPass}
              errorStyle={styles.errorMessage}
              errorMessage={passError}
              value={pass}
              onChangeText={(value) => onChangeText(1, value)}
              rightIcon={
                <Icon
                  name={showPass ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color="black"
                  onPress={() => setShowPass(!showPass)}
                />
              }
            />

            <View style={styles.alignSelfContainer}>
              <Pressable
                onPress={onProcess}
                style={styles.loginButton}
                disabled={loading}
              >
                <Text style={styles.white}>Login </Text>
                {loading ? (
                  <ActivityIndicator
                    size={'small'}
                    color={Colors.white}
                    style={{ marginLeft: 5 }}
                  />
                ) : (
                  <Icon
                    name={'chevron-forward-outline'}
                    size={20}
                    color={Colors.white}
                  />
                )}
              </Pressable>
            </View>
          </View>
          <Text
            style={{
              position: 'absolute',
              bottom: 20,
              textAlign: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              padding: 5,
              color: 'gray',
            }}
          >{`v${DeviceInfo.getVersion()}`}</Text>
        </>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  alignSelfContainer: {
    alignSelf: 'flex-end',
    paddingEnd: 10,
    marginBottom: 5,
  },
  back: {
    flex: 1,
    backgroundColor: '#f84804',
  },
  bottom: {
    left: 0,
    right: 0,
    justifyContent: 'center',
    flexDirection: 'row',
    top: 50,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorMessage: {
    fontWeight: '200',
    color: 'red',
  },
  forgotPass: {
    color: 'gray',
    paddingEnd: 10,
    marginBottom: 10,
  },
  formContainer: {
    padding: wp('3%'),
    justifyContent: 'center',
  },
  paddingStart: {
    paddingStart: 10,
  },
  loginButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingHorizontal: wp('7%'),
    padding: wp('4%'),
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },

  white: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
});
export default LoginScreen;
