import shuffle from "./shuffle"

/**
 * Returns a number of items randomly from the array
 */
const sample = <T>(items: Iterable<T>, count = 1) => {
  const shuffled = shuffle(items)
  return shuffled.slice(0, count)
}
export default sample
