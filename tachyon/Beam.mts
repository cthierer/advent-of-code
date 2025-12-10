import Coordinates from '../grid/Coordinates.mts'
import OutOfBoundsError from '../grid/OutOfBoundsError.mts'
import Grid from '../grid/Grid.mts'
import ManifoldElement from './ManifoldElement.mts'
import ManifoldElementState from './ManifoldElementState.mts'

class Beam extends ManifoldElement {
  constructor() {
    super(ManifoldElementState.Beam)
  }

  protected processBeam(
    currCoordinates: Coordinates,
    last: Grid<ManifoldElement>,
  ): Grid<ManifoldElement> {
    const downOne = currCoordinates.translate(0, 1)
    try {
      const { value: spreadTo } = last.at(downOne)
      return spreadTo.process(downOne, last)
    } catch (err) {
      if (err instanceof OutOfBoundsError) {
        return last
      }
      throw err
    }
  }
}

export default Beam
