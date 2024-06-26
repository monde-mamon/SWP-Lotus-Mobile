import React, { FC } from 'react';
import { Text, View } from 'react-native';
import { StyleProps } from 'react-native-reanimated';
import { Colors } from '../themes/colors';
interface CardProps extends StyleProps {
  title: string;
  children: JSX.Element | any;
}
export const Card: FC<CardProps> = ({ title, children, style }) => (
  <View
    style={{
      marginVertical: 15,
    }}
  >
    <View
      style={[
        {
          width: '98%',
          backgroundColor: Colors.white,
          borderColor: '#D3D3D3',
          borderRadius: 4,
          paddingBottom: 10,
          borderWidth: 0.3,
          marginHorizontal: 2,
          elevation: 3,
          alignSelf: 'center',
          // paddingHorizontal: 10,
        },
        style,
      ]}
    >
      <Text
        style={{
          flexWrap: 'nowrap',
          alignSelf: 'center',
          color: Colors.black,
          top: -13,
          fontWeight: 'bold',
          fontSize: 20,
          fontFamily: 'SharpSansNo1-Book',
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  </View>
);
