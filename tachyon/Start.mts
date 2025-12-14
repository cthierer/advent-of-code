import Coordinates from '../grid/Coordinates.mts'
import Grid from '../grid/Grid.mts'
import ManifoldElement from './ManifoldElement.mts'
import ManifoldElementState from './ManifoldElementState.mts'

class Start extends ManifoldElement {
  constructor(coordinates: Coordinates) {
    super(ManifoldElementState.Start, coordinates)
  }

  copy(): Start {
    const { coordinates } = this
    const copy = new Start(coordinates)
    this.copyState(copy)
    return copy
  }

  protected countTimlines(grid: Grid<ManifoldElement | null>): number {
    return 1
  }

  protected processBeam(grid: Grid<ManifoldElement | null>): Grid<ManifoldElement | null> {
    const { coordinates } = this
    const downOne = coordinates.translate(0, 1)
    if (!grid.within(downOne)) {
      return grid
    }

    const { value: spreadTo } = grid.at(downOne)
    if (!spreadTo) {
      return grid
    }

    return spreadTo.process(grid)
  }
}

export default Start
