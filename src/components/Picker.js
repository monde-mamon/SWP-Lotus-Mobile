import React, {useState} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Colors} from '../themes/colors';
import {Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Picker = ({
  placeholder,
  title,
  value,
  onPress,
  disabled,
  error,
  receiving,
  setValue,
  type,
}) => {
  const [fnType, setFNType] = useState(true);

  // const [fnVal, setFNVal] = useState(value);
  return (
    <View
      style={{
        paddingVertical: hp('1%'),
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <Text
        style={{
          color: error ? 'red' : Colors.black,
          textAlignVertical: 'center',
          paddingEnd: receiving ? 10 : 0,
          // width: '35%',
        }}>
        {title}
      </Text>
      <TouchableOpacity
        disabled={disabled}
        style={{
          alignSelf: 'center',
          justifyContent: 'center',
          width: wp('10%'),
        }}
        onPress={() => setFNType(prev => !prev)}>
        {/* {fnType ? (
          <>
            <Ionicons name={'scan-outline'} size={wp('10%')} color={'#000'} />

            <Image
              source={require('../assets/textIcon.jpeg')}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
                position: 'absolute',
                alignSelf: 'center',
                justifyContent: 'center',
              }}
            />
          </>
        ) : (
          <Image
            source={require('../assets/scanIcon.jpeg')}
            resizeMode="contain"
            style={{width: 30, height: 30}}
          />
        )} */}
        {/* <Text
          style={{
            position: 'absolute',
            alignSelf: 'center',
            justifyContent: 'center',
            top: 10,
            fontSize: 22,
          }}>
          {fnType ? 'T' : 'S'}
        </Text> */}
      </TouchableOpacity>
      {fnType ? (
        <TouchableOpacity
          disabled={disabled}
          style={{
            marginTop: hp('1%'),
            borderRadius: 5,
            borderWidth: 0.5,
            borderColor: error ? 'red' : 'gray',
            marginHorizontal: wp('3%'),
            flex: 1,
            padding: wp(5),
            backgroundColor: disabled ? '#D3D3D3' : '#fff',
          }}
          onPress={onPress}>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <Text>{value || placeholder}</Text>
            {title === 'FN #' ? (
              <Ionicons name={'scan-outline'} size={wp('5%')} color={'#000'} />
            ) : title === 'Storage Location' ? (
              <Ionicons name={'scan-outline'} size={wp('5%')} color={'#000'} />
            ) : title === 'Truck Number' ? (
              <Ionicons name={'scan-outline'} size={wp('5%')} color={'#000'} />
            ) : (
              <Ionicons
                name={'chevron-down-outline'}
                size={wp('6%')}
                color={'#000'}
              />
            )}
          </View>
        </TouchableOpacity>
      ) : (
        <View
          disabled={disabled}
          style={{
            marginTop: hp('1%'),
            borderRadius: 5,
            borderWidth: 0.5,
            borderColor: error ? 'red' : 'gray',
            marginHorizontal: wp('3%'),
            flex: 1,
            padding: wp(1),
            backgroundColor: disabled ? '#D3D3D3' : '#fff',
          }}>
          <View
            style={{
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TextInput
              keyboardType="name-phone-pad"
              editable={!disabled}
              placeholder="Type here.."
              style={{flexWrap: 'wrap'}}
              multiline={false}
              value={value}
              onChangeText={val => {
                setValue(val, type);
              }}
              autoCapitalize="characters"
            />
          </View>
        </View>
      )}
    </View>
  );
};
export default Picker;
