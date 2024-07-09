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

export interface Language {
  date: string;
  assembly: string;
  immageattached: string;
  notaskhistory: string;
  reload: string;
  datestamp: string;
  hasmattress: string;
  new: string;
  submit: string;
  pleaseinputrequired: string;
  somethingwentwrong: string;
  trucknumber: string;
  back: string;
  previousteam: string;
  scananother: string;
  deliverdate: string;
  servicetime: string;
  volume: string;
  weight: string;
  servicename: string;
  noordersfound: string;
  tryagain: string;
  account: string;
  changepassword: string;
  changelanguage: string;
  isPDAMODE: string;
  chooselanguage: string;
  home: string;
  receiving: string;
  completeDelivery: string;
  return: string;
  storagelocation: string;
  location: string;
  loadtruck: string;
  ordersearch: string;
  settings: string;
  newtask: string;
  mytask: string;
  template: string;
  customer: string;
  freightnoteno: string;
  productcondition: string;
  receivingdepartment: string;
  jobstatus: string;
  remarks: string;
  attachimages: string;
  closetask: string;
  housetype: string;
  logout: string;
  staging: string;
  stage: string;
  presstoscan: string;
  good: string;
  torn: string;
  scratched: string;
  damaged: string;
  discolored: string;
  bill_no: string;
  scan_now: string;
  deliveries: string;
  home_delivery: string;
  driver: string;
  status_id: string;
  row_code_no: string;
  step_1: string;
  step_2: string;
  step_3: string;
  hub_id: string;
  senders_name: string;
  drivers_license_plate: string;
  branch_name: string;
  time_in: string;
  delivery_condition: string;
  delivery_status: string;
  number_of_trays_sent: string;
  number_of_green_basket: string;
  number_of_trays_store_received: string;
  number_of_trays_hub_returned: string;
  notes: string;
  picture_1: string;
  picture_2: string;
  signature: string;
  do_you_want_to_discard_your_changes: string;
  choose: string;
  click_here: string;
  store: string;
  done: string;
  clear: string;
  store_name: string;
}
