export const saveInLocalStrgAndRedirect = ([...localStrge], path) => {
  localStrge.map(l => {
    localStorage.setItem(`${Object.keys(l)}`, Object.values(l))
  })
  if (typeof window !== 'undefined' && path) {
    window.location = `${path}`
  }
}
