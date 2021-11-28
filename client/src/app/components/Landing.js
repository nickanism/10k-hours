import React from 'react';
import { Link } from 'react-router-dom';
import { 
  useSelector
} from 'react-redux';

import cookieThePom from '../../static/cookie-the-pom.jpg';
import corgiStudying from '../../static/corgi_studying_masters.jpeg';
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
      <div className="container grid">
        <Link role="button" to='/signup'>
          Sign Up
        </Link>
        <Link role="button" to='/signin'>
          Sign In
        </Link>
      </div>
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
      <h1>Embark on a journey to mastery</h1>
      { isAuthenticated ? <h3>Welcome!</h3> : signUpSignIn }
      <img 
        src={corgiStudying} alt="studying" 
      />
    </section>
  )
}