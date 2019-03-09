/**
 * Returns a number of items randomly from the array
 */
const sample = <T>(items: T[], count = 1) => {
  const copied = [...items]
  const result = Array<T>(count)

  for (let i = 0; i < count; i++) {
    const [sampledItem] = copied.splice(
      Math.floor(Math.random() * copied.length),
      1,
    )

    result[i] = sampledItem
  }

  return result
}
export default sample
