export type OPERATOR = 'add' | 'minus' | 'manual';
export type TYPE =
  | 'number_of_trays_sent'
  | 'number_of_green_basket'
  | 'number_of_trays_received';

export const initialState = {
  number_of_trays_sent: 0,
  number_of_green_basket: 0,
  number_of_trays_received: 0,
  notes: '',
};
export interface DeliveryStep2Props {
  onSubmit: () => void;
  isReset: boolean;
  isActive: boolean;
}
