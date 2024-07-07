import { isNull } from 'lodash';
import React, { FC } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image as RNImage,
} from 'react-native';
import { Image } from 'react-native-image-crop-picker';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/src/themes/colors';

interface PictureButtonProps {
  title: string;
  error: string;
  item: Image | null;
  rightIcon?: JSX.Element;
  onPress: () => void;
  onClear?: () => void;
  disabled?: boolean;
}
export const PictureButton: FC<PictureButtonProps> = ({
  title,
  onPress,
  onClear,
  disabled,
  error,
  item,
}) => (
  <View style={styles.container}>
    <Text>{title}</Text>
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.buttonContainer,
        {
          backgroundColor: disabled ? Colors.dimGray : Colors.white,
          borderColor: error ? 'red' : 'gray',
        },
      ]}
      onPress={onPress}
    >
      {isNull(item) ? (
        <View style={styles.contentContainer}>
          <Ionicon
            name={'image-outline'}
            size={30}
            color={Colors.primary}
          />
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.closeContainer}
            onPress={onClear}
          >
            <Ionicon
              name={'close-circle-outline'}
              size={wp('8%')}
              color={Colors.primary}
            />
          </TouchableOpacity>

          <RNImage
            style={styles.imageContainer}
            source={{
              uri: `data:${item.mime};base64,${item.data}`,
            }}
          />
        </>
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: hp('1%'),
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: hp('1%'),
    borderRadius: 5,
    borderWidth: 0.5,
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    padding: wp(5),
  },
  textContainer: {
    color: 'gray',
  },
  imageContainer: {
    height: hp('30%'),
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
    zIndex: 50,
  },
  closeContainer: {
    top: 10,
    right: 10,
    position: 'absolute',
    zIndex: 100,
  },
});
