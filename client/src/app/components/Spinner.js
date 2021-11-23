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
  return <article aria-busy="true">fetching your exertion list...</article>
}

export default Spinner