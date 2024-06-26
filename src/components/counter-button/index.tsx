import React, { FC } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/src/themes/colors';

interface CounterButtonProps {
  title: string;
  placeholder: string;
  error: string;
  value: string | number;
  rightIcon?: JSX.Element;
  disabled?: boolean;
  onChange: (opr: 'add' | 'minus' | 'manual', val?: string) => void;
}
export const CounterButton: FC<CounterButtonProps> = ({
  title,
  placeholder,
  disabled,
  error,
  value,
  onChange,
}) => (
  <View style={styles.container}>
    <Text style={styles.titleContainer}>{title}</Text>
    <Pressable
      style={[
        styles.buttonContainer,
        {
          borderColor: error ? 'red' : 'gray',
        },
      ]}
    >
      <View style={styles.contentContainer}>
        <TextInput
          style={styles.textInputContainer}
          textAlignVertical="center"
          keyboardType="numeric"
          onChangeText={(text): void => onChange('manual', text)}
          value={String(value) || placeholder}
        />
      </View>
      <View style={styles.operatorContainer}>
        <TouchableOpacity
          disabled={disabled}
          style={[
            styles.iconContainer,
            {
              backgroundColor: disabled ? Colors.dimGray : '#ECECEC',
            },
          ]}
          onPress={(): void => onChange('minus')}
        >
          <Ionicon
            name="remove-outline"
            size={40}
            color={Colors.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={(): void => onChange('add')}
        >
          <Ionicon
            name="add-outline"
            size={40}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>
    </Pressable>
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
    justifyContent: 'space-between',
    marginTop: hp('1%'),
    borderRadius: 5,
    borderWidth: 0.5,
    padding: wp('2'),
    paddingLeft: wp(7),
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textContainer: {
    color: 'black',
    fontSize: 18,
  },
  titleContainer: {
    color: 'gray',
  },
  iconContainer: {
    backgroundColor: '#ECECEC',
    paddingHorizontal: wp(1),
    borderRadius: 5,
    marginLeft: 20,
  },
  operatorContainer: {
    flexDirection: 'row',
    margin: 10,
  },
  textInputContainer: {
    height: 50,
    fontSize: 20,
    width: '100%',
  },
});
