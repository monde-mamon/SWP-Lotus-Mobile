import * as Location from 'expo-location';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { authAtom, locationAtom } from '@/src/atom';
import { uploadGPSLocation } from '@/src/queries/gps';

export const GPSLocationHandler = (): JSX.Element => {
  const [{ mutate: uploadGPSMutate }] = useAtom(uploadGPSLocation);
  const [auth] = useAtom(authAtom);
  const [location] = useAtom(locationAtom);
  const task = async (): Promise<void> => {
    if (!auth?.user?.email) {
      const { status } =
        await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      const response = await Location.getCurrentPositionAsync({});
      const position = {
        latitude: response.coords.latitude ?? 'N/A',
        longitude: response.coords.longitude ?? 'N/A',
        gps_string: response.coords.latitude
          ? `${response.coords.latitude},${response.coords.longitude}`
          : 'N/A',
        speed: response.coords.speed ?? 'N/A',
        source_id: auth?.user?.email ?? 'N/A',
        box_id: auth?.user.driver_name ?? 'N/A',
      };

      await uploadGPSMutate(position);
    }
  };

  useEffect(() => {
    if (!auth?.user?.email) return;
    const interval = setInterval(
      () => {
        task();
      },
      location?.timer
    );
    return () => clearInterval(interval);
  }, [auth, location]);

  return <></>;
};
