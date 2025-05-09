
// Types définis pour correspondre aux tables Supabase
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  last_login?: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface Role {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Permission {
  id: string;
  key: string;
  description: string;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
}

export interface Subscriber {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  subscription_type_id: string;
  start_date: string;
  end_date: string;
  amount: number;
  status: 'active' | 'expired' | 'pending';
  created_at: string;
}

export interface Institution {
  id: string;
  name: string;
  type: string;
  address: string;
  phone: string;
  email: string;
  contact_person: string;
  joining_date: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface SubscriptionType {
  id: string;
  name: string;
  description: string;
  duration: number; // en mois
  price: number;
  reader_type: string;
  is_active: boolean;
  created_at: string;
}

export interface Sale {
  id: string;
  magazine_issue: string;
  quantity: number;
  date: string;
  client: string;
  amount: number;
  payment_method: string;
  status: 'paid' | 'pending' | 'cancelled';
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  type: string;
  user_id: string;
  created_at: string;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  responsible_id: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Prospect {
  id: string;
  contact_id: string;
  date: string;
  notes: string;
  status: 'new' | 'contacted' | 'interested' | 'not_interested' | 'converted';
  user_id: string;
  created_at: string;
}

export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  organization: string;
  position: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  created_at: string;
}
