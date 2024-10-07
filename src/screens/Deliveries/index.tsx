import {
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import { Tab, TabView } from '@rneui/themed';
import { useAtom } from 'jotai';
import { delay, first } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Header } from '../../components/Header';
import { Colors } from '../../themes/colors';
import DeliveryStep1 from './tabs/step-1';
import DeliveryStep2 from './tabs/step-2';
import DeliveryStep3 from './tabs/step-3';
import { languageAtom } from '@/src/atom';
import CustomModal from '@/src/components/CustomModal';
import { useBackHandler } from '@/src/hooks/use-back-handler';
import { fetchCheckInStatusAtom } from '@/src/hooks/use-check-status';
import { DeliveryScreenProps } from '@/src/navigation/types';

const DeliveryScreen = ({
  navigation,
}: DeliveryScreenProps): JSX.Element => {
  const [index, setIndex] = useState(0);
  const [lang] = useAtom(languageAtom);
  const isFocused = useIsFocused();
  const [isRefreshing, setRefreshing] = useState<boolean>(false);
  const [isCheckedInVisible, setIsCheckedInVisible] =
    useState<boolean>(false);
  useBackHandler();

  const [
    {
      data: fetchCheckInStatusData,
      isRefetching: fetchCheckInStatusIsRefetching,
      refetch: fetchCheckInStatusRefetch,
    },
  ] = useAtom(fetchCheckInStatusAtom);

  useFocusEffect(
    useCallback(() => {
      fetchCheckInStatusRefetch();
    }, [])
  );

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
        setIsCheckedInVisible(true);
      }
    }
  }, [isFocused, fetchCheckInStatusIsRefetching]);

  useEffect(() => {
    delay(() => setIndex(0), 3000);
  }, []);

  useEffect(() => {
    if (isFocused) resetState();
  }, [isFocused]);

  const resetState = (): void => {
    setRefreshing(true);
    setIndex(0);
    delay(() => setRefreshing(false), 200);
  };

  const handleOnPressReset = (): void =>
    Alert.alert(
      '',
      `${lang.do_you_want_to_discard_your_changes}`,
      [
        {
          text: 'OK',
          onPress: resetState,
        },
      ],
      { cancelable: false }
    );

  const redirectToCheckIn = (): void => {
    setIsCheckedInVisible(false);
    navigation.navigate('CheckIn');
  };

  return (
    <View style={styles.container}>
      <CustomModal
        visible={isCheckedInVisible}
        loading={false}
        onTouchOutside={redirectToCheckIn}
        text={'You need to check in first!'}
      />
      <View style={{ padding: wp('4%') }}>
        <Header
          title={lang.deliveries}
          navigation={navigation}
          onReset={handleOnPressReset}
          isCustom
          isReset
        />
      </View>

      <Tab
        value={index}
        onChange={(e): void => setIndex(e)}
        indicatorStyle={{
          backgroundColor: Colors.primary,
          height: 2,
        }}
        iconPosition="right"
      >
        <Tab.Item
          disabled
          disabledStyle={styles.bgWhite}
          title={lang.step_1}
          titleStyle={styles.tabItemStyle}
          icon={{
            name: 'people-outline',
            type: 'ionicon',
            color: Colors.primary,
          }}
        />
        <Tab.Item
          disabled
          disabledStyle={styles.bgWhite}
          title={lang.step_2}
          titleStyle={styles.tabItemStyle}
          icon={{
            name: 'document-text-outline',
            type: 'ionicon',
            color: Colors.primary,
          }}
        />
        <Tab.Item
          disabled
          disabledStyle={styles.bgWhite}
          title={lang.step_3}
          titleStyle={styles.tabItemStyle}
          icon={{
            name: 'image-outline',
            type: 'ionicon',
            color: Colors.primary,
          }}
        />
      </Tab>

      <TabView
        value={index}
        onChange={setIndex}
        animationType="spring"
        disableSwipe
      >
        <TabView.Item style={styles.tabViewItem}>
          <DeliveryStep1
            isActive={index === 0}
            onSubmit={(): void => setIndex(1)}
            isReset={isRefreshing}
          />
        </TabView.Item>
        <TabView.Item style={styles.tabViewItem}>
          <DeliveryStep2
            isActive={index === 1}
            onSubmit={(): void => setIndex(2)}
            isReset={isRefreshing}
          />
        </TabView.Item>
        <TabView.Item style={styles.tabViewItem}>
          <DeliveryStep3
            isActive={index === 2}
            onSubmit={resetState}
            isReset={isRefreshing}
          />
        </TabView.Item>
      </TabView>
    </View>
  );
};

export default DeliveryScreen;

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
