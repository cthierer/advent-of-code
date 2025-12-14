import Coordinates from '../grid/Coordinates.mts'
import Grid from '../grid/Grid.mts'
import ManifoldElement from './ManifoldElement.mts'
import ManifoldElementState from './ManifoldElementState.mts'

interface Boundary {
  within(coordinates: Coordinates): boolean
}

class TwoWaySplitter extends ManifoldElement {
  constructor(coordinates: Coordinates) {
    super(ManifoldElementState.TwoWaySplitter, coordinates)
  }

  copy(): TwoWaySplitter {
    const { coordinates } = this
    const copy = new TwoWaySplitter(coordinates)
    this.copyState(copy)
    return copy
  }

  private splitTo(grid: Grid<ManifoldElement | null>): Coordinates[] {
    return this.neighbors(grid).map(value => value.coordinates)
  }

  protected countTimlines(grid: Grid<ManifoldElement | null>): number {
    return 0
  }

  protected processBeam(grid: Grid<ManifoldElement | null>): Grid<ManifoldElement | null> {
    const splitCoordinates = this.splitTo(grid)
    let next = grid
    for (const coordinate of splitCoordinates) {
      const { value: spreadTo } = grid.at(coordinate)
      if (!spreadTo) {
        continue
      }

      next = spreadTo.process(next)
    }

    return next
  }
}

export default TwoWaySplitter
