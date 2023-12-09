
export function addZeros (number) {
  return (number.toString().length === 1)
    ? '0' + number.toString()
    : number.toString()
}
