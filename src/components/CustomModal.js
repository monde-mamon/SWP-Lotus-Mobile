import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Modal,
  ModalContent,
  ScaleAnimation,
} from 'react-native-modals';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../themes/colors';

const CustomModal = ({ visible, loading, text, onTouchOutside }) => {
  return (
    <>
      <Modal
        visible={visible}
        onTouchOutside={!loading ? onTouchOutside : () => {}}
        modalAnimation={
          new ScaleAnimation({
            initialValue: 0, // optional
            useNativeDriver: true, // optional
          })
        }
      >
        <ModalContent
          style={{
            width: Dimensions.get('screen').width - 200,
            paddingVertical: 20,
            paddingHorizontal: 10,
          }}
        >
          {loading ? (
            <ActivityIndicator color={Colors.primary} size="large" />
          ) : (
            <View>
              <TouchableNativeFeedback
                style={{ paddingHorizontal: 10 }}
                onPress={!loading ? onTouchOutside : () => {}}
              >
                <>
                  <TouchableOpacity
                    style={{ padding: 12 }}
                    onPress={onTouchOutside}
                  >
                    <Ionicon
                      name={'close-circle-outline'}
                      size={22}
                      color={Colors.primary}
                      style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        top: -4,
                      }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontWeight: '300',
                      textAlign: 'center',
                      flexWrap: 'wrap',
                    }}
                  >
                    {text}
                  </Text>
                </>
              </TouchableNativeFeedback>
            </View>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default CustomModal;
