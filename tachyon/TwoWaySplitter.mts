import Coordinates from '../grid/Coordinates.mts'
import OutOfBoundsError from '../grid/OutOfBoundsError.mts'
import Manifold from './Manifold.mts'
import ManifoldElement from './ManifoldElement.mts'
import ManifoldElementState from './ManifoldElementState.mts'

class TwoWaySplitter extends ManifoldElement {
  constructor() {
    super(ManifoldElementState.TwoWaySplitter)
  }

  protected processBeam(currCoordinates: Coordinates, last: Manifold): Manifold {
    const splitCoordinates = [
      currCoordinates.translate(-1, 0), // left 1
      currCoordinates.translate(1, 0), // right 1
    ]

    let next = last
    for (const coordinate of splitCoordinates) {
      try {
        const spreadTo = last.at(coordinate)
        next = spreadTo.process(coordinate, next)
      } catch (err) {
        if (err instanceof OutOfBoundsError) {
          continue
        }
        throw err
      }
    }

    return next
  }
}

export default TwoWaySplitter
