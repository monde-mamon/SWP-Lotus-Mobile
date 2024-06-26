import React from 'react';

import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Ionicon from 'react-native-vector-icons/Ionicons';
// import {Colors, Fonts} from '../../themes';

const CustomTextInput = ({
  placeholder,
  value,
  error,
  onChangeText,
  type,
  widthType,
  heightType,
  hasRightIcon,
  showRightIcon,
  onPressRightIcon,
  maxLength,
}) => {
  return (
    <View
      style={styles.mobileInputStyle(
        error,
        widthType,
        heightType,
        hasRightIcon,
      )}>
      <TextInput
        style={styles.textInput(error)}
        placeholder={placeholder + ''}
        placeholderTextColor={'gray'}
        maxLength={maxLength || 25}
        value={value}
        secureTextEntry={showRightIcon}
        blurOnSubmit={true}
        keyboardType={type ? 'default' : 'number-pad'}
        onChangeText={onChangeText}
      />
      {hasRightIcon && onPressRightIcon && (
        <TouchableOpacity
          onPress={onPressRightIcon}
          style={{position: 'absolute', right: 15, top: 15}}>
          {!showRightIcon ? (
            <Ionicon name={'eye-outline'} size={20} color={'#000'} />
          ) : (
            <Ionicon name={'eye-off-outline'} size={20} color={'#000'} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mobileInputStyle: (error, widthType, heightType, hasRightIcon) => ({
    borderWidth: 1,
    width: widthType ? wp('82%') : wp('90%'),
    borderColor: error ? 'red' : '#E0E0E0',
    marginVertical: hp('1%'),
    height: heightType ? 90 : 45,
    borderRadius: wp('1%'),
    flexDirection: 'row',
    backgroundColor: 'transparent',
  }),

  textInput: (error) => ({
    // ...Fonts.style.description,
    color: '#000',
    paddingLeft: wp('3%'),
    height: '100%',
    width: '100%',
  }),
});

export default CustomTextInput;
