import React, { useEffect } from 'react';
import { 
  connect, useDispatch, useSelector
} from 'react-redux';
import { Outlet } from 'react-router-dom'

import { 
  selectExertionList, selectTotalTargetHoursLeft,
  fetchAllExertions, selectLoading 
} from './exertionSlicer';
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
    <div>
      <h1> Your Exertoins </h1>
      {
        (exertionList && !loading) ? exertionUnorderedListParsing(exertionList) : 
        <Spinner></Spinner>
      }
      <br />
      total target hours: {totalTargetHoursLeft}
    </div>
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