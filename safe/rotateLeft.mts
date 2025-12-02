import type { LockState } from './LockState.mts'

const rotateLeft = (distance: number) =>
  Object.defineProperty(
    ({ position, minValue, maxValue }: LockState): number =>
      (((position - distance) % (maxValue + 1)) + (maxValue + 1)) %
      (maxValue + 1),
    'name',
    {
      value: `rotateLeft(${distance})`,
    },
  )

export default rotateLeft
