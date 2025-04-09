import 'dotenv/config';

export default {
  name: 'SWP-Lotus-Tracker',
  slug: 'SWP-Lotus-Tracker',
  owner: 'railsforbiz',
  expo: {
    name: 'SWP-Lotus-Tracker',
    slug: 'SWP-Lotus-Tracker',
    owner: 'railsforbiz',
    version: '0.0.8',
    orientation: 'portrait',
    icon: './src/assets/images/swp_logo.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './src/assets/images/swp_logo.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.railsforbiz.swplotus.app',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './src/assets/images/swp_logo.png',
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
        projectId: '6cd8f5d2-f124-4985-9f96-e2f7acf406bd',
      },
    },
    updates: {
      url: 'https://u.expo.dev/6cd8f5d2-f124-4985-9f96-e2f7acf406bd',
    },
    runtimeVersion: {
      policy: 'appVersion',
    },
  },
};
