const rotatingSequence = function* (
  min: number,
  max: number,
  startAt: number,
  steps: number,
  modifier: number,
) {
  let current = startAt
  for (let i = 0; i < steps; i += Math.abs(modifier)) {
    let next = current + modifier

    if (next < min) {
      next = max
    } else if (next > max) {
      next = min
    }

    yield next
    current = next
  }
  return current
}

export default rotatingSequence
