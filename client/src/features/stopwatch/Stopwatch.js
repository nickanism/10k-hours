import React, { useState, useEffect } from 'react';
import { 
  connect, useDispatch, useSelector
} from 'react-redux';

import { 
  fetchAllExertions, selectExertionList, 
  operateFinishedDuration
} from '../exertion/exertionSlice';
import {
  sendStopwatchDuration
} from './stopwatchSlice';
import { 
  exertionListValidate,
  exertionOptionList 
} from '../../utils/parseUtils'

const Stopwatch = () => {
  const exertionList = useSelector(selectExertionList)
  const [formData, setFormData] = useState({
    exertionId: '',
    operationType: 'addition',
    payload: ''
  });
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllExertions())
  }, [dispatch])
  
  let { exertionId, operationType, payload } = formData;

  const mainExertionOptions = (
    <>
      {
        exertionListValidate(exertionList) ?  
        exertionOptionList(exertionList, exertionId)
        : null
      }
    </>
  )  

  const onChange = e => {
    setFormData(
      {
        ...formData,
        [e.target.name]: e.target.value
      }
    )
  }

  const onSubmit = async e => {
    e.preventDefault();
    dispatch(
      operateFinishedDuration(formData)
    );
  }

  return (
    <section>
      <h2>Stopwatch</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="exertionId">
          Choose Exertion:
        </label>
        <select
          size="1"
          id="exertionId"
          name="exertionId"
          value={exertionId}
          onChange={onChange}
        > 
          <option>Please select</option>
          {mainExertionOptions}
        </select>
        <input type="submit" value="Finish" />
      </form>
    </section>
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