import { 
  createSlice
} from '@reduxjs/toolkit';
import axios from 'axios';

import setAuthToken from '../../utils/setAuthToken'

const initialState = {
  isAuthenticated: Boolean(localStorage.getItem('token'))
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
    unloadUser: (state, action) => {
      localStorage.removeItem('token')
      state.isAuthenticated = false
      state.loading = true
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

export const selectIsAuthenticated 
  = state => state.auth.isAuthenticated;

export const { register, loadUser, 
  login, unloadUser 
} = authSlice.actions;

export default authSlice.reducer;