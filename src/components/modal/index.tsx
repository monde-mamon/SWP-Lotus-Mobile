import { isEmpty } from 'lodash';
import { FC } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  StyleProp,
  View,
  ViewStyle,
  ScrollView,
} from 'react-native';
import {
  BottomModal as RNBottomModal,
  ModalContent,
} from 'react-native-modals';
import {
  DeliveryCondition,
  DeliveryStatus,
  Driver,
  Hub,
  Store,
} from '@/src/schema';
import { Colors } from '@/src/themes/colors';

interface BottomModalProps {
  onTouchOutside: () => void;
  title: string;
  loading: boolean;
  visible: boolean;
  error: boolean;
  content:
    | Hub[]
    | Store[]
    | Driver[]
    | DeliveryStatus[]
    | DeliveryCondition[];
  refetch: () => void;
  onSelect: (
    val: Hub | Store | Driver | DeliveryStatus | DeliveryCondition
  ) => void;
  isEnglish?: boolean;
}
export const BottomModal: FC<BottomModalProps> = ({
  onTouchOutside,
  title,
  visible,
  loading,
  error,
  content,
  refetch,
  onSelect,
  isEnglish,
}) => (
  <RNBottomModal
    visible={visible}
    onTouchOutside={onTouchOutside}
    onSwipeOut={onTouchOutside}
    modalTitle={
      <View style={styles.titleContainer}>
        <View style={styles.titleDivider}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      </View>
    }
  >
    <ModalContent>
      <>
        <View style={styles.contentContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" />
            </View>
          ) : error ? (
            <>
              <View style={styles.errorContainer}>
                <Pressable
                  style={styles.tryAgainContainer}
                  onPress={(): void => refetch()}
                >
                  <Text style={styles.tryAgainText}>Try Again</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <ScrollView>
              {!isEmpty(content) &&
                content &&
                content?.map((data, idx) => (
                  <Pressable
                    key={idx}
                    onPress={(): void => {
                      onSelect(data);
                      onTouchOutside();
                    }}
                    style={({ pressed }): StyleProp<ViewStyle> => [
                      styles.buttonContainer,
                      {
                        backgroundColor: pressed
                          ? '#D9D9D9'
                          : 'white',
                      },
                    ]}
                  >
                    <Text>
                      {isEnglish
                        ? (data as Hub)?.hub_description ??
                          (data as Driver)?.driver_name ??
                          (data as Store)?.store_name ??
                          (data as DeliveryStatus)?.status_eng ??
                          (data as DeliveryCondition)
                            ?.condition_description
                        : (data as Hub)?.hub_description ??
                          (data as Driver)?.driver_name ??
                          (data as Store)?.store_name ??
                          (data as DeliveryStatus)?.status_thai ??
                          (data as DeliveryCondition)
                            ?.condition_description_thai}
                    </Text>
                  </Pressable>
                ))}
            </ScrollView>
          )}
        </View>
      </>
    </ModalContent>
  </RNBottomModal>
);

const styles = StyleSheet.create({
  buttonContainer: { padding: 20, borderRadius: 10 },
  titleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '100%',
  },
  titleDivider: {
    borderBottomWidth: 1,
    borderColor: '#70707029',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 15,
  },
  contentContainer: {
    alignContent: 'center',
  },
  loadingContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
  errorContainer: {
    marginTop: 30,
    marginBottom: 30,
  },
  tryAgainContainer: {
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: Colors.primary,
    width: 100,
    alignContent: 'center',
    alignSelf: 'center',
  },
  tryAgainText: {
    textAlign: 'center',
  },
});
