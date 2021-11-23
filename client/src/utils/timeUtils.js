import fantasy_fairy from "../static/fantasy_fairy.mp3";

const prependZero = n => {
  n = String(n)
  if (n.length === 1)
    n = '0' + n
  return n
}

export const playSound = () => {
  const audio = new Audio(fantasy_fairy)
  audio.play()
}

export const delay = ms => new Promise(res => setTimeout(res, ms));


export const secondsToMinutes = seconds => {
  return `${Math.floor(seconds / 60)} : ${prependZero(Math.floor(seconds % 60))}`
}
export const secondsToMinutesModulo = seconds => {
  return seconds / 60
}
export const minutesToSeconds = minutes => {
  return minutes * 60
}

export const durationToHMS = duration => {
  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor(Math.floor(duration % 3600) / 60)
  const seconds = Math.floor(duration % 60)

  return { hours, minutes, seconds }
}

export const pomodoroExertionListDisplay 
  = exertions => {
    let displayArray = []

    exertions.map(exertion => {
      const { hours, minutes, seconds } 
        = durationToHMS(exertion.targetDurationLeft)
      
      const arrayElement = {
        name: exertion.name, 
        timeLeft:`${hours} hours and ${minutes} minutes and ${seconds} seconds left`
      }

      let children
      if (exertion.children) {
        children = pomodoroExertionListDisplay(exertion.children)
        arrayElement.children = children
      }
      displayArray.push(JSON.stringify(arrayElement))
      return null
    }
  )
  return displayArray
}

export const genericExertionListDisplay 
  = exertions => {
    let displayArray = []

    exertions.map(exertion => {
      const { hours, minutes, seconds } 
        = durationToHMS(exertion.targetDurationLeft)

      const { hours: targetHours, minutes: targetMinutes, seconds: targetSeconds }
        = durationToHMS(exertion.targetDuration)

      const { hours: finishedHours, minutes: finishedMinutes, seconds: finishedSeconds }
        = durationToHMS(exertion.finishedDuration)

      const arrayElement = {
        id: exertion._id,
        name: exertion.name, 
        skill: exertion.skill,
        targetDurationRaw: exertion.targetDuration,
        finishedDurationRaw: exertion.finishedDuration,
        targetDurationLeft: exertion.targetDurationLeft,
        finishedDuration: `Finished: ${prependZero(finishedHours)}:${prependZero(finishedMinutes)}:${prependZero(finishedSeconds)}`,
        targetDuration: `Goal: ${prependZero(targetHours)}:${prependZero(targetMinutes)}:${prependZero(targetSeconds)}`,
        timeLeft:`Left: ${prependZero(hours)}:${prependZero(minutes)}:${prependZero(seconds)}`
      }

      let children
      if (exertion.children) {
        children = genericExertionListDisplay(exertion.children)
        arrayElement.children = children
      }
      displayArray.push(JSON.stringify(arrayElement))
      return null
    }
  )
  return displayArray
}

export const findExertionDurationLeft = (parentExertionId, exertionList) => {
  let durationLeft = null
  for (const exertion of exertionList) {
    if (exertion.id === parentExertionId) {
      durationLeft = Math.floor(exertion.targetDurationLeft / 3600)
    }
    if (!durationLeft && exertion.children.length) {
      durationLeft = findExertionDurationLeft(parentExertionId, exertion.children)
    }
  }
  return durationLeft
}