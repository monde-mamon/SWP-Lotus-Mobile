'use strict';

import * as Services from '../../services';

import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BottomModal, ModalContent } from 'react-native-modals';
import {
  PERMISSIONS,
  RESULTS,
  check,
} from 'react-native-permissions';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import BarcodeMask from 'react-native-barcode-mask';
import { Colors } from '../../themes/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { Input } from 'react-native-elements';
import { RFValue } from 'react-native-responsive-fontsize';
// import RNBeep from 'react-native-a-beep';
// import {RNCamera} from 'react-native-camera';
import fetchLanguage from '../../utils/language';

const CameraScreen = ({ route, navigation }) => {
  const {
    handleResponse,
    data,
    fromHomeScreen,
    fromOtherScreen,
    staging,
    placeholder,
    isRequired,
  } = route.params || {};

  const cameraref = useRef();
  const [recognizing, setRecognizing] = useState(false);
  const [stopScanning, setStopScanning] = useState(true);
  const [process, setProcess] = useState(false);
  const [bottomVisible, setBottomVisible] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [lang, setLang] = useState(0);
  const [isPDAMode, setIsPDAMode] = useState(false);
  const [pdaTextValue, setPdaTextValue] = useState('');
  const [isLoadingScreen, setLoadingScreen] = useState(true);
  const inputRef = useRef(null);

  const [loadingStage, setLoadingStage] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const checkPermissionAndroid = useCallback(() => {
    check(PERMISSIONS.ANDROID.CAMERA)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)'
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable'
            );
            Alert.alert(
              'Camera is not permitted, /n Check your setting'
            );
            // navigation.goBack();
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log(
              'The permission is denied and not requestable anymore'
            );
            Alert.alert(
              'Camera is not permitted, /n Check your setting'
            );
            navigation.goBack();
            break;
        }
      })
      .then((val) => {
        return val;
      })
      .catch((error) => {
        Alert.alert('Error Permissions : ', JSON.stringify(error));
      });
  }, [navigation]);

  const onBarCodeRead = async (e) => {
    if (e.data) {
      console.log('gagaga ! : ', e.data);

      if (stopScanning) {
        setErrorModal(false);
        setRecognizing(true);
        setStopScanning(false);
        setProcess(true);
        setSearchResult([]);
        // RNBeep.beep();
        if (fromHomeScreen) {
          setTimeout(() => {
            const value = e.data;
            navigation.pop();
            handleResponse(value, data);
          }, 1500);
        } else if (fromOtherScreen) {
          const value = e.data;
          // const value ="S022210117268"
          // const value = 'A022220001924';
          // const value = 'S650210000460';
          // const value = 'S122220002025'

          Services.searchFunction(value).then((res) => {
            console.log(
              'fromOtherScreen Search function result : ',
              res
            );
            if (!res || res === undefined) {
              if (isRequired) {
                setErrorModal(true);
                setProcess(false);
              } else {
                setTimeout(() => {
                  const tempVal = e.data;
                  navigation.pop();
                  handleResponse(tempVal, data);
                }, 1500);
              }
            } else {
              setTimeout(() => {
                navigation.pop();
                handleResponse(res, data);
              }, 1500);
            }
          });
        } else {
          const value = e.data;
          // const value = 'S022210113209';
          // const value = 'S022-20009748';
          // const value = 'S650210000460';
          // const value = 'A022210003840';
          // const value = 'DO-2301000010';

          Services.searchBillFunction(value).then((res) => {
            console.log('Search function result : ', res);
            if (!res || res === undefined) {
              setTimeout(() => {
                setErrorModal(true);
                setProcess(false);
              }, 1500);
            } else {
              setTimeout(() => {
                setSearchResult(res);
                setProcess(false);
              }, 1500);
            }
          });
        }
      }
    }
  };

  const closeModal = () => {
    setBottomVisible(false);
    setStopScanning(true);
    setProcess(false);
    setRecognizing(false);
  };

  const tryAgain = () => {
    setLoadingStage(false);
    setErrorModal(false);
    setSearchResult([]);
    setStopScanning(true);
    setRecognizing(false);
    setProcess(false);
    setPdaTextValue('');
  };

  const resetState = () => {
    navigation.pop();
    tryAgain();
  };
  const goBack = () => {
    console.log('iback mo gago!');
    navigation.pop();
  };

  const onPressStage = () => {
    setLoadingStage(true);
    Services.getCurrentLocation().then((loc) => {
      console.log('CURRENT LOC : ', loc);
      const temp = loc && {
        gps_string: `${loc.latitude},${loc.longitude}`,
      };

      const task = {
        remarks: 'generated by staging',
        bill_no: searchResult[0].document_no,
        location: locationFromLogin,
        ...temp,
      };
      console.log('STAGING ! : ', searchResult);
      Services.uploadTask(task).then((res) => {
        console.log('UPLOADING STAGING RESULT ! : ', res);

        Alert.alert(
          '',
          !res
            ? fetchLanguage[lang].somethingwentwrong
            : 'Staging Success',
          [
            {
              text: 'OK',
              onPress: () => tryAgain(),
            },
          ],
          { cancelable: false }
        );
      });
    });
  };

  const checkBackHandler = () => {
    resetState();
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
    Platform.select({
      android: checkPermissionAndroid(),
    });
  }, [checkPermissionAndroid]);

  useEffect(() => {
    Services.retrieveData('ispdamode').then((res) => {
      console.log('is pda mode  : ', res);
      if (!res || res.status === 'failed') {
      } else {
        setIsPDAMode(res);
        inputRef?.current?.focus();
        // Keyboard.dismiss()
      }
    });
  }, []);
  const [locationFromLogin, setLocationFromLogin] = useState('');

  useEffect(() => {
    Services.retrieveData('user').then((res) => {
      console.log('user fields : ', res);
      if (!res || res.status === 'failed') {
      } else {
        setLocationFromLogin(res?.gps_login_location || 'None');

        setLang(res.language === 'ENG' ? 0 : 1);
      }
      setTimeout(() => {
        setLoadingScreen(false);
      }, 500);
    });
  }, []);

  useEffect(() => {
    if (pdaTextValue) {
      // console.log("INPUT REF : ", inputRef.current)
      if (stopScanning) {
        setErrorModal(false);
        setRecognizing(true);
        setStopScanning(false);
        setProcess(true);
        setSearchResult([]);
        // RNBeep.beep();
        if (fromHomeScreen) {
          setTimeout(() => {
            const value = pdaTextValue;
            navigation.pop();
            handleResponse(value, data);
          }, 1500);
        } else {
          const value = pdaTextValue;
          // const value = 'S022210113209';
          // const value = 'S022-20009748';
          // const value = 'S650210000460';
          // const value = 'A022210003840';
          // const value = 'R022210002504';

          Services.searchFunction(value).then((res) => {
            console.log('Search function result : ', res);
            if (!res || res === undefined) {
              setTimeout(() => {
                setErrorModal(true);
                setProcess(false);
              }, 1500);
            } else {
              setTimeout(() => {
                setSearchResult(res);
                setProcess(false);
              }, 1500);
            }
          });
        }
      }
    }
  }, [pdaTextValue]);

  if (isLoadingScreen) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator
          style={{ alignSelf: 'center' }}
          size="large"
          color={Colors.primary}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      {isPDAMode ? (
        <>
          {/* QR CODE */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => resetState()}
              style={styles.backButton}
            >
              <Icon
                name="chevron-back-outline"
                color={Colors.primary}
                size={30}
              />
              <Text style={styles.backToHomeButton}>
                {fetchLanguage[lang].back}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: '#D3D3D3',
              padding: 2,
              borderRadius: 15,
              alignSelf: 'center',
              width: '80%',
              top: 20,
              height: 50,
              marginBottom: 30,
            }}
          >
            <TextInput
              autoFocus
              style={{ flexWrap: 'wrap', width: '100%', left: 10 }}
              ref={inputRef}
              editable={pdaTextValue === ''}
              placeholder={placeholder ? placeholder : 'Bill No.'}
              value={pdaTextValue}
              onChangeText={(val) => setPdaTextValue(val)}
              numberOfLines={3}
              multiline={true}
            />
          </View>
          {searchResult[0]?.bill_no && (
            <View
              style={{
                borderWidth: 1,
                marginTop: 40,
                width: wp('90%'),
                alignSelf: 'center',
                borderRadius: 10,
              }}
            >
              <View style={styles.labelWrapper}>
                <Text style={styles.labelText}>Bill No. </Text>
                <Text style={{ color: '#fff' }}>
                  {searchResult[0]?.bill_no || 'None'}
                </Text>
              </View>
              <View style={styles.labelWrapper}>
                <Text style={styles.labelText}>Order No. </Text>
                <Text style={{ color: '#fff' }}>
                  {searchResult[0]?.order_no || 'None'}
                </Text>
              </View>

              <View
                style={{
                  alignSelf: 'center',
                  justifyContent: 'center',
                  marginTop: hp('10%'),
                }}
              >
                <Text
                  style={{
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    textAlign: 'center',
                    padding: 5,
                    color: '#ffff',
                  }}
                >
                  {searchResult[0]?.truck_no &&
                    `${searchResult[0]?.truck_no}`.toUpperCase()}
                </Text>

                {searchResult[0]?.bill_no && (
                  <TouchableOpacity
                    style={{
                      alignSelf: 'center',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 5,
                      backgroundColor: Colors.primary,
                      padding: 20,
                      width: 120,
                    }}
                    onPress={() => tryAgain()}
                  >
                    <Text
                      style={{
                        color: '#fff',
                        fontSize: RFValue(12),
                        textAlign: 'center',
                      }}
                    >
                      {fetchLanguage[lang].scananother}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <View
                style={{
                  justifyContent: 'space-between',
                  paddingHorizontal: wp('5%'),
                  marginTop: hp('5%'),
                }}
              >
                <View style={styles.labelWrapper}>
                  <Text style={styles.labelText}>Service Date </Text>
                  <Text style={{ color: '#fff' }}>
                    {searchResult[0]?.service_date || 'None'}
                  </Text>
                </View>

                <View style={styles.labelWrapper}>
                  <Text style={styles.labelText}>Doc No. </Text>
                  <Text style={{ color: '#fff' }}>
                    {searchResult[0]?.document_no || 'None'}
                  </Text>
                </View>
                <View style={styles.labelWrapper}>
                  <Text style={styles.labelText}>Total Qty. </Text>
                  <Text style={{ color: '#fff' }}>
                    {searchResult[0]?.qty_total || 'None'}
                  </Text>
                </View>
                <View style={styles.labelWrapper}>
                  <Text style={styles.labelText}>Total Volume </Text>
                  <Text style={{ color: '#fff' }}>
                    {searchResult[0]?.cbm_total || 'None'}
                  </Text>
                </View>
                <View style={styles.labelWrapper}>
                  <Text style={styles.labelText}>Total Weight </Text>
                  <Text style={{ color: '#fff' }}>
                    {searchResult[0]?.kg_total || 'None'}
                  </Text>
                </View>
                <View style={styles.labelWrapper}>
                  <Text style={styles.labelText}>Status </Text>
                  <Text style={{ color: '#fff' }}>
                    {searchResult[0]?.status || 'None'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {process && recognizing ? (
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                zIndex: 10000,
                bottom: hp('2%'),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ActivityIndicator
                color={Colors.primary}
                size="large"
              />
            </View>
          ) : null}

          {errorModal && (
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                zIndex: 100,
                alignItems: 'center',
                justifyContent: 'center',
                bottom: hp('10%'),
              }}
            >
              <Text
                style={{
                  color: Colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingBottom: 20,
                }}
              >
                {fetchLanguage[lang].noordersfound}
              </Text>
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 5,
                  backgroundColor: Colors.primary,
                  padding: 10,
                  width: 100,
                }}
                onPress={() => tryAgain()}
              >
                <Text
                  style={{ color: '#ffff', fontSize: RFValue(14) }}
                >
                  {fetchLanguage[lang].tryagain}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {staging && searchResult[0] && (
            <View
              style={{
                position: 'absolute',
                right: 0,
                left: 0,
                bottom: 100,
              }}
            >
              <TouchableOpacity
                disabled={loadingStage}
                onPress={onPressStage}
                style={[
                  {
                    backgroundColor: loadingStage
                      ? 'gray'
                      : Colors.primary,
                    padding: wp('4%'),
                    alignSelf: 'center',
                    elevation: 5,
                    width: wp('40%'),
                    borderRadius: 40,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: RFValue(14),
                    fontWeight: 'bold',
                    color: Colors.white,
                    textAlign: 'center',
                  }}
                >
                  {fetchLanguage[lang].stage}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      ) : (
        <></>
        // CAMERA
        // <RNCamera
        //   onBarCodeRead={onBarCodeRead}
        //   ref={cameraref}
        //   captureAudio={false}
        //   style={styles.cameraContainer}>
        //   <View style={styles.headerContainer}>
        //     <TouchableOpacity
        //       onPress={() => resetState()}
        //       style={styles.backButton}>
        //       <Icon
        //         name="chevron-back-outline"
        //         color={Colors.primary}
        //         size={30}
        //       />
        //       <Text style={styles.backToHomeButton}>
        //         {fetchLanguage[lang].back}
        //       </Text>
        //     </TouchableOpacity>
        //   </View>

        //   {searchResult[0]?.bill_no ? (
        //     <View
        //       style={{
        //         borderWidth: 1,
        //         marginTop: 40,
        //         width: wp('90%'),
        //         alignSelf: 'center',
        //         borderRadius: 10,
        //       }}>
        //       <View style={styles.labelWrapper}>
        //         <Text style={styles.labelText}>Bill No. </Text>
        //         <Text style={{color: '#fff'}}>
        //           {searchResult[0]?.bill_no || 'None'}
        //         </Text>
        //       </View>
        //       <View style={styles.labelWrapper}>
        //         <Text style={styles.labelText}>Order No. </Text>
        //         <Text style={{color: '#fff'}}>
        //           {searchResult[0]?.order_no || 'None'}
        //         </Text>
        //       </View>

        //       <View
        //         style={{
        //           alignSelf: 'center',
        //           justifyContent: 'center',
        //           marginTop: hp('10%'),
        //         }}>
        //         <Text
        //           style={{
        //             fontSize: RFValue(18),
        //             fontWeight: 'bold',
        //             textAlign: 'center',
        //             padding: 5,
        //             color: '#ffff',
        //           }}>
        //           {searchResult[0]?.truck_no
        //             ? `${searchResult[0]?.truck_no}`.toUpperCase()
        //             : 'No Truck No.'}
        //         </Text>

        //         {searchResult[0]?.bill_no && (
        //           <TouchableOpacity
        //             style={{
        //               alignSelf: 'center',
        //               alignItems: 'center',
        //               justifyContent: 'center',
        //               borderRadius: 5,
        //               backgroundColor: Colors.primary,
        //               padding: 20,
        //               width: 120,
        //             }}
        //             onPress={() => tryAgain()}>
        //             <Text
        //               style={{
        //                 color: '#fff',
        //                 fontSize: RFValue(12),
        //                 textAlign: 'center',
        //               }}>
        //               {fetchLanguage[lang].scananother}
        //             </Text>
        //           </TouchableOpacity>
        //         )}
        //       </View>
        //       <View
        //         style={{
        //           justifyContent: 'space-between',
        //           paddingHorizontal: wp('5%'),
        //           marginTop: hp('5%'),
        //         }}>
        //         <View style={styles.labelWrapper}>
        //           <Text style={styles.labelText}>Service Date </Text>
        //           <Text style={{color: '#fff'}}>
        //             {searchResult[0]?.service_date || 'None'}
        //           </Text>
        //         </View>

        //         <View style={styles.labelWrapper}>
        //           <Text style={styles.labelText}>Doc No. </Text>
        //           <Text style={{color: '#fff'}}>
        //             {searchResult[0]?.document_no || 'None'}
        //           </Text>
        //         </View>
        //         <View style={styles.labelWrapper}>
        //           <Text style={styles.labelText}>Total Qty. </Text>
        //           <Text style={{color: '#fff'}}>
        //             {searchResult[0]?.qty_total || 'None'}
        //           </Text>
        //         </View>
        //         <View style={styles.labelWrapper}>
        //           <Text style={styles.labelText}>Total Volume </Text>
        //           <Text style={{color: '#fff'}}>
        //             {searchResult[0]?.cbm_total || 'None'}
        //           </Text>
        //         </View>
        //         <View style={styles.labelWrapper}>
        //           <Text style={styles.labelText}>Total Weight </Text>
        //           <Text style={{color: '#fff'}}>
        //             {searchResult[0]?.kg_total || 'None'}
        //           </Text>
        //         </View>
        //         <View style={styles.labelWrapper}>
        //           <Text style={styles.labelText}>Status </Text>
        //           <Text style={{color: '#fff'}}>
        //             {searchResult[0]?.status || 'None'}
        //           </Text>
        //         </View>
        //       </View>
        //     </View>
        //   ) : (
        //     <>
        //       <View style={styles.barCodeBorder}>
        //         <Text
        //           style={{
        //             alignSelf: 'center',
        //             fontSize: RFValue(14),
        //             color: '#fff',
        //           }}>
        //           Align Barcode to scan
        //         </Text>
        //         <Icon
        //           style={{alignSelf: 'center', fontSize: RFValue(300)}}
        //           name="scan"
        //           color={recognizing ? Colors.primary : '#fff'}
        //         />
        //       </View>
        //       {/* <BarcodeMask
        //       edgeWidth={30}
        //       edgeHeight={30}
        //       edgeBorderWidth={2}
        //       style={{magrin: -2}}
        //       width={250}
        //       height={250}
        //       edgeRadius={10}
        //       lineAnimationDuration={1500}
        //       outerMaskOpacity={0.4}
        //     /> */}
        //     </>
        //   )}

        //   {process && recognizing ? (
        //     <View
        //       style={{
        //         position: 'absolute',
        //         left: 0,
        //         right: 0,
        //         top: 0,
        //         zIndex: 10000,
        //         bottom: hp('2%'),
        //         alignItems: 'center',
        //         justifyContent: 'center',
        //       }}>
        //       <ActivityIndicator color={Colors.primary} size="large" />
        //     </View>
        //   ) : null}

        //   {errorModal && (
        //     <View
        //       style={{
        //         position: 'absolute',
        //         left: 10,
        //         right: 0,
        //         top: 0,
        //         zIndex: 100,
        //         alignItems: 'center',
        //         justifyContent: 'center',
        //         bottom: hp('5%'),
        //       }}>
        //       <Text
        //         style={{
        //           color: Colors.primary,
        //           textAlign: 'center',
        //           paddingBottom: 20,
        //         }}>
        //         {fetchLanguage[lang].noordersfound}
        //       </Text>
        //       <TouchableOpacity
        //         style={{
        //           alignItems: 'center',
        //           justifyContent: 'center',
        //           borderRadius: 5,
        //           backgroundColor: Colors.primary,
        //           padding: 10,
        //           width: 100,
        //         }}
        //         onPress={() => tryAgain()}>
        //         <Text style={{color: '#ffff', fontSize: RFValue(14)}}>
        //           {fetchLanguage[lang].tryagain}
        //         </Text>
        //       </TouchableOpacity>
        //     </View>
        //   )}
        //   {staging && searchResult[0] && (
        //     <View
        //       style={{position: 'absolute', right: 0, left: 0, bottom: 100}}>
        //       <TouchableOpacity
        //         disabled={loadingStage}
        //         onPress={onPressStage}
        //         style={[
        //           {
        //             backgroundColor: loadingStage ? 'gray' : Colors.primary,
        //             padding: wp('4%'),
        //             alignSelf: 'center',
        //             elevation: 5,
        //             width: wp('40%'),
        //             borderRadius: 40,
        //           },
        //         ]}>
        //         <Text
        //           style={{
        //             fontSize: RFValue(14),
        //             fontWeight: 'bold',
        //             color: '#fff',
        //             textAlign: 'center',
        //           }}>
        //           {fetchLanguage[lang].stage}
        //         </Text>
        //       </TouchableOpacity>
        //     </View>
        //   )}
        // </RNCamera>
      )}
      <BottomModal
        visible={bottomVisible}
        onTouchOutside={closeModal}
        onSwipeOut={closeModal}
      >
        <ModalContent>
          <>
            <View
              style={{
                alignContent: 'center',
                marginTop: 30,
                marginBottom: 100,
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
                onPress={() => closeModal()}
              >
                <Text style={{ textAlign: 'center' }}>
                  {fetchLanguage[lang].tryagain}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        </ModalContent>
      </BottomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    borderRadius: 30,
    alignItems: 'center',
    padding: 5,
    paddingEnd: 10,

    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  backToHomeButton: {
    color: Colors.primary,
    alignSelf: 'center',
    fontSize: RFValue(12),
    fontWeight: 'bold',
  },
  barCodeBorder: {
    position: 'absolute',
    top: Dimensions.get('window').height / 4,
    justifyContent: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
    width: '100%',
    // borderColor: '#000',
    // borderRadius: 30,
    // borderWidth: 2,
    // height: Dimensions.get('window').height / 2,
  },
  bottomWrapper: {
    backgroundColor: '#99000000',
    position: 'absolute',
    // bottom: 80,
    paddingBottom: 120,
    bottom: 0,
    left: 0,
    right: 0,
  },
  cameraContainer: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
  },
  headerContainer: {
    marginTop: Platform.OS === 'android' ? 10 : 40,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 99999,
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: RFValue(12),
  },
  labelWrapper: {
    opacity: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 20,
    paddingHorizontal: 5,
  },
  paddingStart: {
    paddingStart: 10,
  },

  container: {
    ...StyleSheet.absoluteFillObject,
    position: 'absolute',
  },
});
export default CameraScreen;
