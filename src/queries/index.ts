import {
  atomWithMutation,
  atomWithQuery,
} from 'jotai-tanstack-query';
import { Step1Delivery } from '../schema';
import { retrieveData } from '../services';

export const hubAtom = atomWithQuery(() => ({
  queryKey: ['deliver', 'hubs'],
  queryFn: async (): Promise<void> => {
    const auth_token = await retrieveData('auth_token');
    const res = await fetch(
      'http://mglsgp1.railsfor.biz:3111/api/v1/hubs',
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

export const storeAtom = atomWithQuery(() => ({
  queryKey: ['delivery', 'store'],
  queryFn: async (): Promise<void> => {
    const auth_token = await retrieveData('auth_token');
    const res = await fetch(
      'http://mglsgp1.railsfor.biz:3111/api/v1/stores/route_index',
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

export const driverAtom = atomWithQuery(() => ({
  queryKey: ['delivery', 'driver'],
  queryFn: async (): Promise<void> => {
    const auth_token = await retrieveData('auth_token');
    const res = await fetch(
      'http://mglsgp1.railsfor.biz:3111/api/v1/drivers',
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

export const deliveryConditionAtom = atomWithQuery(() => ({
  queryKey: ['delivery', 'condition'],
  queryFn: async (): Promise<void> => {
    const auth_token = await retrieveData('auth_token');
    const res = await fetch(
      'http://mglsgp1.railsfor.biz:3111/api/v1/delivery_conditions',
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

export const deliveryStatusAtom = atomWithQuery(() => ({
  queryKey: ['delivery', 'status'],
  queryFn: async (): Promise<void> => {
    const auth_token = await retrieveData('auth_token');
    const res = await fetch(
      'http://mglsgp1.railsfor.biz:3111/api/v1/delivery_statuses',
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

// STEP1
export const createStep1Atom = atomWithMutation(() => ({
  mutationKey: ['delivery', 'step1'],
  mutationFn: async (data: any): Promise<Step1Delivery> => {
    const auth_token = await retrieveData('auth_token');
    const res = await fetch(
      'http://mglsgp1.railsfor.biz:3111/api/v1/deliveries',
      {
        method: 'POST',
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': ' application/json ',
          Authorization: auth_token,
        },
        body: JSON.stringify(data),
      }
    );
    return res.json();
  },
}));

// UPDATE DELIVERY
export const updateDeliveryAtom = atomWithMutation(() => ({
  mutationKey: ['delivery', 'update', 'step1'],
  mutationFn: async (data: {
    id: number;
    time_out: Date;
  }): Promise<Step1Delivery> => {
    const auth_token = await retrieveData('auth_token');
    const res = await fetch(
      `http://mglsgp1.railsfor.biz:3111/api/v1/deliveries/${data.id}`,
      {
        method: 'PUT',
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': ' application/json ',
          Authorization: auth_token,
        },
        body: JSON.stringify(data),
      }
    );
    return res.json();
  },
}));

export interface DeliveryItemSuccessResult extends Step1Delivery {
  id: number;
  row_code: string;
  tray_sent_out: number;
  green_basket: number;
  tray_received_store: number;
  tray_returned_to_hub: number;
  notes: string | null;
}

export const deliveryItemAtom = atomWithQuery(() => {
  return {
    queryKey: ['delivery-items', 'new'],
    queryFn: async (): Promise<DeliveryItemSuccessResult> => {
      const deliveryData = await retrieveData('new_delivery');
      const auth_token = await retrieveData('auth_token');

      const res = await fetch(
        `http://mglsgp1.railsfor.biz:3111/api/v1/delivery_items/${deliveryData?.delivery_item_id?.id}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json, text/plain, */*',
            'content-type': ' application/json ',
            Authorization: auth_token,
          },
        }
      );
      return res.json();
    },
  };
});
// UPDATES ITEM STEP 2
export const createStep2Atom = atomWithMutation(() => ({
  mutationKey: ['delivery', 'step2'],
  mutationFn: async (
    data: DeliveryItemSuccessResult
  ): Promise<void> => {
    const auth_token = await retrieveData('auth_token');
    const res = await fetch(
      `http://mglsgp1.railsfor.biz:3111/api/v1/delivery_items/${data?.id}`,
      {
        method: 'PUT',
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': ' application/json ',
          Authorization: auth_token,
        },
        body: JSON.stringify(data),
      }
    );
    return res.json();
  },
}));
