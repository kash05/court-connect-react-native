export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  full_name: string;
  gender: "male" | "female";
  agree_terms: boolean;
  role: number;
}

export interface TokenInterface {
  access_token: string;
  expires_at: string;
  refresh_token: string;
  type: string;
}

export interface User {
  id: number;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  gender: string;
  agree_terms: boolean;
  roles: Role[];
}

export interface Role {
  id: number;
  created_at: string;
  updated_at: string;
  name: string;
  display_name: string;
}
