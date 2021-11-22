import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom'

import { Navbar } from './app/components/Navbar'
import { Landing } from './app/components/Landing'
import PrivateRoute from'./app/routing/PrivateRoute'
import Pomodoro from './features/pomodoro/Pomodoro'
import UserSignUpForm from './features/auth/UserSignUpForm'
import UserSignIn from './features/auth/UserSignIn'
import MainExertionCreateForm from './features/exertion/MainExertionCreateForm';
import PartExertionCreateForm from './features/exertion/PartExertionCreateForm';
import ExertionDisplay from './features/exertion/ExertionDisplay';
import EditExertionForm from './features/exertion/EditExertionForm';
import FinishDuration from './features/exertion/FinishDuration';

// Style
import './App.css';
import React from 'react';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div>
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
                <h1>Super Private DashBoard</h1>
              </PrivateRoute>
            }
          />
          <Route
            path="/exertions"
            element={
              <PrivateRoute>
                <ExertionDisplay></ExertionDisplay>
                <Link to="create-main">
                  Create Main Exertion
                </Link>
                <br />
                <Link to="create-part">
                  Create Part Exertion
                </Link>
              </PrivateRoute>
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
                <h1>Pomodoro</h1>
                <Pomodoro />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;