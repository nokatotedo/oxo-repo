export const getValueForm = (targets) => {
  const value = {}
  for(let i = 0; i < targets.length; i++) {
    if(targets[i].attributes.type?.nodeValue !== "submit") {
      const val = targets[i].value
      const name = targets[i].name
      value[name] = val
    }
  }
  
  return value
}