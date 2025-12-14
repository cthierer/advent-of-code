import Coordinates from '../grid/Coordinates.mts'
import Beam from './Beam.mts'
import Grid from '../grid/Grid.mts'
import ManifoldElement from './ManifoldElement.mts'
import ManifoldElementState from './ManifoldElementState.mts'

class Space extends ManifoldElement {
  constructor(coorindates: Coordinates) {
    super(ManifoldElementState.Space, coorindates)
  }

  copy(): Space {
    const { coordinates } = this
    const copy = new Space(coordinates)
    this.copyState(copy)
    return copy
  }

  protected countTimlines(grid: Grid<ManifoldElement | null>): number {
    return 0
  }

  protected processBeam(grid: Grid<ManifoldElement | null>): Grid<ManifoldElement | null> {
    const { coordinates } = this
    const beam = new Beam(coordinates)
    grid.set(coordinates, beam)
    return beam.process(grid)
  }
}

export default Space
