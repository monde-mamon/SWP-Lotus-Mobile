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
import { BottomModal, ModalContent } from 'react-native-modals';
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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Moment from 'moment';
import Picker from '../../components/Picker';
import fetchLanguage from '../../utils/language';

const StorageLocationScreen = ({ route, navigation }) => {
  const [cameraOptionVisible, setCameraOptionVisible] =
    useState(false);

  const [logoutLoading, setLogoutLoading] = useState(true);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusVisible, setStatusVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);

  const [newTask, setNewTask] = useState(false);
  const [lang, setLang] = useState(0);
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
    if (data === 'storage_location') {
      if (val) {
        setState({
          ...state,
          storage_location: val,
        });
      } else {
        setState({
          ...state,
          storage_location: '',
        });
      }
    } else {
      if (val) {
        setState({
          ...state,
          id: val[0]?.id,
          remarks: val[0]?.remarks_from_nav,
          delivery_number: val[0]?.document_no || val,
        });
      } else {
        setState({
          ...state,
          delivery_number: '',
        });
      }
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

  const openPhotoLibrary = () => {
    onToggleAddImages();

    clearCachedImages();
    ImagePicker.openPicker({
      includeBase64: true,
      multiple: true,
    }).then((images) => {
      const temp = state.photos.concat(images);

      console.log('mama mo : ', temp);

      setState({ ...state, photos: temp });
    });
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
    if (!state.delivery_number || !state.storage_location) {
      Alert.alert(
        '',
        fetchLanguage[lang].pleaseinputrequired,
        [
          {
            text: 'OK',
            onPress: () => {},
          },
        ],
        { cancelable: false }
      );
      return;
    }
    const task = {
      remarks: state.remarks ? state.remarks : '',
      storage_location: state.storage_location,
      has_mattress: state.has_mattress,
      status: 'COMPLETED',
      location: locationFromLogin,
    };
    setStatusVisible(true);

    console.log(state, 'pasjdisdsaodiospaid ! : ', task);
    if (state.id) {
      Services.updateServiceOrder(state.id, task).then((res) => {
        console.log('UPLOADING STORAGE RESULT ! : ', res);

        if (!res) {
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
          setState({ ...initialState });
          setNewTask(false);
        } else {
          // if (state.photos.length < 1) {
          //   setStatusLoading(false);
          //   setIsSuccess(true);
          //   return;
          // } else {
          let temp = {
            bill_no: res.document_no,
            remarks: 'generated by storage location',
            remarks2: state.remarks ? state.remarks : '',
            customer_id: 1,
            status_id: 1,
            assembly: false,
            location_id: 1,
            has_mattress: state.has_mattress,
            location: locationFromLogin,
          };

          Services.uploadTask(temp).then((res) => {
            console.log(' UPLOADING TASK ! : ', res);
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
              setState({ ...initialState });
              setNewTask(false);
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
        remarks: 'generated by storage location',
        remarks2: state.remarks ? state.remarks : '',
        customer_id: 1,
        status_id: 1,
        status: 'COMPLETED',
        assembly: false,
        location_id: 1,
        has_mattress: state.has_mattress,
        location: locationFromLogin,
      };

      Services.uploadTask(temp).then((res) => {
        console.log(' UPLOADING TASK ! : ', res);
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
          setState({ ...initialState });
          setNewTask(false);
        } else {
          uploadPhoto(res.id);
        }
      });
    }
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

  const resetStateHandler = () => {
    setNewTask(false);
    setState({ ...initialState });
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
        <Header title="STORAGE LOCATION" navigation={navigation} />

        <ScrollView showsVerticalScrollIndicator={false}>
          <Card style={{ paddingHorizontal: 10 }}>
            <Picker
              setValue={handleResponse}
              type="delivery_number"
              placeholder={fetchLanguage[lang].scan_now}
              title={fetchLanguage[lang].freightnoteno}
              value={state.delivery_number}
              onPress={() =>
                onPressScan('delivery_number', 'Bill No.')
              }
              error={stateError.delivery_number}
              disabled={!newTask}
            />
            <Picker
              setValue={handleResponse}
              type="storage_location"
              placeholder={fetchLanguage[lang].scan_now}
              title={fetchLanguage[lang].storagelocation}
              value={state.storage_location}
              onPress={() =>
                onPressScan('storage_location', 'SL No.')
              }
              error={stateError.storage_location}
              disabled={!newTask}
            />
            <View
              style={{ paddingVertical: 15, flexDirection: 'row' }}
            >
              <Text>{fetchLanguage[lang].datestamp}</Text>
              <Text style={{ paddingStart: 10 }}>
                {newTask ? state.dateandtime : ''}
              </Text>
            </View>

            <View
              style={{
                paddingVertical: hp('1.5%'),
                flexDirection: 'row',
              }}
            >
              <Text>{fetchLanguage[lang].hasmattress}</Text>

              <TouchableOpacity
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
                style={{ paddingLeft: wp('3%') }}
                disabled={!newTask}
                onPress={() =>
                  setState({
                    ...state,
                    has_mattress: !state.has_mattress,
                  })
                }
              >
                {state.has_mattress ? (
                  <Ionicons
                    name="checkbox-outline"
                    size={wp('5%')}
                    color={'#000'}
                  />
                ) : (
                  <MaterialIcons
                    name="check-box-outline-blank"
                    size={wp('5%')}
                    color={'#000'}
                  />
                )}
              </TouchableOpacity>
            </View>
            <ImageSection
              title={fetchLanguage[lang].attachimages}
              value={state.photos}
              onPress={() => openCamera()}
              onDeletePicture={(data) => onDeletePicture(data)}
              disabled={!newTask}
            />
            <View style={{ height: hp('7%') }} />
          </Card>
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
                ? fetchLanguage[lang].submit
                : fetchLanguage[lang].new}
            </Text>
          </Pressable>
        </View>

        <BottomModal
          visible={false}
          onTouchOutside={() => onToggleAddImages()}
          onSwipeOut={() => onToggleAddImages()}
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
                  }}
                >
                  Choose upload image option
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
                          ? 'gray'
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
                    onPress={() => openCamera()}
                  >
                    <Ionicons name="camera-outline" size={30} />
                    <Text
                      style={{ paddingLeft: 10, alignSelf: 'center' }}
                    >
                      Open Camera
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
                    onPress={() => openPhotoLibrary()}
                  >
                    <Ionicons name="images-outline" size={30} />
                    <Text
                      style={{ paddingLeft: 10, alignSelf: 'center' }}
                    >
                      Open Photo Library
                    </Text>
                  </Pressable>
                </>
              </View>
            </>
          </ModalContent>
        </BottomModal>
      </View>
    </>
  );
};

export default StorageLocationScreen;
