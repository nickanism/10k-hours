import React, {
  useEffect, useState
} from 'react'
import { connect, 
  useSelector, useDispatch 
} from 'react-redux';

import Spinner from '../../app/components/Spinner';
import {
  selectMode,
  decrementTimerBySecond,incrementTimerBySecond,
  incrementTimerByMinute, decrementTimerByMinute,
  finish, finishDuration,
  reset,
  pause,
  deductSecond,
  startTimer,
  stop, 
  selectIsRunning, selectIsRunningPaused,
  selectPomodoroTime, selectStartRunningValue
} from './pomodoroSlice';
import { 
  selectExertionList, 
  fetchAllExertions,
  selectLoading
} from '../exertion/exertionSlice'
import {
  secondsToMinutes, playSound
} from '../../utils/timeUtils';
import { 
  exertionUnorderedListParsing,
  exertionListValidate,
  exertionOptionList  
} from '../../utils/parseUtils'

const Pomodoro = () => {
  const isLoading = useSelector(selectLoading);
  const timerMode = useSelector(selectMode);
  const timerCount = useSelector(selectPomodoroTime);
  const isRunning = useSelector(selectIsRunning);
  const isRunningPaused = useSelector(selectIsRunningPaused)
  const exertionList = useSelector(selectExertionList)
  const startRunningValue = useSelector(selectStartRunningValue)
  const [exertionId, setExertionId] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllExertions())
  }, [])

  useEffect(() => {
    let interval = null;
    if (isRunningPaused) {
      return
    }
    if ((isRunning) && timerCount !== 0) {
      interval = setInterval(() => {
        dispatch(deductSecond());
      }, 1000);
    } else if (!isRunning && timerCount !== 0) {
      clearInterval(interval);
    } else if (isRunning && timerCount === 0 && timerMode === "grind") {
      playSound();
      dispatch(finishDuration({exertionId, startRunningValue}))
      dispatch(finish())
    }
    return function cleanup() {
      clearInterval(interval);
    }
  }, [dispatch, timerMode, isRunning, isRunningPaused, timerCount]);

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

  const exertionListDisplay = (
    <div>
      {exertionUnorderedListParsing(exertionList)}
    </div>
  )

  const modeDisplay = (
    <div>
      <h3>
        {timerMode.toUpperCase()}
      </h3>
    </div>
  )

  const timeDisplay = (
    <h1>
      {secondsToMinutes(timerCount)}
    </h1>
  )

  const startTimerButton = (
    <div>
      <button
        disabled={!exertionId}
        onClick={() => dispatch(startTimer())}
      >
        {timerMode === "grind" ? "START GRIND" : 
        "START REST"}
      </button>
    </div>
  )

  const pauseTimerButton = (
    <div>
      <button
        onClick={() => dispatch(pause())}
      >
        PAUSE
      </button>
    </div>
  )

  const timerIncrementButtons = (
    <div>
      <button
        className="secondary"
        disabled={isRunning}
        aria-label="Increment value"
        onClick={() => dispatch(incrementTimerBySecond())}
      >
        + 10 sec
      </button>
      <button
        className="secondary"
        disabled={isRunning}
        aria-label="Increment value"
        onClick={() => dispatch(incrementTimerByMinute())}
      >
        + 1 min
      </button>
    </div>
  )
  const timerDecrementButtons = (
    <div>
      <button
        className="secondary"
        disabled={isRunning}
        aria-label="Decrement value"
        onClick={() => dispatch(
            decrementTimerBySecond()
          )
        }
      >
        - 10 sec
      </button>
      <button
        className="secondary"
        disabled={isRunning}
        aria-label="Decrement value"
        onClick={() => dispatch(
            decrementTimerByMinute()
          )
        }
      >
        - 1 min
      </button>
    </div>
  )

  return (
    <main className="container">
      <div>
        <article>
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
          <div className="pomodoroTimerDisplay">
            {modeDisplay}
            {timeDisplay}
          </div>
          <div className="grid">
            {timerDecrementButtons}
            <div className="pomodoroAdjustSignpost">
              <p>Adjust Pomodoro</p>
            </div>
            {timerIncrementButtons}
          </div>
          <div className="grid">
            {!isRunning ? startTimerButton : null}
            {isRunning ? pauseTimerButton : null}
            <button
              disabled={(!isRunning && isRunningPaused) || !exertionId}
              onClick={() => dispatch(stop())}
            >
              STOP
            </button>
            <button
              onClick={() => dispatch(reset())}
            >
              RESET TO 25 MIN
            </button>
          </div>
        </article>
        <article>
        {isLoading ? <Spinner></Spinner> : exertionListDisplay}
        </article>
      </div>
    </main>
  )
}

export default connect(
  (state) => {
    return {
      pomodoro: state.pomodoro,
      exertion: state.exertion
    }
  }
)(Pomodoro);