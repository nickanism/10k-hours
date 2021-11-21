/**
 * LOCAL UTILS
 * 
 */

// only show id, name, skill, durations and hours
const pickedForMainExertion 
  = (
    {
      _id, name, skill, targetDuration,
      targetHoursLeft, finishedDuration,
      finishedHours, creationDate, targetDurationLeft
    }
  ) => (
    {
      _id, name, skill, targetDuration,
      targetHoursLeft, finishedDuration,
      finishedHours, creationDate, targetDurationLeft
    }
  )

/**
 * TIME UTILS
 * 
 */
exports.hourToSeconds = hours => hours * 3600;
exports.secToHour = sec => Math.floor(sec / 3600);

/**
 * SERIALIZE/DESERIALIZE UTILS
 * 
 */
exports.mainExertionResponse = exertions => {
  return exertions.map(exertion => {
    if (exertion.children.length) {
      return {
        ...pickedForMainExertion(exertion), 
        children: this.mainExertionResponse(
          exertion.children
        )
      } 
    } else {
      return pickedForMainExertion(exertion) 
    }
  })
}
