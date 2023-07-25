export interface User {
  user_id?: number;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  isAdmin?:number;
}
