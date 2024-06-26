import React from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageCard from './ImageCard';

const ImageSection = ({
  disabled,
  value,
  onPress,
  onDeletePicture,
}) => {
  return (
    <View style={{ paddingVertical: hp('1%') }}>
      <ScrollView
        horizontal={true}
        style={{ paddingBottom: hp('2%') }}
      >
        <TouchableOpacity
          disabled={disabled}
          style={{
            marginTop: hp('1%'),
            borderRadius: 5,
            borderWidth: 0.5,
            borderColor: 'gray',
            height: hp('14%'),
            width: hp('11%'),
            backgroundColor: disabled ? '#D3D3D3' : '#fff',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={onPress}
        >
          <Ionicons
            name={'add-outline'}
            size={wp('10%')}
            color={'gray'}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {value.map((l, i) => {
            return (
              <ImageCard
                index={i}
                item={l}
                rightIcon
                onPress={() => onDeletePicture(l)}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};
export default ImageSection;
