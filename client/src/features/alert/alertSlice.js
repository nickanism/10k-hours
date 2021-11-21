import uuid from 'uuid';
import { createSlice } from '@reduxjs/toolkit';

const initialState = []

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    setAlert: (state, action) => {
      const { msg, alertType, id } = action.payload;
      state = [...state, { msg, alertType, id }];
    },
    removeAlert: (state, action) => {
      const { id } = action.payload;
      state = state.filter(alert => alert.id !== id);
    }
  }
})

export const setRemoveAlertAsync = (msg, alertType) => dispatch => {
  const id = uuid.v4();
  dispatch(setAlert({msg, alertType, id}))
  setTimeout(() => {
    dispatch(removeAlert(id))
  }, 3000)
}

export const { setAlert, removeAlert } 
= alertSlice.actions;

export default alertSlice.reducer;