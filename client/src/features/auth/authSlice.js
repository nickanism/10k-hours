import { 
  createSlice
} from '@reduxjs/toolkit';
import axios from 'axios';

import setAuthToken from '../../utils/setAuthToken'

const initialState = {
  isAuthenticated: Boolean(localStorage.getItem('token')),
  loading: null,
  darkModeOn: false,
  userBasicInfo: null
}

initialState.loading = !initialState.isAuthenticated

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    register: (state, action) => {
      localStorage.setItem('token', action.payload.token)
      state.isAuthenticated = true
      state.loading = false
    },
    login: (state, action) => {
      localStorage.setItem('token', action.payload.token)
      state.isAuthenticated = true
      state.loading = false
    },
    loadUser: (state, action) => {
      setAuthToken(localStorage.token)
      state.isAuthenticated = true
      state.loading = false
    },
    loadUserBasicInfo: (state, action) => {
      state.userBasicInfo = action.payload
    },
    unloadUser: (state, action) => {
      localStorage.removeItem('token')
      state.isAuthenticated = false
      state.loading = true
    },
    toggleDarkMode: (state, action) => {
      state.darkModeOn = action.payload
    }
  }
});

export const signupUser = ({ email, password }) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const body = JSON.stringify({ email, password });
    const res = await axios.post(
      '/api/user/register', 
      body,
      config
    );
    if (res.status === 200) {
      dispatch(register(res.data));
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

export const signinUser = ({ email, password }) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const body = JSON.stringify({ email, password });
    const res = await axios.post(
      '/api/auth/signin', 
      body,
      config
    );
    if (res.status === 200) {
      dispatch(login(res.data));
      dispatch(loadUser());
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

export const fetchUserInfo = () => async dispatch => {
  const res = await axios.get('api/auth')
  if (res.status === 200) {
    dispatch(loadUserBasicInfo(res.data));
  } else {
    alert(res.data)
  }
}

export const selectIsAuthenticated 
  = state => state.auth.isAuthenticated;

export const selectUserBasicInfo
  = state => state.auth.userBasicInfo;

export const selectDarkModeOn
  = state => state.auth.darkModeOn;

export const { register, loadUser, 
  login, unloadUser, loadUserBasicInfo, toggleDarkMode
} = authSlice.actions;

export default authSlice.reducer;