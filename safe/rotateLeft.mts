import type LockState from './LockState.mts'

const rotateLeft = (distance: number) =>
  Object.defineProperty(
    (state: LockState): LockState => {
      const { position, minValue, maxValue } = state
      const delta = position - distance
      const upperBound = maxValue + 1
      const nextPosition = minValue + (((delta % upperBound) + upperBound) % upperBound)
      const numRotations = 0 // TODO
      return {
        ...state,
        position: nextPosition,
        rotations: state.rotations + numRotations,
      }
    },
    'name',
    {
      value: `rotateLeft(${distance})`,
    },
  )

export default rotateLeft
