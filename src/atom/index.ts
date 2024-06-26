import { atom } from 'jotai';
import { Auth, LocationConfig, Step1Delivery } from '@/src/schema';

export const authAtom = atom<Auth | null>(null);
export const locationAtom = atom<LocationConfig | null>(null);
export const newDeliveryAtom = atom<Step1Delivery | null>(null);
