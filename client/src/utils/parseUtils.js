export const exertionListValidate = exertionList => {
  if (exertionList === undefined || exertionList === null ) {
    return null
  }
  if (typeof exertionList[0] === "string") {
    return "string"
  }
  if (exertionList[0] === undefined) {
    return null
  }
  if (exertionList[0].name === undefined) {
    return null
  }
  return exertionList
}

export const returnParsedExertionList = originalList => {
  let parsedList = originalList
  if (exertionListValidate(originalList) === "string") {
    parsedList = originalList.map(
      exertion => JSON.parse(exertion)
    )
  }
  
  return parsedList.map(item => {
    if (item.children) {
      item.children 
      = returnParsedExertionList(item.children)
    }
    return item
    }
  )
}

export const exertionUnorderedListParsing = exertionList => {
  
  if (!exertionListValidate(exertionList)) {
    return null
  }

  let parsedList = exertionList
  if (exertionListValidate(exertionList) === "string") {
    parsedList = exertionList.map(
      exertion => JSON.parse(exertion)
    )
  }

  return (
    <ul>
      {
        parsedList.map(exertion => {
          return (
            <li key={exertion.name}>
              <h4>{exertion.name}</h4>
              {exertion.targetDuration} <br />
              {exertion.timeLeft}
              {exertionUnorderedListParsing(exertion.children)}
            </li>
          )
        })
      }
    </ul>
  )
}

export const exertionOptionList = (exertionList, selectedId = null) => {
  
  if (!exertionListValidate(exertionList)) {
    return null
  }

  let parsedList = exertionList
  if (exertionListValidate(exertionList) === "string") {
    parsedList = exertionList.map(
      exertion => JSON.parse(exertion)
    )
  }

  return (
    parsedList.map(exertion => {
      if (exertionOptionList(exertion.children)){
        return [
            <option key={exertion.name} 
              value={exertion.id}
            >
              {exertion.name}: {exertion.timeLeft}
            </option>, 
            ...exertionOptionList(exertion.children)
        ]
      }
      return (
        <option 
          key={exertion.name} 
          value={exertion.id}
        >
          {exertion.name}: {exertion.timeLeft}
        </option>
      )
    })
  )
}