import React, { useEffect } from 'react';
import { 
  connect, useDispatch, useSelector
} from 'react-redux';

import { 
  selectExertionList, selectTotalTargetHoursLeft,
  fetchAllExertions, selectLoading 
} from './exertionSlicer';
import { 
  exertionListParsing 
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
      {
        (exertionList && !loading) ? exertionListParsing(exertionList) : 
        <Spinner></Spinner>
      }
      <br />
      total target hours: {totalTargetHoursLeft}
    </div>
  )

  return (
    <>
      {exertionListDisplay}
    </>
  )

}

export default connect(
  (state) => state.exertion
)(ExertionDisplay);