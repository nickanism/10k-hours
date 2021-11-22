import React, { useState, useEffect } from 'react';
import { 
  connect, useDispatch, useSelector
} from 'react-redux';

import { 
  operateFinishedDuration, 
  selectExertionList,
  fetchAllExertions, updating 
} from './exertionSlicer';
import { 
  exertionListValidate,
  exertionOptionList 
} from '../../utils/parseUtils'

const FinishDuration = () => {
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
    dispatch(updating());
    dispatch(
      operateFinishedDuration(formData)
    );
  }

  return (
    <section>
      <h2>Edit Exertion</h2>
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
        <br/>
        <label htmlFor="operationType">Add or Deduct?:</label>
        <select
         size="1"
         id="operationType"
         name="operationType"
         value={operationType}
         onChange={onChange}
         required
        >
          <option key="addition" value="addition" >
            Add
          </option>
          <option key="subtraction" value="subtraction">Deduct</option>
        </select>
        <br/>
        <label htmlFor="payload">Number of Hours:</label>
        <input
          type="number"
          min="1" max="20000"
          id="payload"
          name="payload"
          value={payload}
          onChange={onChange}
          required
        />
        <br/>
        {/* <label htmlFor="payloadMinutes">Number of Minutes:</label>
        <input
          type="number"
          min="1" max="20000"
          id="payloadMinutes"
          name="payloadMinutes"
          value={payloadMinutes}
          onChange={onChange}
        /> */}
        <br/>
        <input type="submit" value="Finish" />
      </form>
    </section>
  );
}

export default connect(
  (state) => state.exertion
)(FinishDuration);