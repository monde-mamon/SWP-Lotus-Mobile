import React, { FC, ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RowProps {
  left: string | number;
  right?: string | number;
  images?: JSX.Element | ReactNode;
}
const Row: FC<RowProps> = ({ left, right, images }) => {
  return (
    <View style={styles.rowContainer}>
      <Text style={styles.left}>{left}</Text>
      {images || <Text style={styles.right}>{right || 'None'}</Text>}
    </View>
  );
};

export default Row;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    paddingVertical: 15,
  },
  left: {
    width: '30%',
    fontWeight: 'bold',
  },
  right: {
    textAlign: 'left',
  },
});
