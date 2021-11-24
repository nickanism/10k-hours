import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import { 
  pomodoroExertionListDisplay
} from '../../utils/timeUtils'

const modeEnum = {
  GRIND: "grind",
  REST: "rest"
}

export const pomodoroSlice = createSlice({
  name: 'pomodoro',
  initialState: {
    mode: modeEnum.GRIND,
    value: null,
    isRunning: false,
    isRunningPaused: false,
    startRunningValue: 1500,
    startRestingValue: 300,
    exertionList: null,
    loading: true
  },
  reducers: {
    incrementTimerBySecond: state => {
      if (state.isRunningPaused) {
      } else {
        state.startRunningValue += 10
      }
    },
    decrementTimerBySecond: state => {
      if (state.isRunningPaused) {
      } else if (state.startRunningValue >= 20) {
        state.startRunningValue -= 10
      } else {
        state.startRunningValue = 10
      }
    },
    incrementTimerByMinute: state => {
      if (state.isRunningPaused) {
      } else {
        state.startRunningValue += 60
      }
    },
    decrementTimerByMinute: state => {
      if (state.isRunningPaused) {
      } else if (state.startRunningValue >= 70) {
        state.startRunningValue -= 60
      } else {
        state.startRunningValue = 10
      }
    },
    incrementTimerByAmount: (state, action) => {
      state.startRunningValue += action.payload
    },
    startTimer: (state, action) => {
      if (state.isRunningPaused) {
      } else {
        state.value = state.startRunningValue
      }
      state.isRunningPaused = false
      state.isRunning = true
    },
    deductSecond: (state, action) => {
      state.value--
    },
    pause: (state) => {
      state.isRunning = false
      state.isRunningPaused = true
    },
    stop: (state) => {
      state.value = state.startRunningValue
      state.isRunning = false
      state.isRunningPaused = false
      state.mode = modeEnum.GRIND
    },
    finish: (state) => {
      state.value = state.startRestingValue
      state.isRunning = true
      if (state.mode === modeEnum.GRIND) {
        state.mode = modeEnum.REST
      } else {
        state.mode = modeEnum.GRIND
      }
    },
    reset: state => {
      state.startRunningValue = 1500
      state.isRunning = false
      state.isRunningPaused = false
    },
    loadExertionList: (state, action) => {
      const parsed = JSON.parse(action.payload)
      state.exertionList = parsed
      state.loading = false
    }
  }
});

export const fetchAllExertions = () => async dispatch => {
  try {
    const res = await axios.get(
      `/api/exertion/main`
    );
    const exertionDisplay = pomodoroExertionListDisplay(res.data.exertions)
    
    dispatch(loadExertionList(exertionDisplay))
  } catch (err) {
    console.error(err)
  }
}


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

export const selectLoading = state => {
  return state.pomodoro.loading
}

export const selectPomodoroTime = state => {
  if (state.pomodoro.isRunning || state.pomodoro.isResting || state.pomodoro.isRunningPaused || state.pomodoro.isRestingPaused) {
    return state.pomodoro.value
  } else {
    return state.pomodoro.startRunningValue
  }
}

export const selectExertionList = state => state.pomodoro.exertionList

export const selectMode = state => state.pomodoro.mode

export const selectIsRunning = state => state.pomodoro.isRunning

export const selectIsRunningPaused = state => state.pomodoro.isRunningPaused

export const { 
  incrementTimerBySecond, decrementTimerBySecond,
  incrementTimerByMinute, decrementTimerByMinute, 
  reset, deductSecond, stop, startTimer,
  pause, finish,
  loadExertionList
} = pomodoroSlice.actions

export default pomodoroSlice.reducer