import React from 'react';
import { Link } from 'react-router-dom';
import { 
  useSelector
} from 'react-redux';

import cookieThePom from '../../static/cookie-the-pom.jpg';
import { 
  selectIsAuthenticated  
} from '../../features/auth/authSlice';

export const Landing = () => {
  const isAuthenticated 
    = useSelector(selectIsAuthenticated);

  const signUpSignIn = (
    <section>
      <h2>
        You can create your exertion by signing up!
      </h2>
      <button>
        <Link to='/signup'>
          Sign Up
        </Link>
      </button>
      &nbsp;
      <button>
        <Link to='/signin'>
          Sign In
        </Link>
      </button>
    </section>
  )

  const goToDashboard = (
    <section>
      <button>
        <Link to='/dashboard'>
          Dashboard
        </Link>
      </button>
    </section>
  )

  return (
    <div>
      <h1>This is the landing page</h1>
      { isAuthenticated ? goToDashboard : signUpSignIn }
      <img 
        src={cookieThePom} alt="studying"
        style={{ width: '100%', margin: 'auto', display: 'block' }} 
      />
    </div>
  )
}