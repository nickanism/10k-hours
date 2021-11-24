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
  return <article aria-busy="true">fetching the required info...</article>
}

export default Spinner