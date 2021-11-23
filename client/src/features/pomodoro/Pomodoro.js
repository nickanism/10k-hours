import React, {
  useEffect
} from 'react'
import { connect, 
  useSelector, useDispatch 
} from 'react-redux';

import Spinner from '../../app/components/Spinner';
import {
  selectLoading,
  fetchAllExertions,
  selectMode,
  decrementTimerBySecond,incrementTimerBySecond,
  incrementTimerByMinute, decrementTimerByMinute,
  finish, 
  reset,
  pause,
  deductSecond,
  startTimer,
  stop, 
  selectIsRunning, selectIsRunningPaused,
  selectPomodoroTime, selectExertionList
} from './pomodoroSlice';
import {
  secondsToMinutes, playSound
} from '../../utils/timeUtils';
import { 
  exertionUnorderedListParsing 
} from '../../utils/parseUtils'

const Pomodoro = () => {
  const isLoading = useSelector(selectLoading);
  const timerMode = useSelector(selectMode);
  const timerCount = useSelector(selectPomodoroTime);
  const isRunning = useSelector(selectIsRunning);
  const isRunningPaused = useSelector(selectIsRunningPaused)
  const exertionList = useSelector(selectExertionList)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllExertions())
  }, [dispatch])

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
    } else if (isRunning && timerCount === 0) {
      playSound();
      dispatch(finish())
    }
    return function cleanup() {
      clearInterval(interval);
    }
  }, [dispatch, timerMode, isRunning, isRunningPaused, timerCount]);

  const exertionListDisplay = (
    <div>
      {exertionUnorderedListParsing(exertionList)}
    </div>
  )

  const modeDisplay = (
    <div>
      <h2>
        {timerMode.toUpperCase()}
      </h2>
    </div>
  )

  const timeDisplay = (
    <span>
      &nbsp;
        <h2>
          {secondsToMinutes(timerCount)}
        </h2>
      &nbsp;
    </span>
  )

  const startTimerButton = (
    <div>
      <button
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
    <main class="container">
      <div>
        {isLoading ? <Spinner></Spinner> : exertionListDisplay}
        &nbsp;
        <article>
        {modeDisplay}
        {timeDisplay}
        <div className="grid">
        {timerDecrementButtons}
        <h2>Adjust Pomodoro</h2>
        {timerIncrementButtons}
        </div>
        <div className="grid">
        {!isRunning ? startTimerButton : null}
        {isRunning ? pauseTimerButton : null}
        <button
          disabled={!isRunning && isRunningPaused}
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
      </div>
    </main>
  )
}

export default connect(
  (state) => state.pomodoro
)(Pomodoro);