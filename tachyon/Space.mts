import Coordinates from '../grid/Coordinates.mts'
import Beam from './Beam.mts'
import Grid from '../grid/Grid.mts'
import ManifoldElement from './ManifoldElement.mts'
import ManifoldElementState from './ManifoldElementState.mts'

class Space extends ManifoldElement {
  constructor() {
    super(ManifoldElementState.Space)
  }

  protected processBeam(
    currCoordinates: Coordinates,
    last: Grid<ManifoldElement>,
  ): Grid<ManifoldElement> {
    const beam = new Beam()

    const next = last.copy()
    next.set(currCoordinates, beam)

    return beam.process(currCoordinates, next)
  }
}

export default Space
