import { atom } from 'jotai';
import { language } from '../utils/language';
import {
  Auth,
  Language,
  LocationConfig,
  Step1Delivery,
} from '@/src/schema';

export const authAtom = atom<Auth | null>(null);
export const locationAtom = atom<LocationConfig | null>(null);
export const newDeliveryAtom = atom<Step1Delivery | null>(null);
export const languageAtom = atom<Language>(language.THAI);
