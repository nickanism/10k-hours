import React, { useState, useEffect } from 'react';
import { 
  connect, useDispatch, useSelector
} from 'react-redux';

import { 
  removeExertion, 
  selectExertionList,
  fetchAllExertions 
} from './exertionSlice';
import { 
  exertionListValidate,
  exertionOptionList 
} from '../../utils/parseUtils'

const RemoveExertion = () => {
  const exertionList = useSelector(selectExertionList)
  const [exertionId, setExertionId] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllExertions())
  }, [dispatch])

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

  const onSubmit = async e => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to permanently remove this exertion? All the child exertions under it will also be removed.")) {
      dispatch(
        removeExertion(exertionId)
      );
    }
  }

  return (
    <section>
      <h2>Remove Exertion</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="exertionId">
          Choose Exertion to Remove:
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
        <br/>
        <input type="submit" value="Remove" />
      </form>
    </section>
  );
}

export default connect(
  (state) => state.exertion
)(RemoveExertion);