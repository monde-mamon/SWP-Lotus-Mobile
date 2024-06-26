import 'dotenv/config';

export default {
  name: 'SWP-Lotus-Tracker',
  slug: 'SWP-Lotus-Tracker',
  owner: 'railsforbiz',
  expo: {
    name: 'SWP-Lotus-Tracker',
    slug: 'SWP-Lotus-Tracker',
    owner: 'railsforbiz',
    version: '0.0.1',
    orientation: 'portrait',
    icon: './src/assets/images/lsc_logo.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './src/assets/images/lsc_logo.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.railsforbiz.swplotus.app',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/images/lsc_logo.png',
        backgroundColor: '#ffffff',
      },
      package: 'com.railsforbiz.swplotus.app',
      softwareKeyboardLayoutMode: 'pan',
      googleServicesFile: './google-services.json',
      permissions: [
        'android.permission.ACCESS_FINE_LOCATION',
        'android.permission.ACCESS_BACKGROUND_LOCATION',
        'android.permission.ACCESS_COARSE_LOCATION',
      ],
    },
    plugins: [
      ['expo-router'],
      ['expo-font'],
      [
        'expo-build-properties',
        {
          android: {
            usesCleartextTraffic: true,
          },
        },
      ],
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission:
            'Allow SWP-Tracker to use your location.',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      env: process.env.APP_ENV,
      apiURL: process.env.EXPO_PUBLIC_API_URL,
      eas: {
        projectId: '1574ecc6-cf65-414d-815a-dbeb7af0f193',
      },
    },
    updates: {
      url: 'https://u.expo.dev/1574ecc6-cf65-414d-815a-dbeb7af0f193',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
  },
};
