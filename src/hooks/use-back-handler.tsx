import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export const useBackHandler = (): JSX.Element => {
  const checkBackHandler = (): boolean => {
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener(
      'hardwareBackPress',
      checkBackHandler
    );

    return (): void => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        checkBackHandler
      );
    };
  }, [checkBackHandler]);

  return <></>;
};
