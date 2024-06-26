import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Keyboard,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomModal from '../../components/CustomModal';
import CustomTextInput from '../../components/CustomTextInput';
import * as Services from '../../services';
import { Colors } from '../../themes/colors';
import { authAtom } from '@/src/atom';

const initialShowState = {
  showCurrent: true,
  showNew: true,
  showConNew: true,
};
const initialTextState = {
  textCurrent: '',
  textNew: '',
  textConNew: '',
};

const initialErrorState = {
  errCurrent: false,
  errNew: false,
  errConNew: false,
};
const ChangePassword = ({ route, navigation }) => {
  const [showState, setShowState] = useState(initialShowState);
  const [textState, setTextState] = useState(initialTextState);
  const [errorState, setErrorState] = useState(initialErrorState);
  const [user] = useAtom(authAtom);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);
  const [pwChangeSuccess, setPwChangeSuccess] = useState(false);

  const toggleShow = (param) => {
    setShowState({ ...showState, [param]: !showState[param] });
  };

  const onChangeText = (key, value) => {
    setErrorState(initialErrorState);
    setTextState({ ...textState, [key]: value });
  };

  const onPressSubmit = () => {
    setModalVisible(true);
    Keyboard.dismiss();
    var score = 0;
    var temp = {
      tp1: false,
      tp2: false,
      tp3: false,
      tp4: false,
      tp5: false,
    };
    if (!textState.textCurrent) {
      temp.tp1 = true;
      score++;
    }
    if (!textState.textNew) {
      temp.tp2 = true;
      score++;
    }
    if (!textState.textConNew) {
      temp.tp3 = true;
      score++;
    }
    if (textState.textNew !== textState.textConNew) {
      temp.tp2 = true;
      temp.tp3 = true;
      temp.tp4 = true;
      score++;
    }
    if (textState.textNew.length < 8) {
      temp.tp2 = true;
      temp.tp5 = true;
      score++;
    }

    if (score) {
      setModalVisible(false);
      setErrorState({
        errCurrent: temp.tp1,
        errNew: temp.tp2,
        errConNew: temp.tp3,
      });
      if (temp.tp1) {
        Alert.alert(
          '',
          'Please input required fields!',
          [
            {
              text: 'OK',
              onPress: () => {},
            },
          ],
          { cancelable: false }
        );
      } else if (temp.tp4) {
        Alert.alert(
          '',
          'Password didnt match',
          [
            {
              text: 'OK',
              onPress: () => {},
            },
          ],
          { cancelable: false }
        );
      } else if (temp.tp5) {
        Alert.alert(
          '',
          'Password must contains 8 characters',
          [
            {
              text: 'OK',
              onPress: () => {},
            },
          ],
          { cancelable: false }
        );
      } else {
        Alert.alert(
          '',
          'Please input required fields!',
          [
            {
              text: 'OK',
              onPress: () => {},
            },
          ],
          { cancelable: false }
        );
      }
      return;
    } else {
      console.log('No ui errors');
      console.log(user, 'STATE : ', textState);
      const params = {
        password: textState.textNew,
        password_confirmation: textState.textConNew,
        current_password: textState.textCurrent,
      };
      Services.updateUser(user?.user?.id, params).then((res) => {
        console.log('CHANGE PASS SCREEN ! : ', res);

        res === 'success'
          ? setPwChangeSuccess(true)
          : setPwChangeSuccess(false);
        setTimeout(() => {
          setModalLoading(false);
        }, 1500);
      });
    }
  };

  const contentChecker = () => {
    if (
      !textState.textNew ||
      !textState.textConNew ||
      !textState.textCurrent
    ) {
      return true;
    }
    return false;
  };

  const onTouchOutSide = () => {
    setModalVisible(false);
    setModalLoading(true);
    setPwChangeSuccess(false);
    setErrorState(initialErrorState);
    setTextState(initialTextState);
    setShowState(initialShowState);
  };

  const checkBackHandler = () => {
    return true;
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

  // useEffect(() => {
  //   Services.retrieveData('user').then(res => {
  //     if (res || res.status !== 'failed') {
  //       setUser(res.user);
  //     }
  //   });
  // }, []);

  return (
    <>
      <StatusBar
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />

      <CustomModal
        visible={modalVisible}
        loading={modalLoading}
        onTouchOutside={() => onTouchOutSide()}
        text={
          pwChangeSuccess
            ? 'Change password Successfully!'
            : 'Password Incorrect!'
        }
      />
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.white,
          height: 50,
          padding: 8,
          alignContent: 'center',
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name={'close-outline'}
            size={35}
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
          Change Password
        </Text>
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 10,
            right: 15,
          }}
          disabled={contentChecker()}
          hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
          onPress={() => onPressSubmit()}
        >
          <Ionicons
            name={'checkmark-outline'}
            size={35}
            color={contentChecker() ? 'gray' : Colors.primary}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, padding: 15, backgroundColor: '#fff' }}>
        <CustomTextInput
          placeholder="Current password"
          type
          showRightIcon={showState.showCurrent}
          value={textState.textCurrent}
          onChangeText={(val) => onChangeText('textCurrent', val)}
          error={errorState.errCurrent}

          //   hasRightIcon
          //   onPressRightIcon={() => toggleShow('showCurrent')}
        />
        <CustomTextInput
          placeholder="New password"
          type
          showRightIcon={showState.showNew}
          value={textState.textNew}
          onChangeText={(val) => onChangeText('textNew', val)}
          error={errorState.errNew}
          hasRightIcon
          onPressRightIcon={() => toggleShow('showNew')}
        />
        <CustomTextInput
          placeholder="Confirm password"
          type
          showRightIcon={showState.showNew}
          value={textState.textConNew}
          onChangeText={(val) => onChangeText('textConNew', val)}
          error={errorState.errConNew}

          // hasRightIcon
          //   onPressRightIcon={() => toggleShow('showConNew')}
        />
      </View>
    </>
  );
};

export default ChangePassword;
