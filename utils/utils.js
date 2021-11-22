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

const pickedForAllExertion 
= (
  {
    _id, name, skill, targetDuration,
    targetHoursLeft, finishedDuration,
    finishedHours, creationDate, targetDurationLeft,
    children
  }
) => (
  {
    _id, name, skill, targetDuration,
    targetHoursLeft, finishedDuration,
    finishedHours, creationDate, targetDurationLeft,
    children
  }
)

/**
 * 
 * Model Utils
 */
exports.populateChildren = (coll, id) => {

  // returns the proper populated doc
  return coll
    .findOne({_id: id})
    .then(
      page => {
        if (!page.children || !page.children.length) {
          return page;
        }
        return Promise
          .all(page.children.map(childId => {
            console.log(childId)
            return this.populateChildren(coll, childId)
          }) 
          .then(children => Object.assign(page, {children})
          )
      
    )})
}

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
    if (exertion.children) {
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
exports.allExertionResponse = exertions => {
  return exertions.map(exertion => {
    if (exertion.children) {
      return {
        ...pickedForAllExertion(exertion), 
        children: this.allExertionResponse(
          exertion.children
        )
      } 
    } else {
      return pickedForAllExertion(exertion) 
    }
  })
}
