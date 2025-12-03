import EventEmitter from 'node:events'
import type LockState from './LockState.mts'

export type Transform = (state: LockState) => LockState

type Unsubscribe = () => void

type RotationHandler = (transform: Transform, prevState: LockState, nextState: LockState) => void

const EventRotated = 'rotated'

interface LockEvents {
  [EventRotated]: [transform: Transform, prevState: LockState, nextState: LockState]
}

class Lock implements LockState {
  private currentPosition: number = 0

  private numRotations: number = 0

  private readonly emitter: EventEmitter<LockEvents> = new EventEmitter()

  readonly minValue: number = 0

  readonly maxValue: number = 99

  constructor(maxValue: number, startingPosition: number) {
    this.maxValue = maxValue
    this.currentPosition = startingPosition
  }

  get position(): number {
    const { currentPosition: position } = this
    return position
  }

  get rotations(): number {
    const { numRotations: rotations } = this
    return rotations
  }

  private get state(): LockState {
    const { position, rotations, minValue, maxValue } = this
    return { position, rotations, minValue, maxValue }
  }

  private set state(nextState: LockState) {
    const { position, rotations } = nextState
    this.currentPosition = position
    this.numRotations = rotations
  }

  rotate(transform: Transform) {
    const { state: prevState } = this
    const nextState = transform(prevState)
    this.state = nextState
    this.emitter.emit(EventRotated, transform, prevState, nextState)
  }

  onRotate(handler: RotationHandler): Unsubscribe {
    this.emitter.addListener(EventRotated, handler)
    return () => {
      this.emitter.removeListener(EventRotated, handler)
    }
  }
}

export default Lock
