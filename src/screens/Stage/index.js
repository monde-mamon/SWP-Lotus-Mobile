import * as Services from '../../services';

import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import Card from '../../components/Card';
import { Colors } from '../../themes/colors';
import CustomModal from '../../components/CustomModal';
import { Header } from '../../components/Header';
import ImagePicker from 'react-native-image-crop-picker';
import ImageSection from '../../components/ImageSection';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Moment from 'moment';
import Picker from '../../components/Picker';
import fetchLanguage from '../../utils/language';
import reactotron from 'reactotron-react-native';
import { useIsFocused } from '@react-navigation/native';

const StageScreen = ({ route, navigation }) => {
  const [cameraOptionVisible, setCameraOptionVisible] =
    useState(false);

  const [logoutLoading, setLogoutLoading] = useState(true);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusVisible, setStatusVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const [newTask, setNewTask] = useState(false);
  const [lang, setLang] = useState(0);
  const initProductCondition = [
    {
      id: 1,
      title: fetchLanguage[lang].good,
      active: true,
    },
    {
      id: 2,
      title: fetchLanguage[lang].torn,
      active: false,
    },
    {
      id: 3,
      title: fetchLanguage[lang].scratched,
      active: false,
    },
    {
      id: 4,
      title: fetchLanguage[lang].damaged,
      active: false,
    },
    {
      id: 5,
      title: fetchLanguage[lang].discolored,
      active: false,
    },
  ];
  const initReceivingDeptCondition = [
    {
      id: 1,
      title: 'MGL',
      active: true,
    },
    {
      id: 2,
      title: 'ISL',
      active: false,
    },
    {
      id: 3,
      title: 'CR',
      active: false,
    },
  ];
  const [prodCond, setProdCond] = useState(initProductCondition);
  const [departmentCond, setDepartmentCond] = useState(
    initReceivingDeptCondition
  );
  const initialState = {
    id: null,
    user_id: null,
    delivery_number: '',
    storage_location: '',
    remarks: '',
    photos: [],
    dateandtime: '',
    taskData: [],
    has_mattress: false,
  };
  const initialStateError = {
    id: null,
    delivery_number: '',
    storage_location: '',
    photos: '',
    dateandtime: '',
    has_mattressError: false,
  };
  const [state, setState] = useState(initialState);
  const [stateError, setStateError] = useState(initialStateError);

  const onPressScan = (data, placeholder) => {
    navigation.push('Capture', {
      handleResponse: handleResponse,
      // isRequired: true,
      data: data,
      fromHomeScreen: true,
      placeholder: placeholder,
    });
  };

  const handleResponse = useCallback((val, data) => {
    if (val) {
      console.log('QR/BAR CODE ', data, ' : ', val);

      console.log('RECEIVING FROM CAMERA : ', val[0]);
      setState({
        ...state,
        delivery_number: val,
      });
      // Services.searchTaskFunction(val[0]?.id + '').then((res) => {
      //   console.log('wowow ang galing! :', res);
      // });
    } else {
      setState({
        ...state,
        delivery_number: '',
      });
      console.log('ALAWS NGA');
    }
  });

  const onTouchOutSideToLogout = () => {
    setLogoutVisible(false);
    setLogoutLoading(true);
    Services.LogoutUser();
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    });
  };

  const onTouchOutSideSuccess = () => {
    setStatusVisible(false);
    setStatusLoading(true);
    setIsSuccess(false);
    setState({
      ...initialState,
    });
    setNewTask(false);
  };

  const clearCachedImages = () => {
    ImagePicker.clean()
      .then(() => {
        console.log('removed all tmp images from tmp directory');
      })
      .catch((e) => {
        console.log(
          'error removed all tmp images from tmp directory'
        );
      });
  };

  const onToggleAddImages = () => {
    setCameraOptionVisible(!cameraOptionVisible);
  };

  const openCamera = () => {
    onToggleAddImages();

    clearCachedImages();
    ImagePicker.openCamera({
      cropping: false,
      includeBase64: true,
    }).then((image) => {
      const temp = state.photos.concat(image);

      console.log('camera mo : ', temp);

      setState({ ...state, photos: temp });
    });
  };

  const onDeletePicture = (l) => {
    console.log('deleting item : ', l);

    const temp = state.photos.filter(
      (photo) => photo.data !== l.data
    );
    console.log('new array of photos : ', temp);

    setState({ ...state, photos: temp });
  };

  const onPressSubmitTask = () => {
    Services.getCurrentLocation().then((loc) => {
      console.log('CURRENT LOC : ', loc);
      const tempLoc = loc && {
        gps_string: `${loc.latitude},${loc.longitude}`,
      };

      if (!state.delivery_number) {
        Alert.alert(
          '',
          fetchLanguage[lang].pleaseinputrequired,
          [
            {
              text: 'OK',
              onPress: () => setStatusVisible(false),
            },
          ],
          { cancelable: false }
        );
        return;
      }

      const newD = prodCond.filter((item) => item.active === true);

      setStatusVisible(true);

      let temp = {
        bill_no: state?.delivery_number,
        product_condition: newD[0].title.toUpperCase(),
        remarks: 'generated by staging',
        location: locationFromLogin,
        ...tempLoc,
      };
      reactotron.log('DATA MO YAN IHHH : ', temp);
      Services.uploadTask(temp).then((res) => {
        reactotron.log(' UPLOADING TASK ! : ', res);
        if (!res || res === undefined) {
          Alert.alert(
            '',
            fetchLanguage[lang].somethingwentwrong,
            [
              {
                text: 'OK',
                onPress: () => setStatusVisible(false),
              },
            ],
            { cancelable: false }
          );
          const newArr = initProductCondition.slice();
          const newBrr = initReceivingDeptCondition.slice();
          setState({ ...initialState });
          setNewTask(false);
          setProdCond([...newArr]);
          setDepartmentCond([...newBrr]);
        } else {
          uploadPhoto(res.id);
        }
      });
    });
  };

  const uploadPhoto = (task_id) => {
    var fileCount = state.photos.length;
    var imagesContainer = state.photos;
    var loopCount = 0;
    console.log('Your final State: ', state);
    if (fileCount < 1) {
      setStatusLoading(false);
      setIsSuccess(true);
      return;
    }

    for (let i = 0; i <= fileCount - 1; i++) {
      const temp = {
        task_id: task_id,
        bill_no: state.delivery_number,
        image: `data:${imagesContainer[i].mime};base64,${imagesContainer[i].data}`,
      };
      Services.uploadPhoto(temp).then((res) => {
        loopCount++;

        console.log(fileCount, ' uploading image! : ', loopCount);
        if (loopCount === fileCount) {
          setStatusLoading(false);
          setIsSuccess(true);
        }
      });
    }
  };

  const onToggleTaskButton = () => {
    if (!newTask) {
      setNewTask(!newTask);

      setState({
        ...initialState,
        dateandtime: Moment().format('MMMM Do YYYY, h:mm:ss a'),
      });
    } else {
      onPressSubmitTask();
    }
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

  const [locationFromLogin, setLocationFromLogin] = useState('');

  useEffect(() => {
    Services.retrieveData('user').then((res) => {
      console.log('user fields : ', res);
      if (!res || res.status === 'failed') {
        setLogoutVisible(true);
        setTimeout(() => {
          setLogoutLoading(false);
        }, 1500);
      } else {
        setLocationFromLogin(res?.gps_login_location || 'None');

        setLang(res.language === 'ENG' ? 0 : 1);
      }
    });
  }, []);

  const setNewProdSelect = (item) => {
    const newD = prodCond.slice();
    newD.forEach((i) => (i.active = false));
    newD[item.id - 1].active = true;
    setProdCond(newD);
  };

  const setNewReceivingDept = (item) => {
    const newD = departmentCond.slice();
    newD.forEach((i) => (i.active = false));
    newD[item.id - 1].active = true;
    setDepartmentCond(newD);
  };

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          padding: wp('4%'),
        }}
      >
        <CustomModal
          visible={logoutVisible}
          loading={logoutLoading}
          onTouchOutside={() => onTouchOutSideToLogout()}
          text={'Session timeout!'}
        />
        <CustomModal
          visible={statusVisible}
          loading={statusLoading}
          onTouchOutside={() => onTouchOutSideSuccess()}
          text={
            isSuccess
              ? 'Updated Successfully!'
              : 'Something went wrong!'
          }
        />
        <Header title={'STAGING'} navigation={navigation} />
        <ScrollView showsVerticalScrollIndicator={false}>
          <>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                paddingBottom: 10,
              }}
            >
              <Picker
                setValue={handleResponse}
                type="delivery_number"
                placeholder={fetchLanguage[lang].scan_now}
                disabled={!newTask}
                title={fetchLanguage[lang].freightnoteno}
                receiving
                value={state.delivery_number}
                onPress={() =>
                  onPressScan('delivery_number', 'Bill No.')
                }
                error={stateError.delivery_number}
              />
            </View>
            <Card title={fetchLanguage[lang].productcondition}>
              {prodCond.map((item) => (
                <TouchableOpacity
                  key={item.id.toString()}
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    padding: 5,
                    paddingStart: 25,
                    alignItems: 'center',
                  }}
                  disabled={!newTask}
                  onPress={() => setNewProdSelect(item)}
                >
                  {item.active ? (
                    <Ionicons
                      name="radio-button-on-outline"
                      size={25}
                    />
                  ) : (
                    <Ionicons
                      name="radio-button-off-outline"
                      size={25}
                    />
                  )}
                  <Text>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </Card>

            <View style={{ height: hp('10%') }} />
          </>
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            right: 0,
            left: 0,
            bottom: 30,
          }}
        >
          <Pressable
            disabled={newTask && !statusLoading}
            onPress={() => onToggleTaskButton()}
            style={({ pressed }) => [
              {
                backgroundColor: statusLoading
                  ? Colors.primary
                  : 'gray',
                padding: pressed ? wp('3%') : wp('3.5%'),
                alignSelf: 'center',
                elevation: 5,
                width: pressed ? wp('33%') : wp('34%'),
                borderRadius: 40,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 20,
                color: '#fff',
                textAlign: 'center',
              }}
            >
              {newTask
                ? fetchLanguage[lang].stage
                : fetchLanguage[lang].new}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default StageScreen;
