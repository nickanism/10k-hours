import React, { useState } from 'react';
import { 
  connect, useDispatch, useSelector
} from 'react-redux';
import { 
  Navigate
} from 'react-router-dom';

import { 
  setRemoveAlertAsync 
} from '../alert/alertSlice';
import { 
  signupUser,
  selectIsAuthenticated  
} from './authSlice';

const UserSignUpForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password2: ''
  });
  const dispatch = useDispatch()
  const isAuthenticated 
    = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" />
  }
  
  const { email, password, password2 } = formData;

  const onChange = e => setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      dispatch(
        setRemoveAlertAsync("Passwords do not match", "danger")
      );
    } else {
      dispatch(
        signupUser({ email, password })
      );
    }
  }

  return (
    <section>
      <h2>Sign Up</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={onChange}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={onChange}
        />
        <label htmlFor="password2">Confirm Password:</label>
        <input
          type="password"
          id="password2"
          name="password2"
          value={password2}
          onChange={onChange}
        />
        <input type="submit" value="Sign Up" />
      </form>
    </section>
  );
}

export default connect(
  (state) => state.auth
)(UserSignUpForm);