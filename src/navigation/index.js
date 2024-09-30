import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { authAtom, languageAtom } from '../atom';
import CustomModal from '../components/CustomModal';
import FourOrFour from '../screens/404';
import ChangePassword from '../screens/ChangePassword';
import CheckInScreen from '../screens/CheckIn';
import DeliveryScreen from '../screens/Deliveries';
import HomeDeliveryScreen from '../screens/HomeDelivery';
import Login from '../screens/Login';
import Maintainance from '../screens/Maintainance';
import Settings from '../screens/Settings';
import Update from '../screens/Update';
import * as Services from '../services';
import { Colors } from '../themes/colors';
import * as Utils from '../utils/permission';

function CustomDrawerContent(props) {
  const { navigation, ...rest } = props;
  const [auth, setAuth] = useAtom(authAtom);
  const [lang] = useAtom(languageAtom);
  const [logoutLoading, setLogoutLoading] = useState(true);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const translateX = 0;
  const onTouchOutSideToLogout = () => {};

  const onPressLogout = () => {
    setLogoutLoading(true);
    setLogoutVisible(true);
    setTimeout(() => {
      setLogoutLoading(false);
      setAuth(null);
      Services.LogoutUser();
      navigation.closeDrawer();

      setTimeout(() => {
        setLogoutVisible(false);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }, 500);
    }, 1500);
  };

  return (
    <DrawerContentScrollView {...props}>
      <CustomModal
        visible={logoutVisible}
        loading={logoutLoading}
        onTouchOutside={() => {
          onTouchOutSideToLogout();
        }}
        text={'Successfully Logout!'}
      />
      <Animated.View style={{ transform: [{ translateX }] }}>
        <View style={styles.drawerMainContainer}>
          <View style={styles.innerDrawerContainer}>
            <View style={styles.paddingContainer}>
              <View style={styles.rowContainer}>
                <View
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: 30,
                    backgroundColor: '#888888',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      textTransform: 'uppercase',
                      fontSize: 30,
                    }}
                  >
                    {auth?.user?.email?.charAt(0)}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.right}
                  onPress={() => {
                    navigation.closeDrawer();
                  }}
                />
              </View>
              <Text style={styles.nameDrawerContainer}>
                {auth?.user?.email}
              </Text>
              <Text
                style={{ fontWeight: 'bold', color: Colors.black }}
              >
                {auth?.user?.user_type}
              </Text>
            </View>

            <View style={styles.dividerContainer} />

            <DrawerItemList {...rest} {...props} />

            <DrawerItem
              label={lang.settings}
              onPress={() => navigation.navigate('Settings')}
            />

            <View style={styles.dividerContainer} />
            <DrawerItem
              label={lang.logout}
              onPress={() => onPressLogout()}
            />
          </View>
        </View>
      </Animated.View>
    </DrawerContentScrollView>
  );
}
function DrawerNavigator() {
  const [lang] = useAtom(languageAtom);

  return (
    <Drawer.Navigator
      drawerType="front"
      drawerPosition="right"
      lazy="false"
      screenOptions={{
        itemStyle: {
          marginVertical: 0,
        },
      }}
      drawerStyle={styles.transparent}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name={lang.home}
        component={HomeDeliveryScreen}
        options={{
          header: () => null,
        }}
      />

      <Drawer.Screen
        name={lang.deliveries}
        component={DeliveryScreen}
        options={{
          header: () => null,
        }}
      />
      <Drawer.Screen
        name={'CheckIn'}
        component={CheckInScreen}
        options={{
          header: () => null,
        }}
      />
    </Drawer.Navigator>
  );
}

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  dividerContainer: {
    width: '100%',
    height: 0.8,
    marginBottom: 20,
    backgroundColor: Colors.primary,
  },
  drawerMainContainer: {
    flex: 1,
  },
  innerDrawerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },
  paddingContainer: {
    padding: 20,
    paddingTop: 40,
    justifyContent: 'flex-start',
  },
  nameDrawerContainer: {
    fontSize: 15,
    paddingTop: 10,
    color: Colors.black,
  },
  profilephotoContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    borderWidth: 0.3,
    borderColor: 'white',
  },
  right: {
    right: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  splashContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  splashlogo: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: '50%',
    height: 1,
    padding: 130,
    resizeMode: 'contain',
  },
  textCenter: {
    alignSelf: 'center',
  },
  transparent: {
    backgroundColor: 'transparent',
  },
});

export default function App() {
  const options = {
    gestureDirection: 'vertical',
    animationEnabled: true,
    headerBackTitleVisible: false,
    cardStyleInterpolator:
      CardStyleInterpolators.forRevealFromBottomAndroid,
  };

  const optionsB = {
    gestureEnabled: false,
    animationEnabled: true,
    cardStyleInterpolator:
      CardStyleInterpolators.forFadeFromBottomAndroid,
  };
  useEffect(() => {
    Utils.requestAllRequiredPermission();
  }, []);
  return (
    <NavigationContainer>
      <StatusBar
        backgroundColor={Colors.primary}
        barStyle="light-content"
      />

      <Stack.Navigator
        screenOptions={{
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator:
            CardStyleInterpolators.forHorizontalIOS,
          headerShown: false,
          animationEnabled: true,
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="Home"
          component={DrawerNavigator}
          options={() => options}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePassword}
          options={{ gestureEnabled: false }}
        />

        <Stack.Screen
          name="Update"
          component={Update}
          options={() => optionsB}
        />
        <Stack.Screen
          name="Maintainance"
          component={Maintainance}
          options={() => optionsB}
        />
        <Stack.Screen
          name="HomeDelivery"
          component={HomeDeliveryScreen}
          options={() => optionsB}
        />
        <Stack.Screen
          name="FourOrFour"
          component={FourOrFour}
          options={() => optionsB}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
