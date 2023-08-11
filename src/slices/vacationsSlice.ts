import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { VacationType, vacationInitState } from "../models/Vacation";

export interface VacationsSlice {
  setVacations: VacationType[];
  addVacation: VacationType;
}

const initVacationsState = {
  setVacations: [],

  addVacation: vacationInitState,
};

export const vacationsSlice = createSlice({
  name: "vacations",
  initialState: initVacationsState as VacationsSlice,
  reducers: {
    setVacations(state, { payload }: PayloadAction<VacationType[]>) {
      payload.sort((a: VacationType, b: VacationType) => {
        const dateA = new Date(a.start_date);
        const dateB = new Date(b.start_date);
        return dateA.getTime() - dateB.getTime();
      });
      state.setVacations = payload;
    },
    addVacation(state, { payload }: PayloadAction<VacationType>) {
      state.setVacations.push(payload);
    },
    deleteVacation(state, { payload }: PayloadAction<number>) {
      const foundVacation = state.setVacations.findIndex(
        (vacation) => vacation.vacation_id === payload
      );
      if (foundVacation !== -1) {
        state.setVacations.splice(foundVacation, 1);
      }
    },
    editVacation(state, { payload }: PayloadAction<VacationType>) {
      const foundVacation = state.setVacations.findIndex(
        (vacation) => vacation.vacation_id === payload.vacation_id
      );
      if (foundVacation !== -1) {
        state.setVacations[foundVacation] = payload;
      }
    },
    resetState(state: any) {
      return { ...initVacationsState };
    },
  },
});

export const vacationsActions = vacationsSlice.actions;
