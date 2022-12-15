export function countDecimals(value: number) {
  if (Math.floor(value.valueOf()) === value.valueOf()) return 0
  return value.toString().split(".")[1].length || 0
}
