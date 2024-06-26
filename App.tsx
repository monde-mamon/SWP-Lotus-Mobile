// In App.js in a new project

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import React from 'react';
import { ModalPortal } from 'react-native-modals';
import { GPSLocationHandler } from './src/components/handler/GPSLocationHandler';
import Navigation from './src/navigation';
// NOTE: comment out this lines If you want to use reactotron
import AsyncStorage from '@react-native-async-storage/async-storage';
import Reactotron from 'reactotron-react-native';
if (__DEV__) {
  Reactotron.setAsyncStorageHandler!(AsyncStorage)
    .configure()
    .useReactNative({
      networking: {
        ignoreUrls: /(symbolicate|logs|google\.com)/,
      },
    })
    .connect();
}

export const queryClient = new QueryClient();

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <GPSLocationHandler />
      <Navigation />
      <ModalPortal />
    </QueryClientProvider>
  );
};

export default App;
