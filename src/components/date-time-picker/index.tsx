import { format } from 'date-fns';
import React, { FC, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Colors } from '@/src/themes/colors';
interface DateTimePickerProps {
  title: string;
  placeholder: string;
  error?: string;
  value: string | number;
  rightIcon?: JSX.Element;
  onSelect: (value: string) => void;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
}
export const DateTimePicker: FC<DateTimePickerProps> = ({
  title,
  placeholder,
  onSelect,
  disabled,
  error,
  value,
  minDate,
  maxDate,
}) => {
  const [date, setDate] = useState(
    value ? new Date(value) : new Date()
  );
  const [open, setOpen] = useState(false);

  const handleOnConfirm = (newDate: Date): void => {
    setOpen(false);
    setDate(newDate);
    onSelect(newDate.toUTCString());
  };

  const handleOnCancel = (): void => setOpen(false);

  const handleOnShow = (): void => setOpen(true);

  return (
    <>
      <View style={styles.container}>
        <Text>{title}</Text>
        <TouchableOpacity
          disabled={disabled}
          style={[
            styles.buttonContainer,
            {
              backgroundColor: disabled
                ? Colors.dimGray
                : Colors.white,
              borderColor: error ? 'red' : 'gray',
            },
          ]}
          onPress={handleOnShow}
        >
          <View style={styles.contentContainer}>
            {date ? (
              <Text>{`${date && format(date, 'PPpp')}`}</Text>
            ) : (
              <Text style={styles.textContainer}>{placeholder}</Text>
            )}
          </View>
          <Ionicon
            name={'calendar-outline'}
            size={30}
            color={Colors.primary}
          />
        </TouchableOpacity>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
      <DatePicker
        modal
        open={open}
        date={date}
        minimumDate={minDate}
        maximumDate={maxDate}
        onConfirm={handleOnConfirm}
        onCancel={handleOnCancel}
      />
    </>
  );
};

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1%'),
    borderRadius: 5,
    borderWidth: 0.5,
    flex: 1,
    padding: wp(5),
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textContainer: {
    color: 'gray',
  },
});
