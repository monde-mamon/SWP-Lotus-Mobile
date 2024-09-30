import { useIsFocused } from '@react-navigation/native';
import { Text } from '@rneui/base';
import * as Location from 'expo-location';
import { useAtom } from 'jotai';
import { first, isEmpty } from 'lodash';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Header } from '../../components/Header';
import { Colors } from '../../themes/colors';
import { authAtom } from '@/src/atom';
import CustomModal from '@/src/components/CustomModal';
import SwipeableButton from '@/src/components/swipeable-button';
import { useBackHandler } from '@/src/hooks/use-back-handler';
import {
  CheckInStatusPayload,
  fetchCheckInStatusAtom,
  mutateCheckInStatusAtom,
} from '@/src/hooks/use-check-status';
import { DeliveryScreenProps } from '@/src/navigation/types';

const CheckInScreen = ({
  navigation,
}: DeliveryScreenProps): JSX.Element => {
  const isFocused = useIsFocused();
  const [auth] = useAtom(authAtom);

  const [logoutLoading, setLogoutLoading] = useState(true);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [isStatusNone, setIsStatusNone] = useState(false);

  useBackHandler();

  const [{ mutate: mutateCheckIn }] = useAtom(
    mutateCheckInStatusAtom
  );
  const [
    {
      data: fetchCheckInStatusData,
      isRefetching: fetchCheckInStatusIsRefetching,
      refetch: fetchCheckInStatusRefetch,
    },
  ] = useAtom(fetchCheckInStatusAtom);

  useEffect(() => {
    if (isFocused) {
      fetchCheckInStatusRefetch();
    }
  }, [isFocused]);

  useEffect(() => {
    if (
      isFocused &&
      fetchCheckInStatusData &&
      'errors' in fetchCheckInStatusData
    ) {
      const firstError = first(
        (fetchCheckInStatusData as { errors: string[] }).errors
      );
      if (firstError === 'Not Found') {
        setIsStatusNone(true);
      }
    }
  }, [fetchCheckInStatusData, fetchCheckInStatusIsRefetching]);

  useEffect(() => {
    if (
      isFocused &&
      fetchCheckInStatusData &&
      'log' in fetchCheckInStatusData
    ) {
      const firstLog = first(
        (fetchCheckInStatusData as { log: CheckInStatusPayload[] })
          .log
      );
      if (!isEmpty(firstLog)) {
        setIsStatusNone(false);
      }
    }
  }, [fetchCheckInStatusData, fetchCheckInStatusIsRefetching]);

  const checkIn = async (): Promise<void> => {
    const response = await Location.getCurrentPositionAsync({});

    mutateCheckIn({
      user_id: Number(auth?.user?.id),
      speed: response.coords.speed ?? 0,
      latitude: response.coords.latitude ?? 'N/A',
      longitude: response.coords.longitude ?? 'N/A',
      status: 'CHECKIN',
    });
    setIsStatusNone(false);
    setTimeout(() => {
      setLogoutVisible(false);

      navigation.goBack();
    }, 1500);
  };

  const onSwipe = (): void => {
    setLogoutLoading(true);
    setLogoutVisible(true);
    setTimeout(() => {
      setLogoutLoading(false);

      checkIn();
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <CustomModal
        visible={logoutVisible}
        loading={logoutLoading}
        onTouchOutside={() => {}}
        text={'Successfully Checked In!'}
      />
      <View style={{ padding: wp('4%'), flex: 1 }}>
        <Header title={'Check In'} navigation={navigation} />

        <View
          style={{
            flexDirection: 'row',
            paddingTop: wp('40%'),
            justifyContent: 'space-evenly',
          }}
        >
          <Text
            style={{
              fontSize: wp('5%'),
              fontWeight: 'bold',
            }}
          >
            Status:
          </Text>
          {isStatusNone ? (
            <Text
              style={{
                fontSize: wp('5%'),
                fontWeight: 'bold',
                color: 'red',
              }}
            >
              None
            </Text>
          ) : (
            <Text
              style={{
                fontSize: wp('5%'),
                fontWeight: 'bold',
                color: 'green',
              }}
            >
              Checked In
            </Text>
          )}
        </View>

        {isStatusNone && (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <SwipeableButton onSwipe={onSwipe} />
          </View>
        )}
      </View>
    </View>
  );
};

export default CheckInScreen;

const styles = StyleSheet.create({
  bgWhite: {
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  tabItemStyle: {
    fontSize: 12,
    color: 'gray',
  },
  tabViewItem: {
    width: '100%',
  },
});
