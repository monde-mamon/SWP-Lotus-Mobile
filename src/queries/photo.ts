import { atomWithMutation } from 'jotai-tanstack-query';
import { retrieveData } from '../services';

export const uploadPhotoAtom = atomWithMutation(() => ({
  mutationKey: ['delivery', 'step3'],
  mutationFn: async (data: any): Promise<void> => {
    const auth_token = await retrieveData('auth_token');
    const res = await fetch(
      `http://mglsgp1.railsfor.biz:3111/api/v1/photos`,
      {
        method: 'POST',
        headers: {
          'content-type': ' application/json ',
          Authorization: auth_token,
        },
        body: JSON.stringify({ photo: data }),
      }
    );
    return res.json();
  },
}));
