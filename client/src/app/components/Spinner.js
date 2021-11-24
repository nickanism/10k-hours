import React from 'react';
import spinner from '../../static/Spinner.gif';

const Spinner = () => {
  // return (
  //   <>
  //     <img 
  //       src={spinner}
  //       alt='Loading...'
  //     />
  //   </>
  // )
  return (
    <article>
      <h3 aria-busy="true">
      fetching the required info...
      </h3>
    </article>
  )
}

export default Spinner