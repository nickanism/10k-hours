import React, { useState, useEffect } from 'react';
import { 
  connect, useDispatch, useSelector
} from 'react-redux';

import { 
  editExertion, 
  selectExertionList,
  fetchAllExertions 
} from './exertionSlice';
import { 
  exertionListValidate,
  exertionOptionList 
} from '../../utils/parseUtils'

const EditExertionForm = () => {
  const exertionList = useSelector(selectExertionList)
  const [formData, setFormData] = useState({
    exertionId: '',
    skill: '',
    name: '',
    targetHours: ''
  });
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllExertions())
  }, [dispatch])
  
  let { exertionId, skill, name, targetHours } = formData;

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
    let newData = Object.assign(formData, {})
    Object.keys(newData).forEach(key => {
      if (newData[key] === '') {
        delete newData[key]
      }
    })
    setFormData(newData)
    dispatch(
      editExertion(formData)
    );
  }

  return (
    <section>
      <h2>Edit Exertion</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="exertionId">
          Choose Exertion to Edit:
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
        <label htmlFor="name">New Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={onChange}
        />
        <br/>
        <label htmlFor="skill">New Skill:</label>
        <input
          type="text"
          id="skill"
          name="skill"
          value={skill}
          onChange={onChange}
        />
        <br/>
        <label htmlFor="targetHours">New Target Hours:</label>
        <input
          type="number"
          min="1" max="20000"
          id="targetHours"
          name="targetHours"
          value={targetHours}
          onChange={onChange}
        />
        <br/>
        <input type="submit" value="Edit Exertion" />
      </form>
    </section>
  );
}

export default connect(
  (state) => state.exertion
)(EditExertionForm);