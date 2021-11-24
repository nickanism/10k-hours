import React from 'react';
import { Link } from 'react-router-dom';
import { 
  useDispatch, useSelector
} from 'react-redux';

import { 
  selectIsAuthenticated, unloadUser  
} from '../../features/auth/authSlice';

export const Navbar = () => {
  const isAuthenticated 
    = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  const logout = () => dispatch(unloadUser())

  const guestLinks = (
    <ul>
      <li><Link to='/signin'>Sign In</Link></li>
      <li><Link to='/signup'>Sign Up</Link></li>
    </ul>
  )

  const authLinks = (
      <ul>
        <li>
          <Link to='/dashboard'>Dashboard</Link>
        </li>
        <li>
          <Link to='/exertions'>Exertions</Link>
        </li>
        <li>
          <Link to='/pomodoro'>Pomodoro</Link>
        </li>
        <li>
          <Link to='/stopwatch'>Stopwatch</Link>
        </li>
        <li>
          <a onClick={logout} href='/signin'>
            Logout
          </a>
        </li>
      </ul>
  )

  return (
    <nav className="container">
      <ul>
        <li>
        <h1>
          <Link to='/'>
          10K Hours
          </Link>
        </h1>
        </li>
      </ul>
      { !isAuthenticated ? guestLinks : authLinks }
    </nav>
  )
}