
export interface LoadflowSettings {
  target_mw: number;
  tolerance_mw: number;
  swing_bus_id: string;
}

export interface AppConfig {
  loadflow_settings: LoadflowSettings;
}

export interface Project {
  id: string;
  name: string;
  role: string;
}

export interface Member {
  uid: string;
  email: string;
  username: string;
  role: string;
  global_role: string;
}
