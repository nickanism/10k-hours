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
    <section className="container">
      <h1>Landing Page</h1>
      { isAuthenticated ? <h3>Welcome Back!</h3> : signUpSignIn }
      <img 
        src={cookieThePom} alt="studying" 
      />
    </section>
  )
}