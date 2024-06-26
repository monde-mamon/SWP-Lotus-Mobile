import * as Services from '../../services';
import * as Utils from '../../utils/permission';

import {
  ActivityIndicator,
  Alert,
  BackHandler,
  FlatList,
  Platform,
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

import { Colors } from '../../themes/colors';
import Config from 'react-native-config';
import CustomModal from '../../components/CustomModal';
import { Header } from '../../components/Header';
import ImageCard from '../../components/ImageCard';
import ImagePicker from 'react-native-image-crop-picker';
import ImageSection from '../../components/ImageSection';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Picker from '../../components/Picker';
import Row from '../../components/Row';
import fetchLanguage from '../../utils/language';
import reactotron from 'reactotron-react-native';

const HomeScreen = ({ route, navigation }) => {
  const [content, setContent] = useState([]);
  const [dynamicModalVisible, setDynamicModalVisible] =
    useState(false);
  const [cameraOptionVisible, setCameraOptionVisible] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activePicker, setActivePicker] = useState('');
  const [logoutLoading, setLogoutLoading] = useState(true);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [successLoading, setSuccessLoading] = useState(false);
  const [newTask, setNewTask] = useState(false);
  const [dashBoardData, setDashBoardData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [initialTemplate, setInitialTemplate] = useState('');
  const [userlevel, setUserlevel] = useState(0);
  const [lang, setLang] = useState(0);
  const [historyModal, setHistoryModal] = useState(false);
  const [selectedHistory, setSelectedHisoty] = useState({});
  reactotron.log('selectedHistory', selectedHistory);
  const initialState = {
    userlevel: null,
    user_id: null,
    template: {
      id: null,
      name: 'None',
      description: '',
      is_active: false,
    },
    customer: {
      id: null,
      name: 'None',
      description: '',
      is_active: false,
    },
    delivery_number: fetchLanguage[lang].scan_now,

    condition: {
      id: null,
      name: 'None',
      description: '',
      is_active: false,
    },
    status: {
      id: null,
      name: 'None',
      description: '',
      is_active: false,
    },
    house_type: {
      id: null,
      name: 'None',
      description: '',
      is_active: false,
    },
    remarks: '',
    assembly: false,
    photos: [],
  };
  const initialStateError = {
    template: '',
    customer: '',
    delivery_number: '',
    condition: '',
    status: '',
    house_type: '',
    remarks: '',
    assembly: '',
    photos: '',
  };
  const [state, setState] = useState(initialState);
  const [stateError, setStateError] = useState(initialStateError);

  const onPressContent = (text) => {
    if (text) {
      setActivePicker(text);
    }

    setLoading(true);
    setDynamicModalVisible(true);
    setError(false);
    setTimeout(() => {
      Services.dynamicFunction(text ? text : activePicker).then(
        (res) => {
          if (!res) {
            setLoading(false);
            setError(true);
          } else if (res === 'Not Authorized') {
            onTouchOutside();
            setLogoutVisible(true);
            setTimeout(() => {
              setLogoutLoading(false);
            }, 1500);
          } else {
            setLoading(false);
            setError(false);
            setContent(res.data);
          }
        }
      );
    }, 1000);
  };

  const onPressValue = (data) => {
    const active = activePicker;
    switch (active) {
      case 'Template':
        setState({
          ...initialState,
          template: data,
        });
        break;

      case 'Customer':
        setState({
          ...state,
          customer: data,
        });
        break;

      case 'Production Condition':
        setState({
          ...state,
          condition: data,
        });
        break;

      case 'Job Status':
        setState({
          ...state,
          status: data,
        });
        break;

      case 'House Type':
        setState({
          ...state,
          house_type: data,
        });
        break;

      default:
        null;
    }
    onTouchOutside();
  };

  const onPressScan = (data) => {
    navigation.push('Capture', {
      handleResponse: handleResponse,
      data: data,
      fromHomeScreen: true,
    });
  };

  const handleResponse = useCallback((val, data) => {
    if (val) {
      // console.log('QR/BAR CODE ', data, ' : ', val);

      setState({ ...state, [data]: val });
    } else {
      // console.log('ALAWS NGA');
    }
  });

  const onTouchOutside = () => {
    setDynamicModalVisible(false);
    setContent([]);
    setLoading(true);
    setActivePicker('');
  };

  const onTouchOutSideToLogout = () => {
    setLogoutVisible(false);
    setLogoutLoading(true);
    Services.LogoutUser();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const onTouchOutSideSuccess = () => {
    setSuccessLoading(false);
    setState({
      ...initialState,
      template: {
        id: 0,
        name: initialTemplate,
        description: '',
        is_active: false,
      },
      userlevel: userlevel,
    });
    setNewTask(false);
    getHistoryTask();
  };

  const clearCachedImages = () => {
    ImagePicker.clean()
      .then(() => {
        // console.log('removed all tmp images from tmp directory');
      })
      .catch((e) => {
        // console.log(
        //   'error removed all tmp images from tmp directory'
        // );
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
      width: 1280,
      height: 720,
    }).then((images) => {
      const temp = state.photos.concat(images);

      // console.log('mama mo : ', temp);

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

      // console.log('camera mo : ', temp);

      setState({ ...state, photos: temp });
    });
  };

  const onDeletePicture = (l) => {
    // console.log('deleting item : ', l);

    const temp = state.photos.filter(
      (photo) => photo.data !== l.data
    );
    // console.log('new array of photos : ', temp);

    setState({ ...state, photos: temp });
  };

  const onPressSendTask = () => {
    const task = {
      bill_no: state.delivery_number,
      customer_id: state.customer.id,
      condition_id: state.condition.id | 1,
      house_type_id: state.house_type.id | 1,
      status_id: state.status.id,
      remarks: state.remarks,
      assembly: state.assembly,
      location_id: 1,
    };
    Services.uploadTask(task).then((res) => {
      // console.log(' UPLOADING TASK ! : ', res);
      if (!res) {
        Alert.alert(
          '',
          'Something went wrong! ',
          [
            {
              text: 'OK',
              onPress: () => {},
            },
          ],
          { cancelable: false }
        );
        setState({ ...initialState });
      } else {
        uploadPhoto(res.id);
      }
    });
  };

  const uploadPhoto = (task_id) => {
    var fileCount = state.photos.length;
    var imagesContainer = state.photos;
    var loopCount = 0;
    // console.log('Your final State: ', state);
    if (fileCount < 1) {
      setSuccessLoading(true);
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

        // console.log(fileCount, ' uploading image! : ', loopCount);
        if (loopCount === fileCount) {
          setSuccessLoading(true);
        }
      });
    }
  };

  const getHistoryTask = useCallback(async () => {
    setRefreshing(true);
    Services.getHistoryTask().then((res) => {
      // console.log('halllow : ', res);
      if (!res || res.status === 'failed') {
        setDashBoardData([]);
        setLogoutVisible(true);
        setTimeout(() => {
          setLogoutLoading(false);
        }, 1500);
      } else {
        setTimeout(() => {
          setDashBoardData(res);
          setRefreshing(false);
        }, 1000);
      }
    });

    Utils.checkPermissionAndroidLocation();
    // Services.getCurrentLocation().then((res) => {
    //   console.log('CURRENT LOC : ', res);
    // });
  }, []);

  const onToggleTaskButton = () => {
    setNewTask(!newTask);
    if (!newTask) {
      setState({
        ...initialState,
        template: {
          id: 0,
          name: initialTemplate,
          description: '',
          is_active: false,
        },
        userlevel: userlevel,
      });
    }
  };
  const onTouchOutsideHistoryModal = (item) => {
    setHistoryModal((s) => !s);
    setSelectedHisoty({});
    if (item) {
      setSelectedHisoty(item);
    }
  };

  useEffect(() => {
    getHistoryTask();
  }, [getHistoryTask]);

  const checkBackHandler = () => {
    if (route.name === 'Home') {
      return BackHandler.exitApp();
    } else {
      return true;
      // navigation.goBack();
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
    Services.retrieveData('user').then((res) => {
      // console.log('user fields : ', res);
      if (!res || res.status === 'failed') {
        setLogoutVisible(true);
        setTimeout(() => {
          setLogoutLoading(false);
        }, 1500);
      } else {
        let temp = '';

        // if (res.user_type === 'ADMIN') {
        //   temp = 'None';
        // } else {
        temp = res.user_type;
        // }
        setInitialTemplate(temp);
        setUserlevel(res.userlevel);
        setLang(res.language === 'ENG' ? 0 : 1);
        setState({
          ...initialState,
          template: {
            id: 0,
            name: temp,
            description: '',
            is_active: false,
          },
          ...res,
        });
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
        <Header title="LSC-" navigation={navigation} />

        <CustomModal
          visible={logoutVisible}
          loading={logoutLoading}
          onTouchOutside={() => onTouchOutSideToLogout()}
          text={'Session timeout!'}
        />
        {/* <CustomModal
          visible={successLoading}
          onTouchOutside={() => onTouchOutSideSuccess()}
          text={'Task Uploaded Successfully!'}
        /> */}

        <>
          <Text style={{ paddingTop: 20, fontSize: 20 }}>
            {fetchLanguage[lang].mytask}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              padding: 20,
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ fontWeight: 'bold', width: wp('25%') }}>
              {fetchLanguage[lang].bill_no}
            </Text>
            <Text style={{ fontWeight: 'bold' }}>
              {fetchLanguage[lang].date}
            </Text>
            <Text style={{ fontWeight: 'bold' }}>
              {fetchLanguage[lang].immageattached}
            </Text>
          </View>
          <FlatList
            refreshing={refreshing}
            onRefresh={getHistoryTask}
            ListEmptyComponent={() => (
              <View
                style={{
                  marginTop: hp('30%'),
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                }}
              >
                <Text style={{ color: Colors.black }}>
                  {fetchLanguage[lang].notaskhistory}
                </Text>

                <View
                  style={{
                    marginTop: 30,
                    marginBottom: 30,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      borderWidth: 0.5,
                      borderRadius: 5,
                      borderColor: Colors.primary,
                      width: 100,
                      alignContent: 'center',
                      alignSelf: 'center',
                    }}
                    onPress={getHistoryTask}
                  >
                    <Text
                      style={{
                        textAlign: 'center',
                        color: Colors.black,
                      }}
                    >
                      {fetchLanguage[lang].reload}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            data={dashBoardData}
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  {
                    flexDirection: 'row',
                    paddingVertical: 20,
                    paddingLeft: 5,
                    paddingRight: 30,
                    justifyContent: 'space-between',
                    backgroundColor: pressed
                      ? Colors.primary
                      : 'transparent',
                    borderRadius: 5,
                  },
                ]}
                onPress={() => onTouchOutsideHistoryModal(item)}
              >
                <View style={{ width: wp('30%') }}>
                  <Text
                    style={{ color: Colors.black }}
                    f={1}
                    numberOfLines={1}
                  >
                    {item.bill_no}
                  </Text>
                </View>
                <View
                  style={{
                    paddingRight: wp('10%'),
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      color: Colors.black,
                    }}
                  >
                    {item.status_date}
                  </Text>
                </View>
                <View
                  style={{
                    paddingRight: wp('10%'),
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      color: Colors.black,
                    }}
                  >
                    {item.status_id}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        </>

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
        <BottomModal
          visible={dynamicModalVisible}
          onTouchOutside={onTouchOutside}
          onSwipeOut={onTouchOutside}
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
                  {`Choose ${activePicker}`}
                </Text>
              </View>
            </View>
          }
        >
          <ModalContent>
            <>
              <View style={{ alignContent: 'center' }}>
                {loading ? (
                  <View
                    style={{
                      marginTop: 30,
                      marginBottom: 30,
                    }}
                  >
                    <ActivityIndicator
                      size="large"
                      color={
                        Platform.OS === 'android' && Colors.primary
                      }
                    />
                  </View>
                ) : error ? (
                  <>
                    <View
                      style={{
                        marginTop: 30,
                        marginBottom: 30,
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          padding: 10,
                          borderWidth: 0.5,
                          borderRadius: 5,
                          borderColor: Colors.primary,
                          width: 100,
                          alignContent: 'center',
                          alignSelf: 'center',
                        }}
                        onPress={() => onPressContent()}
                      >
                        <Text style={{ textAlign: 'center' }}>
                          Try Again
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    {content.map((data, l) => {
                      return (
                        <Pressable
                          key={data.id}
                          style={({ pressed }) => [
                            {
                              backgroundColor: pressed
                                ? '#D9D9D9'
                                : 'transparent',
                            },
                            {
                              marginLeft: -19,
                              padding: 20,
                              width: '110%',
                              paddingLeft: 20,
                              flexDirection: 'row',
                              borderRadius: 5,
                            },
                          ]}
                          onPress={() => onPressValue(data)}
                        >
                          <Text style={{ paddingLeft: 15 }}>
                            {data.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </>
                )}
              </View>
            </>
          </ModalContent>
        </BottomModal>

        {/* //FOR VIEWING HISTORY ITEM */}
        <BottomModal
          visible={historyModal}
          onTouchOutside={() => onTouchOutsideHistoryModal()}
          onSwipeOut={() => onTouchOutsideHistoryModal()}
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
                  {`Bill No. ${selectedHistory?.bill_no}`}
                </Text>
              </View>
            </View>
          }
        >
          <ModalContent>
            <>
              <View style={{ alignContent: 'center' }}>
                <Row
                  left="Date : "
                  right={selectedHistory?.status_date}
                />

                <Row
                  left="Status ID: "
                  right={selectedHistory?.status_id}
                />
              </View>
            </>
          </ModalContent>
        </BottomModal>
      </View>
    </>
  );
};

export default HomeScreen;
