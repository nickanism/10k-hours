import React, { useEffect } from 'react';
import { 
  connect, useDispatch, useSelector
} from 'react-redux';
import { Outlet, Link } from 'react-router-dom'

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

  const reportEmptyExertionList = (
      <hgroup>
        <h3>There is no exertion</h3>
        <h3>You can create a new exertion <Link to="create-main">here</Link></h3>
      </hgroup>
  )

  const totalTargetHoursDisplay = (
    <>total target hours: <strong>{totalTargetHoursLeft}</strong></>
  )

  const exertionListDisplay = (
    <section className="container">
      <div className="exertionDisplayHeader">
        <h1> Your Exertions </h1>
      </div>
      {
        (exertionList && !loading) ? 
        <article>
          {
            exertionList.length ? 
            exertionUnorderedListParsing(exertionList) :
            reportEmptyExertionList
          }
          {(exertionList && !loading) ? totalTargetHoursDisplay : null}
        </article> : 
        <Spinner></Spinner>
      }
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