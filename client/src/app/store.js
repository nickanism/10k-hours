import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import counterReducer from '../features/counter/counterSlice';
import authReducer from '../features/auth/authSlice';
import alertReducer from '../features/alert/alertSlice';
import pomodoroReducer from '../features/pomodoro/pomodoroSlice';
import exertionReducer from '../features/exertion/exertionSlicer';

export default configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    alert: alertReducer,
    pomodoro: pomodoroReducer,
    exertion: exertionReducer
  },
  middleware: [thunk]
});