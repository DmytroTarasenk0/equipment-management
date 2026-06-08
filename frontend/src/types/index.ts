export interface User {
  id: number;
  name: string;
  email: string;
  role: "Medic" | "Engineer" | "Admin";
}

export interface MaintenanceLog {
  id: number;
  date: string;
  description: string;
  user_id: number;
}

export interface Equipment {
  id: number;
  name: string;
  serial_number: string;
  status: "Active" | "Warning" | "Maintenance" | "Decommissioned";
  next_maintenance: string;
  logs?: MaintenanceLog[];
}

export interface AuthResponse {
  message: string;
  token: string;
  refreshToken: string;
}
