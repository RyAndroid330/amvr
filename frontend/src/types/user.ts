export interface User {
  id: string;
  role: string;
  first_name: string;
  last_name: string;
  email_address: string;
  date_of_birth: string;
  address: string;
  created_at: string;
}

export interface Data {
  users: [User];
  nextCursor: { createdAt: string };
}

export interface Address {
  uid: string;
  country: string;
  city: string;
  street: string;
  street_number: number;
  postal_code: number;
}
