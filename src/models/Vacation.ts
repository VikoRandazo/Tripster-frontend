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

export enum vacationStatus {
  ALL = 0,
  UP_COMING = 1,
  FAVORITES = 2,
  ON_GOING = 3,
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
