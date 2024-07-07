import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  Pressable,
  StatusBar,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BottomModal,
  Modal,
  ModalContent,
  ScaleAnimation,
} from 'react-native-modals';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomTextInput from '../../components/CustomTextInput';
import * as Services from '../../services';
import { Colors } from '../../themes/colors';
import firebaseRemoteConfig from '../../utils/firebase';
import { authAtom, languageAtom } from '@/src/atom';
import { language } from '@/src/utils/language';

const Settings = ({ navigation }) => {
  const [langVisible, setLangVisible] = useState(false);
  const [verifypassVisible, setVerifypassVisible] = useState(false);
  const [user] = useAtom(authAtom);
  const [requestedLang, setRequestedLang] = useState('ENG');
  const [isShowLocation] = useState(false);
  const [lang, setLang] = useAtom(languageAtom);
  const [isPDAMode, setIsPDAMode] = useState(false);
  const [hidePDAMode, setHidePDAMode] = useState(false);
  const [isLocation, setIsLocation] = useState(false);
  const [passState, setPassState] = useState({
    value: '',
    error: '',
    showRightIcon: false,
  });
  const [loading, setLoading] = useState(false);

  const toggleSwitch = () => {
    setIsPDAMode((previousState) => !previousState);
    console.log('HAYO!: ', !!!isPDAMode);
    Services.storeData('ispdamode', !!!isPDAMode);
  };
  const toggleSwitchLocation = () => {
    setIsLocation((previousState) => !previousState);
    console.log('sdfkjpsdok!: ', !!!isLocation);
    Services.storeData('isLocationOff', !!!isLocation);
  };
  const goToChangePass = () => {
    navigation.navigate('ChangePassword');
  };
  const checkBackHandler = () => {
    return true;
  };
  const onToggleLangOptions = (text) => {
    setLangVisible(false);
    setVerifypassVisible(true);
    setRequestedLang(text);
  };
  const onTouchOutSide = () => {
    setLoading(false);
    setLangVisible(false);
    setVerifypassVisible(false);
    setPassState({
      value: '',
      error: '',
      showRightIcon: false,
    });
  };

  const onChangeText = (val) => {
    setPassState({ ...passState, value: val, error: false });
  };
  const onPressVerify = () => {
    if (!passState.value) {
      setPassState({ ...passState, error: true });
    } else {
      setLoading(true);
      const params = {
        language: requestedLang,
        current_password: passState.value,
      };
      Services.updateUser(user?.user?.id, params).then((res) => {
        console.log('CHANGE LANGUAGE SCREEN ! : ', res);
        // setModalVisible(true);
        const temp = {
          user: { ...user.user, language: requestedLang },
        };

        console.log('yow!!:', temp);

        Services.storeData('user', temp);
        setLang(language[requestedLang]);
        if (res === 'success') {
          Alert.alert(
            '',
            'Change language successfully!',
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ],
            { cancelable: false }
          );
          onTouchOutSide();
        } else {
          setPassState({ ...passState, error: true });
          Alert.alert(
            '',
            'Password incorrect!',
            [
              {
                text: 'OK',
                onPress: () => {},
              },
            ],
            { cancelable: false }
          );
          setLoading(false);
        }
      });
    }
  };
  useEffect(() => {
    BackHandler.addEventListener(
      'hardwareBackPress',
      checkBackHandler
    );

    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        checkBackHandler
      );
    };
  }, [checkBackHandler]);
  useEffect(() => {
    const task = async () => {
      const data = await firebaseRemoteConfig();
      // if () {
      setHidePDAMode(!data.IS_PDA_MODE_ON);
      // Services.storeData('ispdamode', false);
      // }
    };
    Services.retrieveData('user').then((res) => {
      if (res || res.status !== 'failed') {
        setUser(res);
      }
    });
    Services.retrieveData('ispdamode').then((res) => {
      console.log('is pda mode  : ', res);
      if (!res || res.status === 'failed') {
      } else {
        setIsPDAMode(res);
      }
    });
    Services.retrieveData('isLocationOff').then((res) => {
      console.log('is location   : ', res);
      if (!res || res.status === 'failed') {
      } else {
        setIsLocation(res);
      }
    });
    task();
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />

      <View
        style={{
          flexDirection: 'row',
          backgroundColor: '#fff',
          height: 50,
          padding: 8,
          alignContent: 'center',
          //   borderBottomWidth: 0.3,
        }}
      >
        <TouchableOpacity
          style={{
            top: 5,
          }}
          onPress={() => navigation.goBack()}
        >
          <Ionicons
            name={'chevron-back'}
            size={25}
            color={Colors.black}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: Colors.black,
            fontSize: wp('6%'),
            top: 5,
            paddingStart: 20,
          }}
        >
          {lang.settings}
        </Text>
      </View>

      <View
        style={{
          flex: 1,
          padding: 15,
          backgroundColor: Colors.white,
        }}
      >
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: wp('5%'),
            paddingVertical: 10,
            color: Colors.black,
          }}
        >
          {lang.account}
        </Text>

        <TouchableOpacity
          style={{
            borderRadius: 6,
            paddingVertical: 8,
            flexDirection: 'row',
          }}
          onPress={goToChangePass}
        >
          <Ionicons
            name={'key-outline'}
            size={20}
            color={Colors.black}
          />

          <Text
            style={{
              fontSize: wp('5%'),
              paddingStart: 10,
              color: Colors.black,
            }}
          >
            {lang.changepassword}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            // height: 0.5,
            width: '90%',
            backgroundColor: Colors.black,
            alignSelf: 'center',
            marginVertical: 5,
          }}
        />
        <TouchableOpacity
          style={{
            borderRadius: 6,
            paddingVertical: 8,
            flexDirection: 'row',
          }}
          onPress={() => setLangVisible(true)}
        >
          <Ionicons
            name={'language-outline'}
            size={20}
            color={Colors.black}
          />

          <Text
            style={{
              fontSize: wp('5%'),
              paddingStart: 10,
              color: Colors.black,
            }}
          >
            {lang.changelanguage}
          </Text>
        </TouchableOpacity>
        {isShowLocation && (
          <View
            style={{
              borderRadius: 6,
              paddingVertical: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <Ionicons
                name={'locate'}
                size={20}
                color={Colors.black}
              />

              <Text
                style={{
                  fontSize: wp('5%'),
                  paddingStart: 10,
                  color: Colors.black,
                }}
              >
                {lang.location}
              </Text>
            </View>
            <Switch
              trackColor={{ false: 'gray', true: 'gray' }}
              thumbColor={isLocation ? Colors.primary : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitchLocation}
              value={isLocation}
            />
          </View>
        )}
        {hidePDAMode && (
          <View
            style={{
              borderRadius: 6,
              paddingVertical: 10,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <Ionicons
                name={'qr-code-outline'}
                size={20}
                color={Colors.black}
              />

              <Text
                style={{
                  fontSize: wp('5%'),
                  paddingStart: 10,
                  color: Colors.black,
                }}
              >
                {lang.isPDAMODE}
              </Text>
            </View>
            <Switch
              trackColor={{ false: 'gray', true: 'gray' }}
              thumbColor={isPDAMode ? Colors.primary : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isPDAMode}
            />
          </View>
        )}
      </View>
      <BottomModal
        visible={langVisible}
        onTouchOutside={() => onTouchOutSide()}
        onSwipeOut={() => onTouchOutSide()}
        modalTitle={
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 20,
              width: '100%',
            }}
          >
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: '#70707029',
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 16,
                  paddingBottom: 15,
                  color: Colors.black,
                }}
              >
                {lang.chooselanguage}
              </Text>
            </View>
          </View>
        }
      >
        <ModalContent>
          <>
            <View style={{ alignContent: 'center' }}>
              <>
                <Pressable
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed
                        ? '#D9D9D9'
                        : 'transparent',
                    },
                    {
                      marginLeft: -20,
                      padding: 15,
                      width: '110%',
                      paddingLeft: 20,
                      flexDirection: 'row',
                      borderRadius: 5,
                    },
                  ]}
                  onPress={() => onToggleLangOptions('ENG')}
                >
                  <Text
                    style={{
                      paddingLeft: 10,
                      alignSelf: 'center',
                      color: Colors.black,
                    }}
                  >
                    ENGLISH
                  </Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed
                        ? '#D9D9D9'
                        : 'transparent',
                    },
                    {
                      marginLeft: -20,
                      padding: 15,
                      width: '110%',
                      paddingLeft: 20,
                      flexDirection: 'row',
                      borderRadius: 5,
                    },
                  ]}
                  onPress={() => onToggleLangOptions('THAI')}
                >
                  <Text
                    style={{
                      paddingLeft: 10,
                      alignSelf: 'center',
                      color: Colors.black,
                    }}
                  >
                    THAI
                  </Text>
                </Pressable>
              </>
            </View>
          </>
        </ModalContent>
      </BottomModal>

      <Modal
        visible={verifypassVisible}
        onTouchOutside={() => onTouchOutSide()}
        modalAnimation={
          new ScaleAnimation({
            initialValue: 0, // optional
            useNativeDriver: true, // optional
          })
        }
      >
        <ModalContent
          style={{
            width: Dimensions.get('screen').width - 50,
            paddingVertical: 20,
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ color: Colors.black }}>
            Enter current password to change language:{' '}
          </Text>
          <CustomTextInput
            placeholder="Current password"
            type
            widthType
            maxLength={20}
            value={passState.value}
            onChangeText={(val) => onChangeText(val)}
            error={passState.error}
            showRightIcon={passState.showRightIcon}
            hasRightIcon
            onPressRightIcon={() =>
              setPassState({
                ...passState,
                showRightIcon: !passState.showRightIcon,
              })
            }
          />
          {loading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <TouchableOpacity
              style={{
                padding: 15,
                backgroundColor: Colors.primary,
                borderRadius: 5,
              }}
              onPress={() => onPressVerify()}
            >
              <Text style={{ textAlign: 'center', color: '#fff' }}>
                VERIFY PASSWORD
              </Text>
            </TouchableOpacity>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Settings;
