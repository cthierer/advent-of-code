import Coordinates from '../grid/Coordinates.mts'
import Grid from '../grid/Grid.mts'
import {
  isBeam,
  isSplitter,
  isStartingPoint,
  type ManifoldElementState,
} from './ManifoldElementState.mts'

abstract class ManifoldElement {
  readonly state: ManifoldElementState

  readonly coordinates: Coordinates

  private numTimesProcessed: number = 0

  private numTimelinesCache: Map<Grid<ManifoldElement | null>, number> = new Map()

  constructor(state: ManifoldElementState, coordinates: Coordinates) {
    this.state = state
    this.coordinates = coordinates
  }

  get used(): boolean {
    const { numTimesProcessed } = this
    return numTimesProcessed > 0
  }

  protected copyState(to: ManifoldElement) {
    to.numTimesProcessed = this.numTimesProcessed
  }

  abstract copy(): ManifoldElement

  isBeam(): boolean {
    const { state } = this
    return isBeam(state)
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

  neighbors(grid: Grid<ManifoldElement | null>): ManifoldElement[] {
    const { coordinates } = this
    return [
      coordinates.translate(-1, 0), // left 1
      coordinates.translate(1, 0), // right 1
    ]
      .filter(coordinate => grid.within(coordinate))
      .map(coordinate => grid.at(coordinate).value)
      .filter(value => !!value)
  }

  protected abstract countTimlines(grid: Grid<ManifoldElement | null>): number

  numTimelines(grid: Grid<ManifoldElement | null>): number {
    const { numTimelinesCache } = this
    if (numTimelinesCache.has(grid)) {
      return numTimelinesCache.get(grid)!
    }

    const numTimelines = this.countTimlines(grid)
    numTimelinesCache.set(grid, numTimelines)
    return numTimelines
  }

  protected abstract processBeam(grid: Grid<ManifoldElement | null>): Grid<ManifoldElement | null>

  process(last: Grid<ManifoldElement | null>): Grid<ManifoldElement | null> {
    const { coordinates } = this
    if (!last.within(coordinates)) {
      return last
    }

    this.numTimesProcessed += 1
    if (this.numTimesProcessed > 1) {
      return last
    }

    return this.processBeam(last)
  }
}

export default ManifoldElement
