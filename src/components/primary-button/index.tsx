import { FC } from 'react';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Colors } from '@/src/themes/colors';

interface PrimaryButtonProps {
  onSubmit?: () => void;
  title: string;
}
export const PrimaryButton: FC<PrimaryButtonProps> = ({
  onSubmit,
  title,
}) => (
  <View style={styles.container}>
    <Pressable
      style={({ pressed }) => [
        {
          padding: pressed ? wp('3%') : wp('3.5%'),
          width: pressed ? wp('33%') : wp('34%'),
        },
        styles.button,
      ]}
      onPress={onSubmit}
    >
      <Text style={styles.submit}>{title}</Text>
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    alignSelf: 'center',
    elevation: 5,
    borderRadius: 40,
  },
  submit: {
    fontSize: 20,
    color: Colors.white,
    textAlign: 'center',
  },
});
