export interface VacationType {
  vacation_id?: number;
  destination: string;
  description: string;
  start_date: string;
  end_date: string;
  price: number;
  image_path?: string;

  [key: number]: number | number | undefined;
}


export const vacationInitState = {
  vacation_id: 0,
  destination: "",
  description: "",
  start_date: "",
  end_date: "",
  price: 0,
  image_path: "",
};
