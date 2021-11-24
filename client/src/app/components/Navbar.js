import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  connect, useDispatch, useSelector
} from 'react-redux';

import { 
  selectIsAuthenticated, unloadUser,
  selectDarkModeOn, toggleDarkMode
} from '../../features/auth/authSlice';

const Navbar = () => {
  const isAuthenticated 
    = useSelector(selectIsAuthenticated);
  const darkModeOn = useSelector(selectDarkModeOn)
  const dispatch = useDispatch();

  const logout = () => dispatch(unloadUser())
    if (darkModeOn) {
      document.firstElementChild.dataset.theme = "dark"
    } else {
      document.firstElementChild.dataset.theme = "light"
    }
  useEffect(() => {

  }, [darkModeOn])

  const renderDarkModeSelection = e => {
    dispatch(toggleDarkMode(!darkModeOn));
  }

  const darkModeSwitch = (
    <li>
      <label htmlFor="darkModeSwitch">dark mode</label>
      <input 
        type="checkbox" id="darkModeSwitch" placeholder="dark mode"
        name="darkModeSwitch" role="switch" 
        onChange={renderDarkModeSelection}
      >
      </input>
    </li>
)

  const guestLinks = (
    <ul>
      <li><Link to='/signin'>Sign In</Link></li>
      <li><Link to='/signup'>Sign Up</Link></li>
      {darkModeSwitch}
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
        {darkModeSwitch}
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

export default connect(
  (state) => state.auth
)(Navbar)