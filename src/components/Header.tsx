import React, { FC } from 'react';
import { Keyboard, Text, TouchableOpacity, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../themes/colors';

interface HeaderProps {
  title: string;
  navigation: any;
  isCustom?: boolean;
  isReset?: boolean;
  onReset?: () => void;
}
export const Header: FC<HeaderProps> = ({
  title,
  navigation,
  isCustom = false,
  isReset = false,
  onReset,
}) => {
  const onToggle = (): void => {
    Keyboard.dismiss();
    navigation.toggleDrawer();
  };
  return (
    <View
      style={{
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}
    >
      <View style={{ alignSelf: 'flex-start', flexDirection: 'row' }}>
        <Text
          style={{
            color: Colors.primary,
            fontSize: RFValue(18),
            fontWeight: 'bold',
            top: 5,
          }}
        >
          {title}
        </Text>

        {!isCustom && (
          <Text
            style={{
              color: Colors.black,
              fontSize: RFValue(18),
              top: 5,
              fontWeight: 'bold',
              fontFamily: 'SharpSansNo1-Bold',
            }}
          >
            {` Tracker`}
          </Text>
        )}
      </View>

      <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
        {isReset && (
          <TouchableOpacity onPress={onReset}>
            <Ionicons
              name={'refresh-outline'}
              size={35}
              color={Colors.primary}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{ alignSelf: 'flex-end' }}
          onPress={onToggle}
        >
          <Ionicons
            name={'menu-outline'}
            size={40}
            color={Colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
