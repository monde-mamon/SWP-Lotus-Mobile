export interface Hub {
  id: number;
  hub_id: number;
  hub_description: string;
  region: string;
}

export interface Driver {
  id: number;
  truck_team: string;
  license_plate: string;
  driver_name: string;
  driver_hp: string;
  team_tablet_hp: string;
  team_tablet_serial_no: string;
  status: string;
  support_staff: string;
  zoning: string;
  barcode_flag: number;
  truck_company: string;
  truck_size: string;
  assembly_capacity: string;
  truck_type: {
    id: number;
    english_name: string;
    thai_name: string;
    truck_size: string;
    created_at: string;
    updated_at: string;
  };
  remarks: string;
  truck_type_id: number;
}

export interface Store {
  id: number;
  hub_code: string;
  route_code: string;
  store_code: string;
  store_name: string;
  store_type: string;
  destination_longitude: string;
  destination_latitude: string;
  order_seq1: string;
  gps_string: string;
}

export interface DeliveryStatus {
  id: number;
  delivery_status_code: string;
  status_thai: string;
  status_eng: string;
}
export interface DeliveryCondition {
  id: number;
  condition_code: string;
  condition_description_thai: string;
  condition_description: string;
}

export interface CreateDeliveries {
  hub_code: number;
  branch_name: string;
  time_in: string;
  time_out: string;
  delivery_status_code: string;
  truck_code_license: string;
  condition_code: string;
  store_code: string;
  user_id: number;
  driver_name: string;
}

export interface Auth {
  user: {
    id: number;
    email: string;
    location: string;
    department: string;
    gps_login_location: string;
    language: 'ENG' | 'THAI';
    user_type: string;
    driver_name?: string;
    truck_license?: string;
    hub_code?: string;
    route_code?: string;
  };
  auth_token: string;
}

export interface Step1Delivery {
  id: number;
  row_code: string;
  hub_code: string;
  branch_name: string;
  time_in: string;
  time_out: string;
  delivery_status_code: string;
  truck_code_license: string;
  condition_code: number;
  sender_name: string;
  user_id: number;
  email: string;
  driver_name: string;
  delivery_item_id: {
    id: number;
    row_code: string;
    tray_sent_out: number;
    green_basket: number;
    tray_received_store: number;
    tray_returned_to_hub: number;
    created_at: string;
    updated_at: string;
    notes: string | null;
  };
}

export interface LocationConfig {
  timer: number;
}
