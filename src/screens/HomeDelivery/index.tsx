import { useAtom } from 'jotai';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  ListRenderItem,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  PressableStateCallbackType,
} from 'react-native';
import { BottomModal, ModalContent } from 'react-native-modals';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import CustomModal from '../../components/CustomModal';
import { Header } from '../../components/Header';
import Row from '../../components/Row';
import * as Services from '../../services';
import { Colors } from '../../themes/colors';
import fetchLanguage from '../../utils/language';
import { authAtom } from '@/src/atom';
import { useBackHandler } from '@/src/hooks/use-back-handler';
import { HomeDeliveryScreenProps } from '@/src/navigation/types';
import {
  DeliveryHistory,
  deliveryHistoryAtom,
} from '@/src/queries/deliveryHistory';

const HomeDeliveryScreen = ({
  navigation,
}: HomeDeliveryScreenProps): JSX.Element => {
  const [logoutLoading, setLogoutLoading] = useState(true);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [historyModal, setHistoryModal] = useState(false);
  const [lang, setLang] = useState(0);
  const [selectedHistory, setSelectedHistory] =
    useState<DeliveryHistory | null>(null);

  const [auth] = useAtom(authAtom);

  const [{ data, isLoading, refetch, isError }] = useAtom(
    deliveryHistoryAtom
  );

  const onRefresh = useCallback(() => refetch(), []);

  const onTouchOutSideToLogout = (): void => {
    setLogoutVisible(false);
    setLogoutLoading(true);
    Services.LogoutUser();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const onTouchOutsideHistoryModal = (
    item?: DeliveryHistory
  ): void => {
    setHistoryModal((s) => !s);
    setSelectedHistory(null);
    if (item) {
      setSelectedHistory(item);
    }
  };

  const renderItem: ListRenderItem<DeliveryHistory> = ({ item }) => (
    <Pressable
      style={({ pressed }: PressableStateCallbackType) => [
        styles.renderItem,
        {
          backgroundColor: pressed ? Colors.primary : 'transparent',
        },
      ]}
      onPress={(): void => onTouchOutsideHistoryModal(item)}
    >
      <View style={{ width: wp('30%') }}>
        <Text style={{ color: Colors.black }} numberOfLines={1}>
          {item.row_code}
        </Text>
      </View>
      <View
        style={{
          paddingRight: wp('10%'),
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            color: Colors.black,
          }}
        >
          {item.driver_name}
        </Text>
      </View>
      <View
        style={{
          paddingRight: wp('10%'),
        }}
      >
        <Text
          style={{
            textAlign: 'center',
            color: Colors.black,
          }}
        >
          {item.delivery_status_code}
        </Text>
      </View>
    </Pressable>
  );

  const renderListEmptyComponent = (): JSX.Element => (
    <View
      style={{
        marginTop: hp('30%'),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      }}
    >
      <Text style={{ color: Colors.black }}>
        {fetchLanguage[lang].notaskhistory}
      </Text>

      <View
        style={{
          marginTop: 30,
          marginBottom: 30,
        }}
      >
        <TouchableOpacity
          style={{
            padding: 10,
            borderWidth: 0.5,
            borderRadius: 5,
            borderColor: Colors.primary,
            width: 100,
            alignContent: 'center',
            alignSelf: 'center',
          }}
          onPress={onRefresh}
        >
          <Text
            style={{
              textAlign: 'center',
              color: Colors.black,
            }}
          >
            {fetchLanguage[lang].reload}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  useBackHandler();

  useEffect(() => {
    onRefresh();
  }, []);

  useEffect(() => {
    setLang(auth?.user?.language === 'ENG' ? 0 : 1);
  }, [auth]);

  useEffect(() => {
    if (isError) {
      setLogoutVisible(true);
      setTimeout(() => {
        setLogoutLoading(false);
      }, 1500);
    }
  }, [data, isError]);
  return (
    <>
      <View style={styles.container}>
        <Header title="Home Delivery -" navigation={navigation} />

        <CustomModal
          visible={logoutVisible}
          loading={logoutLoading}
          onTouchOutside={(): void => onTouchOutSideToLogout()}
          text="Session timeout!"
        />

        <>
          <View style={styles.row}>
            <Text style={[styles.bold, { width: wp('25%') }]}>
              {/* {fetchLanguage[lang].bill_no} */}
              Row Code No.
            </Text>
            <Text style={styles.bold}>
              {/* {fetchLanguage[lang].date} */}
              Driver
            </Text>
            <Text style={styles.bold}>
              {/* {fetchLanguage[lang].immageattached} */}
              Status ID
            </Text>
          </View>
          <FlatList
            refreshing={isLoading}
            onRefresh={onRefresh}
            ListEmptyComponent={renderListEmptyComponent}
            data={data}
            renderItem={renderItem}
          />
        </>

        {/* //FOR VIEWING HISTORY ITEM */}
        <BottomModal
          visible={historyModal}
          onTouchOutside={(): void => onTouchOutsideHistoryModal()}
          onSwipeOut={(): void => onTouchOutsideHistoryModal()}
          modalTitle={
            <View style={styles.modalTitleContainer}>
              <View style={styles.rowCodeContainer}>
                <Text style={styles.rowCodeText}>
                  {`Row Code No. ${selectedHistory?.row_code}`}
                </Text>
              </View>
            </View>
          }
        >
          <ModalContent>
            <>
              <View style={styles.modelContent}>
                <Row
                  left="Date : "
                  right={selectedHistory?.time_in}
                />

                <Row
                  left="Branch Name: "
                  right={selectedHistory?.branch_name}
                />
              </View>
            </>
          </ModalContent>
        </BottomModal>
      </View>
    </>
  );
};

export default HomeDeliveryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: wp('4%'),
  },
  row: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  modalTitleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '100%',
  },
  rowCodeContainer: {
    borderBottomWidth: 1,
    borderColor: '#70707029',
  },
  rowCodeText: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 15,
  },
  modelContent: {
    alignContent: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
  renderItem: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingLeft: 5,
    paddingRight: 30,
    justifyContent: 'space-between',
    borderRadius: 5,
  },
});
