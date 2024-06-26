import remoteConfig from '@react-native-firebase/remote-config';

// data is locally cached for FETCH_INTERVAL in seconds
const FETCH_INTERVAL = 0;
// Feature names constants, use them to reference to a feature

const config = {
  IS_APPLICATION_ON: false,
  APP_VERSION: '0.0.1',
  BUILD_URL: '',
  API_URL: 'https://lsc-staging.railsfor.biz/api/v1',
  LOGO_1_URL: '',
  LOGO_2_URL: '',
  LOCATION_TIMER_INTERVAL: 2000,
};

export const fetchRemoteConfig = async () => {
  remoteConfig().setDefaults(config);

  const fetch = remoteConfig().fetch(FETCH_INTERVAL);
  return fetch
    .then(() => remoteConfig().activate())
    .then(() => {
      return remoteConfig().getAll();
    })
    .then((snapshot) => {
      console.log('ALL ON IT : ', snapshot);
      return {
        IS_APPLICATION_ON: snapshot.IS_APPLICATION_ON.asBoolean(),
        IS_PDA_MODE_ON: snapshot.IS_PDA_MODE_ON.asBoolean(),
        APP_VERSION: snapshot.APP_VERSION.asString(),
        BUILD_URL: snapshot.BUILD_URL.asString(),
        API_URL: snapshot.API_URL.asString(),
        LOGO_1_URL: snapshot.LOGO_1_URL.asString(),
        LOGO_2_URL: snapshot.LOGO_2_URL.asString(),
        LOCATION_TIMER_INTERVAL:
          snapshot.LOCATION_TIMER_INTERVAL.asNumber(),
      };
    })
    .catch((err) => {
      console.log('ERR ON FIREBASE: ', err);
    });
};
export default fetchRemoteConfig;
