import React, { useState, useEffect } from 'react';
import { 
  connect, useDispatch, useSelector
} from 'react-redux';

import { 
  createPartExertion, 
  selectExertionList,
  fetchAllExertions 
} from './exertionSlice';
import { 
  exertionListValidate,
  exertionOptionList 
} from '../../utils/parseUtils'

const PartExertionCreateForm = () => {
  const exertionList = useSelector(selectExertionList)
  const [formData, setFormData] = useState({
    parentExertionId: '',
    name: '',
    skill: '',
    targetHours: 0
  });
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllExertions())
  }, [dispatch])
  
  let { parentExertionId, name, skill, targetHours } = formData;

  const mainExertionOptions = (
    <>
      {
        exertionListValidate(exertionList) ?  
        exertionOptionList(exertionList)
        : null
      }
    </>
  )  

  const onChange = e => setFormData({
    ...formData,
    [e.target.name]: e.target.value
  })

  const onSubmit = async e => {
    e.preventDefault();
    if (typeof targetHours !== Number) {
      targetHours = parseInt(targetHours)
    }
    dispatch(
      createPartExertion({ parentExertionId, name, skill, targetHours })
    );
  }

  return (
    <section>
      <h2>Create Part Exertion</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="parentExertionId">
          Choose Main Exertion:
        </label>
        <select
          size="1"
          id="parentExertionId"
          name="parentExertionId"
          placeholder="Please select"
          value={parentExertionId}
          onChange={onChange}
        >
          <option>Please Select</option>
          {mainExertionOptions}
        </select>
        <br/>
        <label htmlFor="name">Exertion Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={onChange}
        />
        <br/>
        <label htmlFor="skill">Skill:</label>
        <input
          type="text"
          id="skill"
          name="skill"
          value={skill}
          onChange={onChange}
        />
        <br/>
        <label htmlFor="targetHours">Target Hours:</label>
        <input
          type="number"
          min="1" max="20000"
          id="targetHours"
          name="targetHours"
          value={targetHours}
          onChange={onChange}
        />
        <br/>
        <input type="submit" value="Create Exertion" />
      </form>
    </section>
  );
}

export default connect(
  (state) => state.exertion
)(PartExertionCreateForm);