import type { LockState } from './LockState.mts'

const rotateRight = (distance: number) =>
  Object.defineProperty(
    ({ position, minValue, maxValue }: LockState): number => {
      const nextPosition = position + distance
      if (nextPosition > maxValue) {
        return minValue + (nextPosition % (maxValue + 1))
      }
      return nextPosition
    },
    'name',
    {
      value: `rotateRight(${distance})`,
    },
  )

export default rotateRight
