import React, { useState, useEffect } from 'react';
import { 
  connect, useDispatch, useSelector
} from 'react-redux';

import { 
  selectExertionList,
  fetchAllExertions
} from '../exertion/exertionSlice';
import { secondsToHMS } from '../../utils/timeUtils';
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
    dispatch(fetchAllExertions())
  }, [])

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
  }, [dispatch, stopwatchValue, stopwatchIsRunning, stopwatchIsPaused])

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
    if (window.confirm(`Would you like to save the progress? ${secondsToHMS(stopwatchValue)} will be submitted as the finished progress.`)) {
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
      <header className="stopwatchBoard">
        <h2>Stopwatch</h2>
        
      </header>
      <h2>{secondsToHMS(stopwatchValue)}</h2>
      <section className="stopwatchExertionSelection">
        <select
          size="1"
          id="exertionId"
          name="exertionId"
          placeholder="Choose Exertion"
          disabled={!exertionList}
          value={exertionId}
          onChange={onChange}
        > 
          <option>{!exertionList ? "fetching..." : "Please select"}</option>
          {mainExertionOptions}
        </select>
      </section>
      <footer>
        <div className="grid">
          &nbsp;
          <button 
            disabled={stopwatchIsRunning || !exertionId} 
            onClick={() => {dispatch(startStopwatch())}}>START</button>
          <button 
            disabled={!stopwatchIsRunning || !stopwatchValue} 
            onClick={() => {dispatch(pause())}}>
              PAUSE
          </button>
          <button disabled={!stopwatchIsPaused} onClick={() => (dispatch(reset()))}>STOP & RESET</button>
          <button disabled={!stopwatchValue} onClick={onFinish}>FINISH</button>
          &nbsp;
        </div>
      </footer>
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