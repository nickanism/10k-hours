import React, { useState, useEffect, useRef } from 'react';
import { 
  connect, useDispatch, useSelector
} from 'react-redux';

import { 
  createPartExertion, 
  selectExertionList,
  fetchAllExertions,
  updating 
} from './exertionSlice';
import { 
  exertionListValidate,
  exertionOptionList 
} from '../../utils/parseUtils'
import { findExertionDurationLeft } from '../../utils/timeUtils';

const PartExertionCreateForm = () => {
  const exertionList = useSelector(selectExertionList)
  const [formData, setFormData] = useState({
    parentExertionId: '',
    name: '',
    skill: '',
    targetHours: ''
  });
  const [availableHours, setAvailableHours] = useState()
  const dispatch = useDispatch()
  let outputRef = useRef(null)

  useEffect(() => {
    dispatch(fetchAllExertions())
  }, [dispatch])
  
  let { parentExertionId, name, skill, targetHours } = formData;

  useEffect(() => {
    if (exertionList) {
      setAvailableHours(findExertionDurationLeft(parentExertionId, exertionList))
    }
  }, [parentExertionId])

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
    dispatch(updating());
    setFormData({
      parentExertionId: '',
      name: '',
      skill: '',
      targetHours: ''
    })
  }

  return (
    <section className="container">
      <h2>Create Part Exertion</h2>
      <form onSubmit={onSubmit}>
        <select
          size="1"
          id="parentExertionId"
          name="parentExertionId"
          value={parentExertionId}
          onChange={onChange}
          required
        >
          <option>Select Main Exertion</option>
          {mainExertionOptions}
        </select>
        <br/>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={onChange}
          placeholder="Exertion Name"
          required
        />
        <br/>
        <div className="grid">
        <input
          type="text"
          id="skill"
          name="skill"
          value={skill}
          onChange={onChange}
          placeholder="Skill"
          required
        />
          <div>
            <input
              type="range"
              min="1" max={availableHours}
              id="targetHours"
              name="targetHours"
              data-tooltip={targetHours}
              value={targetHours}
              onChange={onChange}
              onInput={outputRef=targetHours.value}
              placeholder="Target Hours"
              disabled={!parentExertionId}
              required
            />
            <output id="amount" name="amount" htmlFor="rangeInput">
              {targetHours || "target hours"}
            </output>
          </div>
        </div>
        <input type="submit" ref={outputRef} value="Create Exertion" />
      </form>
    </section>
  );
}

export default connect(
  (state) => state.exertion
)(PartExertionCreateForm);