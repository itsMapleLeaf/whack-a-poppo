export default function range(length: number) {
  const result = Array<number>(length)
  for (let i = 0; i < length; i++) {
    result[i] = i
  }
  return result
}
