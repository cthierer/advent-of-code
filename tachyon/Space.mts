import Coordinates from '../grid/Coordinates.mts'
import Beam from './Beam.mts'
import Manifold from './Manifold.mts'
import ManifoldElement from './ManifoldElement.mts'
import ManifoldElementState from './ManifoldElementState.mts'

class Space extends ManifoldElement {
  constructor() {
    super(ManifoldElementState.Space)
  }

  protected processBeam(currCoordinates: Coordinates, last: Manifold): Manifold {
    const beam = new Beam()

    const next = last.copy()
    next.set(currCoordinates, beam)

    return beam.process(currCoordinates, next)
  }
}

export default Space
