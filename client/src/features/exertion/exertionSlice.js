import { 
  createSlice
} from '@reduxjs/toolkit';
import axios from 'axios';

import { genericExertionListDisplay } from '../../utils/timeUtils';
import { 
  returnParsedExertionList
} from '../../utils/parseUtils';

const initialState = {
  loading: true,
  exertionList: null,
  totalTargetHoursLeft: null,
  totalFinishedHours: null,
  totalTargetHours: null
}

const exertionSlice = createSlice({
  name: 'exertion',
  initialState,
  reducers: {
    loadExertionList: (state, action) => {
      if (action.payload.length) {
        let parsed = action.payload
        if (!(parsed instanceof Array)) {
          parsed = Array(parsed)
        }
        parsed = returnParsedExertionList(parsed)
        state.exertionList = parsed
      } else {
        state.exertionList = []
      }
      state.loading = false
    },
    loadTotalTargetHoursLeft: (state, action) => {
      state.totalTargetHoursLeft = action.payload
    },
    loadTotalTargetHours: (state, action) => {
      state.totalTargetHours = action.payload
    },
    loadTotalFinishedHours: (state, action) => {
      state.totalFinishedHours = action.payload
    },
    createMainExertion: (state, action) => {
      // some action
    },
    updating: (state, action) => {
      state.loading = true
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

export const createPartExertion = (
  { parentExertionId, name, skill, targetHours}) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const mainExertionId = parentExertionId
    const body 
      = JSON.stringify({ 
        mainExertionId, name, skill, targetHours 
      });
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

export const editExertion = (
  { exertionId, name, skill, targetHours}) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const body 
      = JSON.stringify({ 
        name, skill, targetHours 
      });
    const res = await axios.put(
      `/api/exertion/${exertionId}`, 
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

export const removeExertion = (exertionId) => async dispatch => {
  try {
    const res = await axios.delete(
      `/api/exertion/${exertionId}`, 
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

export const operateFinishedDuration = (
  { exertionId, operationType, payload }) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    payload *= 3600
    const body 
      = JSON.stringify({ 
        operationType, payload
      });
    const res = await axios.put(
      `/api/exertion/${exertionId}/operate-finished-duration`, 
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
      `/api/exertion/all`
    );
    const exertionDisplay 
      = genericExertionListDisplay(res.data.exertions)
    dispatch(loadExertionList(exertionDisplay))
    dispatch(loadTotalTargetHoursLeft(res.data.totalTargetHoursLeft))
    dispatch(loadTotalTargetHours(res.data.totalTargetHours))
    dispatch(loadTotalFinishedHours(res.data.totalFinishedHours))
  } catch (err) {
    console.error(err)
  }
}

export const selectExertionList = state => state.exertion.exertionList

export const selectLoading = state => state.exertion.loading

export const selectTotalTargetHoursLeft = state => state.exertion.totalTargetHoursLeft

export const selectTotalTargetHours = state => state.exertion.totalTargetHours

export const selectTotalFinishedHours = state => state.exertion.totalFinishedHours

export const { 
  createMainExertion, updating,
  loadExertionList, loadTotalTargetHoursLeft, loadTotalFinishedHours,
  loadTotalTargetHours
} = exertionSlice.actions;

export default exertionSlice.reducer;