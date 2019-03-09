const shuffle = <T>(items: Iterable<T>) => {
  const result = [...items]
  for (let i = 0; i < result.length; i++) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
export default shuffle
