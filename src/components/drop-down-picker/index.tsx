import React, { FC } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

interface DropDownPickerProps {
  title: string;
  placeholder: string;
  error?: string;
  value: string | number;
  rightIcon?: JSX.Element;
  onPress: () => void;
  disabled?: boolean;
}
export const DropDownPicker: FC<DropDownPickerProps> = ({
  title,
  placeholder,
  onPress,
  disabled,
  error,
  value,
  rightIcon,
}) => (
  <View style={styles.container}>
    <Text>{title}</Text>
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.buttonContainer,
        {
          backgroundColor: disabled ? '#D3D3D3' : '#fff',
          borderColor: error ? 'red' : 'gray',
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.contentContainer}>
        {value ? (
          <Text>{value}</Text>
        ) : (
          <Text style={styles.textContainer}>{placeholder}</Text>
        )}
        {rightIcon}
      </View>
    </TouchableOpacity>
    {error && <Text style={styles.error}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  error: {
    color: 'red',
  },
  container: {
    flex: 1,
    paddingVertical: hp('1%'),
    justifyContent: 'space-between',
  },
  buttonContainer: {
    marginTop: hp('1%'),
    borderRadius: 5,
    borderWidth: 0.5,
    flex: 1,
    padding: wp(5),
  },
  contentContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textContainer: {
    color: 'gray',
  },
});
