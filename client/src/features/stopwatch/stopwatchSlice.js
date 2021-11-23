import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import { fetchAllExertions } from '../exertion/exertionSlice';

const modeEnum = {
  GRIND: "grind",
  REST: "rest"
}

export const pomodoroSlice = createSlice({
  name: 'stopwatch',
  initialState: {
    value: 0,
    isRunning: false,
    isPaused: false,
  },
  reducers: {
    startStopWatch: (state, action) => {
      state.isPaused = false
      state.isRunning = true
    },
    pause: (state) => {
      state.isRunning = false
      state.isPaused = true
    },
    finish: (state) => {
      state.value = 0
      state.isRunning = true
      state.isPaused = false
    },
    reset: state => {
      state.value = 0
      state.isRunning = true
      state.isPaused = false
    }
  }
});

export const finishDuration = ({ email, password }) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const exertionId = ''
    const body = JSON.stringify({ email, password });
    const res = await axios.post(
      `/api/exertion/${exertionId}/finish`, 
      body,
      config
    );
    if (res.status === 200) {
      /*
      Let the user know that it increased the finished hour.
      Maybe display the target left hour
      */
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

export const selectValue = state => state.stopwatch.value

export const selectIsRunning = state => state.stopwatch.isRunning

export const selectIsRunningPaused = state => state.stopwatch.isRunningPaused

export const sendStopwatchDuration = (
  { exertionId, operationType, payload }) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
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

export const { 
  reset, startStopwatch,
  pause, finish
} = pomodoroSlice.actions

export default pomodoroSlice.reducer