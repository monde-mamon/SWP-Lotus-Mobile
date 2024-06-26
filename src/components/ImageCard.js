import {Image, ScrollView} from 'react-native';
import {Text, TouchableOpacity, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  listenOrientationChange as loc,
  removeOrientationListener as rol,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Colors} from '../themes/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React from 'react';
const ImageCard = ({item, index, onPress, imageGenerated, rightIcon}) => {
  return (
    <TouchableOpacity
      key={index.toString()}
      style={{
        marginTop: hp('1%'),
        marginLeft: wp('2%'),
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: 'gray',
        height: hp('14%'),
        width: hp('11%'),
      }}>
      {rightIcon && (
        <TouchableOpacity
          style={{
            top: 0,
            right: 0,
            position: 'absolute',
            zIndex: 100,
          }}
          onPress={onPress}>
          <Ionicons
            name={'close-circle-outline'}
            size={wp('6%')}
            color={Colors.primary}
          />
        </TouchableOpacity>
      )}

      <Image
        style={{
          height: hp('13.9%'),
          width: hp('10.9%'),
          resizeMode: 'cover',
          borderRadius: 5,
        }}
        source={{
          uri: imageGenerated
            ? item.image
            : `data:${item.mime};base64,${item.data}`,
        }}
      />
    </TouchableOpacity>
  );
};

export default ImageCard;
