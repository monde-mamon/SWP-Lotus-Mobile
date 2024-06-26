import { atomWithQuery } from 'jotai-tanstack-query';
import { retrieveData } from '../services';

export interface DeliveryHistory {
  id: number;
  row_code: string;
  hub_code: string;
  branch_name: string;
  time_in: string;
  time_out: string;
  delivery_status_code: string;
  truck_code_license: string;
  condition_code: number;
  sender_name: string | null;
  user_id: number;
  email: string;
  driver_name: string;
}
export const deliveryHistoryAtom = atomWithQuery(() => ({
  queryKey: ['delivery', 'history', 'atom'],
  queryFn: async (): Promise<DeliveryHistory[]> => {
    const auth_token = await retrieveData('auth_token');
    const res = await fetch(
      'http://mglsgp1.railsfor.biz:3111/api/v1/deliveries/history',
      {
        method: 'GET',
        headers: {
          Authorization: auth_token,
        },
      }
    );
    return res.json();
  },
}));
