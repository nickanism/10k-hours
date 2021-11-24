import React, { useState, useEffect } from 'react';
import { 
  connect, useDispatch, useSelector
} from 'react-redux';

import { 
  selectExertionList
} from '../exertion/exertionSlice';
import { 
  exertionListValidate,
  exertionOptionList 
} from '../../utils/parseUtils'
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
  const exertionList = useSelector(selectExertionList)
  const [exertionId, setExertionId] = useState()

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

  const mainExertionOptions = (
    <>
      {
        exertionListValidate(exertionList) ?  
        exertionOptionList(exertionList)
        : null
      }
    </>
  )

  const onChange = e => {
    setExertionId(e.target.value)
  }

  const onFinish = async e => {
    e.preventDefault();
    dispatch(pause())
    if (window.confirm(`Would you like to save the progress? ${stopwatchValue} seconds will be submitted as the finished progress.`)) {
      window.alert("hell yeah")
      dispatch(
        sendStopwatchDuration(exertionId, stopwatchValue)
      );
      dispatch(reset())
    } else {
      window.alert("let's grind some more!")
      dispatch(reset())
    }
  }

  return (
    <article className="container">
      <header>
      <h2>Stopwatch</h2>
      <h3>{stopwatchValue}</h3>
      </header>
      <select
          size="1"
          id="exertionId"
          name="exertionId"
          placeholder="Choose Exertion"
          value={exertionId}
          onChange={onChange}
        > 
          <option>Please select</option>
          {mainExertionOptions}
        </select>
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