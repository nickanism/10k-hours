import React, { useState } from 'react';
import { 
  connect, useDispatch
} from 'react-redux';

import { createExertion } from './exertionSlicer';
import { 
  setRemoveAlertAsync 
} from '../alert/alertSlice';



const MainExertionCreateForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    skill: '',
    targetHours: 0
  });
  const dispatch = useDispatch()
  
  let { name, skill, targetHours } = formData;

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
      createExertion({ name, skill, targetHours })
    );
  }

  return (
    <section>
      <h2>Create Main Exertion</h2>
      <form onSubmit={onSubmit}>
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
)(MainExertionCreateForm);