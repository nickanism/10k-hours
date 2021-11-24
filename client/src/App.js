import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom'

import Navbar from './app/components/Navbar'
import { Landing } from './app/components/Landing'
import { Dashboard } from './app/components/Dashboard'
import PrivateRoute from'./app/routing/PrivateRoute'
import Pomodoro from './features/pomodoro/Pomodoro'
import UserSignUpForm from './features/auth/UserSignUpForm'
import UserSignIn from './features/auth/UserSignIn'
import MainExertionCreateForm from './features/exertion/MainExertionCreateForm';
import PartExertionCreateForm from './features/exertion/PartExertionCreateForm';
import ExertionDisplay from './features/exertion/ExertionDisplay';
import EditExertionForm from './features/exertion/EditExertionForm';
import FinishDuration from './features/exertion/FinishDuration';
import RemoveExertion from './features/exertion/RemoveExertion';
import Stopwatch from './features/stopwatch/Stopwatch';

import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="main">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Landing />
              </>
            }
          />
          <Route
            path="/signup"
            element={
              <>
                <UserSignUpForm />
              </>
            }
          />
          <Route
            path="/signin"
            element={
              <>
                <UserSignIn />
              </>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard></Dashboard>
              </PrivateRoute>
            }
          />
          <Route
            path="/exertions"
            element={
              <section className="container">
              <PrivateRoute>
                <ExertionDisplay></ExertionDisplay>
                <Link to="create-main">
                  Create Main Exertion
                </Link>
                <br />
                <Link to="create-part">
                  Create Part Exertion
                </Link>
                <br />
                <Link to="remove">
                  Remove Exertion
                </Link>
                <br />
                <Link to="finish-duration">
                  Edit Finished Duration
                </Link>
              </PrivateRoute>
              </section>
            }
          >
            <Route 
              path="create-main"
              element={
                <MainExertionCreateForm></MainExertionCreateForm>
              }
            />
            <Route 
              path="create-part"
              element={
                <PartExertionCreateForm></PartExertionCreateForm>
              }
            />
            <Route 
              path="edit"
              element={
                <EditExertionForm></EditExertionForm>
              }
            />
            <Route 
              path="remove"
              element={
                <RemoveExertion></RemoveExertion>
              }
            />
            <Route 
              path="finish-duration"
              element={
                <FinishDuration></FinishDuration>
              }
            />
          </Route>
          <Route
            path="/pomodoro"
            element={
              <PrivateRoute>
                <Pomodoro />
              </PrivateRoute>
            }
          />
          <Route
            path="/stopwatch"
            element={
              <PrivateRoute>
                <Stopwatch></Stopwatch>
              </PrivateRoute>
            }
          >
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;