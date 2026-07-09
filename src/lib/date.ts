export function currentChinaWeekday() {
  const date = new Date()
  const chinaDate = new Date(date.getTime() + (date.getTimezoneOffset() + 480) * 60 * 1000)
  const day = chinaDate.getDay()

  return day === 0 ? 7 : day
}
