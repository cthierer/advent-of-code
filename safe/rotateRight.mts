import rotatingSequence from '../util/rotatingSequence.mts'
import type LockState from './LockState.mts'

const rotateRight = (distance: number) =>
  Object.defineProperty(
    (state: LockState): LockState => {
      const { position: startPosition, rotations: startRotations, minValue, maxValue } = state

      let position = startPosition
      let rotations = startRotations
      for (position of rotatingSequence(minValue, maxValue, startPosition, distance, 1)) {
        if (position === 0) {
          rotations += 1
        }
      }

      return {
        ...state,
        position,
        rotations,
      }
    },
    'name',
    {
      value: `rotateRight(${distance})`,
    },
  )

export default rotateRight
