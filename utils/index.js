export const saveInLocalStrgAndRedirect = ([...localStrge], path) => {
  localStrge.map(l => {
    localStorage.setItem(`${Object.keys(l)}`, Object.values(l))
  })
  if (typeof window !== 'undefined' && path) {
    window.location = `${path}`
  }
}

export const camelCase = word => {
  if (word) {
    let b = word.split('')
    let c = b[0]
    let d = b[0].toUpperCase()
    let f = b[0].replace(c, d)
    let z = word.slice(1)
    let j = f.concat(z)
    return j
  }
}
