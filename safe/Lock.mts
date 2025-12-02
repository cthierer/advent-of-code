import EventEmitter from 'node:events'
import type { LockState } from './LockState.mts'

export type Transform = (state: LockState) => number

type Unsubscribe = () => void

type RotationHandler = (
  transform: Transform,
  prevState: LockState,
  nextState: LockState,
) => void

interface LockEvents {
  rotated: [transform: Transform, prevState: LockState, nextState: LockState]
}

class Lock {
  private position: number = 0

  private emitter: EventEmitter<LockEvents> = new EventEmitter()

  readonly minValue: number = 0

  readonly maxValue: number = 99

  constructor(maxValue: number, startingPosition: number) {
    this.maxValue = maxValue
    this.position = startingPosition
  }

  get currentPosition(): number {
    const { position } = this
    return position
  }

  private get state(): LockState {
    const { position, minValue, maxValue } = this
    return { position, minValue, maxValue }
  }

  rotate(transform: Transform) {
    const { state: prevState } = this
    const nextPosition = transform(prevState)

    this.position = nextPosition

    const { state: nextState } = this
    this.emitter.emit('rotated', transform, prevState, nextState)
  }

  onRotate(handler: RotationHandler): Unsubscribe {
    this.emitter.addListener('rotated', handler)
    return () => {
      this.emitter.removeListener('rotated', handler)
    }
  }
}

export default Lock
