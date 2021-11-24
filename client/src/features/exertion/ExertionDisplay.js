import React, { useEffect } from 'react';
import { 
  connect, useDispatch, useSelector
} from 'react-redux';
import { Outlet } from 'react-router-dom'

import { 
  selectExertionList, selectTotalTargetHoursLeft,
  fetchAllExertions, selectLoading 
} from './exertionSlice';
import { 
  exertionUnorderedListParsing 
} from '../../utils/parseUtils'
import Spinner from '../../app/components/Spinner';


const ExertionDisplay = () => {
  const exertionList = useSelector(selectExertionList)
  const loading = useSelector(selectLoading)
  const totalTargetHoursLeft = useSelector(selectTotalTargetHoursLeft)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllExertions())
  }, [dispatch])

  const exertionListDisplay = (
    <section className="container">
      <div className="exertionDisplayHeader">
        <h1></h1>
        <h1> Your Exertions </h1>
      </div>
      {
        (exertionList && !loading) ? 
        <article>{exertionUnorderedListParsing(exertionList)}</article> : 
        <Spinner></Spinner>
      }
      <br />
      total target hours: <strong>{totalTargetHoursLeft}</strong>
    </section>
  )

  return (
    <>
      {exertionListDisplay}
      <Outlet />
    </>
  )

}

export default connect(
  (state) => state.exertion
)(ExertionDisplay);