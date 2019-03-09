export default function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min
}

randomRange.int = function randomRangeInt(min: number, max: number) {
  return Math.floor(randomRange(min, max))
}
