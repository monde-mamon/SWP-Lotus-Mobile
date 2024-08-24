import z from 'zod';

export const Step1Form = z.object({
  hub_id: z.string({ required_error: 'Please select one item.' }),
  senders_name: z.string({
    required_error: 'Please select one item.',
  }),
  name_of_sending_branch: z.string({
    required_error: 'Please select one item.',
  }),
  entry_date_and_time: z.string({
    required_error: 'Please select date.',
  }),
  delivery_condition: z.string({
    required_error: 'Please select one item.',
  }),
  delivery_status: z.string({
    required_error: 'Please select one item.',
  }),
});
export type Step1Form = z.infer<typeof Step1Form>;

export const Step1FormSchema = z.object({
  hub_id: z.string().default(''),
  senders_name: z.string().default(''),
  name_of_sending_branch: z.string().default(''),
  entry_date_and_time: z.string().default(''),
  delivery_condition: z.string().default(''),
  delivery_status: z.string().default(''),
});
export type Step1FormSchema = z.infer<typeof Step1FormSchema>;

export const getInitialValues = (
  driverName?: string,
  hubId?: string,
  entryDateTime?: string,
  deliveryCondition?: string,
  deliveryStatus?: string
): Step1FormSchema =>
  Step1FormSchema.parse({
    senders_name: driverName,
    hub_id: hubId,
    entry_date_and_time: entryDateTime,
    delivery_condition: deliveryCondition,
    delivery_status: deliveryStatus,
  });

export const initialState = {
  hub_details: {
    id: 0,
    hub_id: 0,
    hub_description: '',
    region: '',
  },
  store_details: {
    id: 0,
    hub_code: '',
    route_code: '',
    store_code: '',
    store_name: '',
    store_type: '',
    destination_longitude: '',
    destination_latitude: '',
    order_seq1: '',
    gps_string: '',
  },
  driver_details: {
    id: 0,
    truck_team: '',
    license_plate: '',
    driver_name: '',
    driver_hp: '',
    team_tablet_hp: '',
    team_tablet_serial_no: '',
    status: '',
    support_staff: '',
    zoning: '',
    barcode_flag: 0,
    truck_company: '',
    truck_size: '',
    assembly_capacity: '',
    truck_type: {
      id: 0,
      english_name: '',
      thai_name: '',
      truck_size: '',
      created_at: '',
      updated_at: '',
    },
    remarks: '',
    truck_type_id: 2,
  },
  delivery_status_details: {
    id: 0,
    delivery_status_code: '',
    status_thai: '',
    status_eng: '',
  },
  delivery_condition_details: {
    id: 0,
    condition_code: '',
    condition_description_thai: '',
    condition_description: '',
  },
  entry_date_time: '',
  issue_date: '',
};

export interface DeliveryStep1Props {
  onSubmit: () => void;
  isReset: boolean;
  isActive: boolean;
}
