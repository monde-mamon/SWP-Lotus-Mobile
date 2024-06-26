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

const ReceivingScreen = ({ route, navigation }) => {
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
  const [prodCond, setProdCond] = useState(initProductCondition);

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
        id: val[0]?.id,
        remarks: val[0]?.remarks_from_nav,
        delivery_number: val[0]?.document_no || val,
        storage_location: val[0]?.storage_location,
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
      console.log('OQOWIQIOIQOIOQIOQOIQO ! :  ', newD);
      const task = {
        remarks: state.remarks ? state.remarks : '',
        condition: newD[0].title.toUpperCase(),
        storage_location: state.storage_location,
      };
      console.log(state, 'pasjdisdsaodiospaid ! : ', task);
      setStatusVisible(true);
      if (state.id) {
        Services.updateServiceOrder(state.id, task).then((res) => {
          reactotron.log('UPLOADING RECEIVING RESULT ! : ', res);

          if (!res) {
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
            setState({ ...initialState });
            setNewTask(false);
            setProdCond([...newArr]);
          } else {
            // if (state.photos.length < 1) {
            //   setStatusLoading(false);
            //   setIsSuccess(true);
            //   return;
            // } else {
            let temp = {
              bill_no: res.document_no,
              product_condition: newD[0].title.toUpperCase(),
              remarks: 'generated by receiving',
              remarks2: state.remarks ? state.remarks : '',
              status: 'COMPLETED',
              assembly: false,
              ...tempLoc,
              // gps_string: `${loc.latitude},${loc.longitude}`,
              // house_type: 'CONDO',
            };
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
                setState({ ...initialState });
                setNewTask(false);
                setProdCond([...newArr]);
              } else {
                uploadPhoto(res.id);
              }
            });
            // }
          }
        });
      } else {
        let temp = {
          bill_no: state.delivery_number,
          product_condition: newD[0].title.toUpperCase(),
          remarks: 'generated by receiving',
          remarks2: state.remarks ? state.remarks : '',
          status: 'COMPLETED',
          assembly: false,
          location: locationFromLogin,
          ...tempLoc,
          // gps_string: `${loc.latitude},${loc.longitude}`,
        };
        Services.uploadTask(temp).then((res) => {
          reactotron.log(' UPLOADING TASK ! : ', res);
          if (!res || res === undefined) {
            Alert.alert(
              '',
              fetchLanguage[lang].somethingwentwrong,
              [
                {
                  text: 'OK',
                  onPress: () => {},
                },
              ],
              { cancelable: false }
            );
            const newArr = initProductCondition.slice();
            setState({ ...initialState });
            setNewTask(false);
            setProdCond([...newArr]);
          } else {
            uploadPhoto(res.id);
          }
        });
      }
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

  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.white,
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
        <Header title={'RECEIVING'} navigation={navigation} />
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
                placeholder={fetchLanguage[lang].presstoscan}
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
                      color={Colors.black}
                    />
                  ) : (
                    <Ionicons
                      name="radio-button-off-outline"
                      size={25}
                      color={Colors.black}
                    />
                  )}
                  <Text style={{ color: Colors.black }}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </Card>

            <Card
              title={fetchLanguage[lang].attachimages}
              style={{ paddingHorizontal: 15 }}
            >
              <ImageSection
                value={state.photos}
                onPress={() => openCamera()}
                onDeletePicture={(data) => onDeletePicture(data)}
                disabled={!newTask}
              />
            </Card>

            <Card title={fetchLanguage[lang].remarks}>
              <View
                style={{
                  marginTop: hp('1%'),
                  borderRadius: 5,
                  borderWidth: 0.5,
                  borderColor: '#D3D3D3',
                  alignSelf: 'center',
                  width: '90%',
                  height: hp('15%'),
                  paddingHorizontal: hp('1%'),
                  backgroundColor: !newTask ? '#D3D3D3' : '#fff',
                }}
              >
                <TextInput
                  editable={newTask}
                  placeholder="Enter remarks here"
                  style={{ flexWrap: 'wrap' }}
                  numberOfLines={3}
                  multiline={true}
                  value={state.remarks}
                  onChangeText={(value) =>
                    setState({ ...state, remarks: value })
                  }
                />
              </View>
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
                color: Colors.white,
                textAlign: 'center',
              }}
            >
              {newTask
                ? fetchLanguage[lang].submit
                : fetchLanguage[lang].new}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
};

export default ReceivingScreen;
