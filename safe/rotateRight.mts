import type LockState from './LockState.mts'

const rotateRight = (distance: number) =>
  Object.defineProperty(
    (state: LockState): LockState => {
      const { position, minValue, maxValue } = state
      const upperBound = maxValue + 1
      const delta = position + distance
      const nextPosition = minValue + (delta % upperBound)
      const numRotations = 0 // TODO
      return {
        ...state,
        position: nextPosition,
        rotations: state.rotations + numRotations,
      }
    },
    'name',
    {
      value: `rotateRight(${distance})`,
    },
  )

export default rotateRight
