import React, { useState, useEffect } from 'react';
import { 
  connect, useDispatch, useSelector
} from 'react-redux';

import { 
  selectExertionList, 
  operateFinishedDuration
} from '../exertion/exertionSlice';
import {
  sendStopwatchDuration,
  increateStopwatchValue,
  selectValue,
  selectIsRunning,
  selectIsPaused,
  startStopwatch, pause, reset
} from './stopwatchSlice';

const Stopwatch = () => {
  const stopwatchValue = useSelector(selectValue)
  const stopwatchIsRunning = useSelector(selectIsRunning)
  const stopwatchIsPaused = useSelector(selectIsPaused)

  const dispatch = useDispatch()
  useEffect(() => {
    let interval = null;
    if (stopwatchIsPaused) {
      return clearInterval(interval);
    }
    if (stopwatchIsRunning) {
      interval = setInterval(() => {
        dispatch(increateStopwatchValue());
      }, 1000);
    } 
    return function cleanup() {
      clearInterval(interval);
    }
  }, [stopwatchValue, stopwatchIsRunning, stopwatchIsPaused])

  const onFinish = async e => {
    e.preventDefault();
    dispatch(pause())
    if (window.confirm(`Would you like to save the progress? ${stopwatchValue} seconds will be submitted as the finished progress.`)) {
      window.alert("hell yeah")
      // dispatch(
      //   operateFinishedDuration()
      // );
      dispatch(reset())
    } else {
      window.alert("let's grind some more!")
      dispatch(reset())
    }
    // dispatch(
    //   operateFinishedDuration()
    // );
  }

  return (
    <article className="container">
      <header>
      <h2>Stopwatch</h2>
      <h3>{stopwatchValue}</h3>
      </header>
        <br />
        <div className="grid">
        <button 
          disabled={stopwatchIsRunning} 
          onClick={() => {dispatch(startStopwatch())}}>START</button>
        <button 
          disabled={!stopwatchIsRunning || !stopwatchValue} 
          onClick={() => {dispatch(pause())}}>
            PAUSE
        </button>
        <button disabled={!stopwatchIsPaused} onClick={() => (dispatch(reset()))}>STOP & RESET</button>
        <button disabled={!stopwatchValue} onClick={onFinish}>FINISH</button>
        </div>
    </article>
  );
}

export default connect(
  (state) => {
    return {
      stopwatch: state.stopwatch,
      exertion: state.exertion 
    }
  }
)(Stopwatch);