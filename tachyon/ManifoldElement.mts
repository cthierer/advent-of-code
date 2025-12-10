import Coordinates from '../grid/Coordinates.mts'
import Manifold from './Manifold.mts'
import { isSplitter, isStartingPoint, type ManifoldElementState } from './ManifoldElementState.mts'

abstract class ManifoldElement {
  readonly state: ManifoldElementState

  private numTimesProcessed: number = 0

  private readonly maxTimesToProcess: number

  constructor(state: ManifoldElementState, maxTimesToProcess: number = 1) {
    this.state = state
    this.maxTimesToProcess = maxTimesToProcess
  }

  get used(): boolean {
    const { numTimesProcessed } = this
    return numTimesProcessed > 0
  }

  isStartingPoint(): boolean {
    const { state } = this
    return isStartingPoint(state)
  }

  isSplitter(): boolean {
    const { state } = this
    return isSplitter(state)
  }

  toString(): string {
    const { state } = this
    return String(state)
  }

  protected abstract processBeam(currCoordinates: Coordinates, last: Manifold): Manifold

  process(currCoordinates: Coordinates, last: Manifold): Manifold {
    const { numTimesProcessed, maxTimesToProcess } = this
    if (numTimesProcessed >= maxTimesToProcess) {
      return last
    }
    this.numTimesProcessed += 1
    return this.processBeam(currCoordinates, last)
  }
}

export default ManifoldElement
