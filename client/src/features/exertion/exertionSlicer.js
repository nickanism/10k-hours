import { 
  createSlice
} from '@reduxjs/toolkit';
import axios from 'axios';

import { genericExertionListDisplay } from '../../utils/timeUtils';

const initialState = {
  loading: true,
  exertionList: null,
  totalTargetHoursLeft: null
}

const exertionSlice = createSlice({
  name: 'exertion',
  initialState,
  reducers: {
    loadExertionList: (state, action) => {
      if (action.payload.length) {
        const parsed = JSON.parse(action.payload)
        state.exertionList = parsed
      } else {
        state.exertionList = []
      }
      state.loading = false
    },
    loadTotalTargetHoursLeft: (state, action) => {
      state.totalTargetHoursLeft = action.payload
    },
    createMainExertion: (state, action) => {
      // some action
    },
    login: (state, action) => {
      // some action
    }
  }
});

export const createExertion = ({ name, skill, targetHours}) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const body 
      = JSON.stringify({ name, skill, targetHours });
    const res = await axios.post(
      '/api/exertion/create', 
      body,
      config
    );
    if (res.status === 200) {
      dispatch(fetchAllExertions());
    } else {
      alert(res.data);
    }
  } catch (err) {
    const errors = err.response;
    if (errors) {
      console.error(errors);
    }
  }
}

export const createPartExertion = ({ mainExertionId, name, skill, targetHours}) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const body 
      = JSON.stringify({ mainExertionId, name, skill, targetHours });
    const res = await axios.post(
      '/api/exertion/create-part-exertion', 
      body,
      config
    );
    if (res.status === 200) {
      dispatch(fetchAllExertions());
    } else {
      alert(res.data);
    }
  } catch (err) {
    const errors = err.response;
    if (errors) {
      console.error(errors);
    }
  }
}

export const fetchAllExertions = () => async dispatch => {
  try {
    const res = await axios.get(
      `/api/exertion/main`
    );
    const exertionDisplay 
      = genericExertionListDisplay(res.data.exertions)
    
    dispatch(loadExertionList(exertionDisplay))
    dispatch(loadTotalTargetHoursLeft(res.data.totalTargetHoursLeft))
  } catch (err) {
    console.error(err)
  }
}

export const selectExertionList = state => state.exertion.exertionList

export const selectLoading = state => state.exertion.loading

export const selectTotalTargetHoursLeft = state => state.exertion.totalTargetHoursLeft

export const { 
  createMainExertion,
  loadExertionList, loadTotalTargetHoursLeft
} = exertionSlice.actions;

export default exertionSlice.reducer;