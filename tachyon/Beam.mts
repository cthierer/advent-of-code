import Coordinates from '../grid/Coordinates.mts'
import Grid from '../grid/Grid.mts'
import ManifoldElement from './ManifoldElement.mts'
import ManifoldElementState from './ManifoldElementState.mts'

class Beam extends ManifoldElement {
  constructor(coordinates: Coordinates) {
    super(ManifoldElementState.Beam, coordinates)
  }

  copy(): Beam {
    const { coordinates } = this
    const copy = new Beam(coordinates)
    this.copyState(copy)
    return copy
  }

  protected countTimlines(grid: Grid<ManifoldElement | null>): number {
    const { coordinates } = this
    const upOne = coordinates.translate(0, -1)
    if (!grid.within(upOne)) {
      return 1
    }

    const { value: oneUpElement } = grid.at(upOne)
    const numTimelines = !!oneUpElement ? oneUpElement.numTimelines(grid) : 1
    const neighbors = this.neighbors(grid)
    return neighbors
      .filter(neighbor => neighbor.isSplitter() && neighbor.used)
      .map(neighbor => neighbor.coordinates.translate(0, -1))
      .filter(coordinates => grid.within(coordinates))
      .map(coordinates => grid.at(coordinates).value)
      .filter(value => !!value)
      .reduce((sum, value) => (sum += value.numTimelines(grid)), numTimelines)
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

export default Beam
