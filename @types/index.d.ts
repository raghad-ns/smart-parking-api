export interface GetAll {
  page: string;
  pageSize: string;
}

export interface Transactions {
  balance: number;
  confirmed: Date;
  from: string;
  type: string
}
