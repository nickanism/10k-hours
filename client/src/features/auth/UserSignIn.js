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
  signinUser,
  selectIsAuthenticated  
} from './authSlice';

const UserSignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const dispatch = useDispatch()
  const isAuthenticated 
    = useSelector(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" />
  }
  
  const { email, password } = formData;

  const onChange = e => setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })

  const onSubmit = async e => {
    e.preventDefault();
    if (!email || !password) {
      dispatch(
        setRemoveAlertAsync(
          "Please enter all your credientials", "danger")
      );
    } else {
      dispatch(
        signinUser({ email, password })
      );
    }
  }

  return (
    <section className="container">
      <h2>Sign In</h2>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="email"
          value={email}
          onChange={onChange}
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="password"
          value={password}
          onChange={onChange}
        />
        <input type="submit" value="Sign In" />
      </form>
    </section>
  );
}

export default connect(
  (state) => state.auth
)(UserSignIn);