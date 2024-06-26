import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type StackRoutes = {
  Splash: undefined;
  HomeDelivery: undefined;
  Login: undefined;
  Delivery: undefined;
  FourOrFour: undefined;
  Maintainance: undefined;
};

export type HomeDeliveryScreenProps = NativeStackScreenProps<
  StackRoutes,
  'HomeDelivery'
>;

export type DeliveryScreenProps = NativeStackScreenProps<
  StackRoutes,
  'Delivery'
>;
