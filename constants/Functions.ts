

export function reshape2D ( array : Array<any>, cols : number ) : Array<any> {
  let temp = []
  let idx = 0
  for (let i = cols - 1; i < array.length; i += cols) {
    temp.push(array.slice(idx, i + 1))
    idx = i + 1
  }
  let lastRow = array.slice(idx, array.length)
  while (lastRow.length < cols) {
    lastRow.push({})
  }
  temp.push(lastRow)
  return temp
}