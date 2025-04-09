import {
  atomWithQuery,
  atomWithMutation,
} from 'jotai-tanstack-query';
import { retrieveData } from '../services';

export interface CheckInStatusPayload {
  user_id: number;
  speed: number;
  longitude: number;
  latitude: number;
  status: string;
  id?: string;
  created_at?: string;
  updated_at?: string;
}

export const fetchCheckInStatusAtom = atomWithQuery(() => ({
  queryKey: ['fetch', 'check-in', 'status'],
  queryFn: async (): Promise<void> => {
    const auth_token = await retrieveData('auth_token');
    const res = await fetch(
      'https://kuehnethai.railsfor.biz/api/v1/check_ins/check_log',
      {
        method: 'GET',
        headers: {
          'content-type': ' application/json ',
          Authorization: auth_token,
        },
      }
    );

    return res.json();
  },
}));

export const mutateCheckInStatusAtom = atomWithMutation(() => ({
  mutationKey: ['mutate', 'check-in', 'status'],
  mutationFn: async (data: CheckInStatusPayload): Promise<void> => {
    const auth_token = await retrieveData('auth_token');
    const res = await fetch(
      'http://mglsgp1.railsfor.biz:3111/api/v1/check_ins/',
      {
        method: 'POST',
        headers: {
          'content-type': ' application/json ',
          Authorization: auth_token,
        },
        body: JSON.stringify({ check_in: data }),
      }
    );
    return res.json();
  },
}));
