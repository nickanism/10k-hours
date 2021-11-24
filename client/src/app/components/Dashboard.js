import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  useSelector, useDispatch
} from 'react-redux';

import Spinner from './Spinner';
import { 
  fetchUserInfo, selectUserBasicInfo 
} from '../../features/auth/authSlice';
import { 
  selectExertionList, selectTotalTargetHoursLeft,
  fetchAllExertions, selectLoading, selectTotalTargetHours, 
  selectTotalFinishedHours 
} from '../../features/exertion/exertionSlice';

export const Dashboard = () => {
  const exertionList = useSelector(selectExertionList)
  const loading = useSelector(selectLoading)
  const userBasicInfo = useSelector(selectUserBasicInfo)
  const totalTargetHoursLeft = useSelector(selectTotalTargetHoursLeft)
  const totalTargetHours = useSelector(selectTotalTargetHours)
  const totalFinishedHours = useSelector(selectTotalFinishedHours)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchAllExertions())
    dispatch(fetchUserInfo())
  }, [])

  const showTotalFinishedHours = (
      totalFinishedHours && !loading ? 
      <h1>total finished hours: {totalFinishedHours}</h1> : 
      <Spinner></Spinner>
  )

  const totalProgressBar = (
    <>
      <label forttml="finishedHoursProgress">
        <hgroup>
        {
          !loading ? 
          <h4>total progress: {totalFinishedHours} / {totalTargetHours} hours </h4> :
          <h4>loading...</h4>
        }
        {!loading ? <h5>{totalTargetHoursLeft} more hours to go</h5> : 
        null
        }
        </hgroup>
      </label>
      <progress 
        id="finishedHoursProgress"
        value={totalFinishedHours} max={totalTargetHours}>
      </progress>
    </>
  )

  const showUserBasicInfo = (
    <>
      <hgroup>
        <h4>{!loading && userBasicInfo ? (<>{userBasicInfo.email}</>) : null}</h4>
        <h5>
          {
            !loading && userBasicInfo ? 
            `level ${userBasicInfo.level}` : null
          }
        </h5>
      </hgroup>
    </>
  )

  return (
    <section className="container">
      <h1>Dashboard</h1>
        <article>
        <header>
          {totalProgressBar}
        </header>
          {showUserBasicInfo}
        </article>
    </section>
  )
}