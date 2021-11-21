import React from 'react';
import spinner from '../../static/Spinner.gif';

const Spinner = () => {
  return (
    <>
      <img 
        src={spinner}
        style={{ width: '221px', margin: 'auto', display: 'block' }} 
        alt='Loading...'
      />
    </>
  )
}

export default Spinner