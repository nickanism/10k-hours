import React from 'react';
import { Link } from 'react-router-dom';
import { 
  useSelector
} from 'react-redux';

import corgiStudying from '../../static/corgi_studying_masters.jpeg';
import exampleGif_img from '../../static/example-animated.gif';
import { 
  selectIsAuthenticated  
} from '../../features/auth/authSlice';

export const Landing = () => {
  const isAuthenticated 
    = useSelector(selectIsAuthenticated);

  const signUpSignIn = (
    <article className="landingSignUpBlock">
      <h4>
        Sign up for free and master it!
      </h4>
      <div className="container grid">
        <Link role="button" to='/signup'>
          Sign Up
        </Link>
        <Link role="button" to='/signin'>
          Sign In
        </Link>
      </div>
    </article>
  )

  const landingIntroduction = (
    <>
      <article className="grid">
        <div>
          <hgroup>
            <h1>Gamify your training</h1>
            <h3>Honing hard skills can be difficult. After spending long hours grinding and tracking your progress manually on paper, you may find yourself frustrated with the anticlimactic outcome. <br />10K Hours provides a visual tracking system, which makes your hard work a more tangible experience.
            </h3>
          </hgroup>
          <img 
            src={exampleGif_img} alt="example_user_interface" 
          />
          {signUpSignIn}
        </div>
        <div>
          <img 
            src={corgiStudying} alt="studying" 
          />
        </div>
      </article>
    </>
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
      { isAuthenticated ? <h3>Welcome Back!</h3> : 
        landingIntroduction  
      }
    </section>
  )
}