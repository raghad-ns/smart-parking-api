import { Connection } from "../DB/Entities/Connection";

export interface GetAll {
  page: string;
  pageSize: string;
}

export interface Transactions {
  balance: number;
  confirmed: Date;
  from: string;
  type: string;
}

export interface hestory {
  parking_id: number;
  location: string;
  park_At: string;
  leave_At?: string;
  duration: string ;
  cost?: number;
  status: "active" | "inactive";
}

export interface user {
  carID: string | null;
  email: string | null;
  owner: string | null;
  connection: hestory | null;
  wallet: { id: string | null; amount: number | null };
  role: { roleName: string | null };
  token: string | null;
}
