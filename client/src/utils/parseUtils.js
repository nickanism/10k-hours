export const exertionListParsing = exertionList => {

  if (exertionList === [] || exertionList === undefined || exertionList === null || exertionList.name === undefined) {
    return null
  }

  else if (exertionList) {
    let parsedChildren
    if (exertionList.length) {
      parsedChildren 
        = exertionList.map(child => JSON.parse(child))
      return (
        <ul>
          {
            parsedChildren.map(child => 
            <li key={child.name}>
              {child.name}: {child.timeLeft}
            </li>
            )
          }
        </ul>
      )
    }

    return (
      <ul>
        <li key={exertionList.name}>
          {exertionList.name}: {exertionList.timeLeft}
        </li>
          {
            exertionListParsing(exertionList.children)
          }
      </ul>
    )
  }
}
