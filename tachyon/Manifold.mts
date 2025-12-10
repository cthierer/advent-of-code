import Coordinates from '../grid/Coordinates.mts'
import Grid from '../grid/Grid.mts'
import OutOfBoundsError from '../grid/OutOfBoundsError.mts'
import ManifoldElement from './ManifoldElement.mts'
import Space from './Space.mts'

class Manifold {
  private startingPoints: Coordinates[] = []

  private grid: Grid<ManifoldElement> = new Grid(new Space())

  add(elements: ManifoldElement[]) {
    const { grid, startingPoints } = this
    grid.addRow(elements)
    this.startingPoints = startingPoints.concat(
      elements
        .filter(value => value.isStartingPoint())
        .map(value => grid.get(value))
        .filter(value => !!value)
        .map(({ coordinates }) => coordinates),
    )
  }

  at(coordinates: Coordinates): ManifoldElement {
    const { grid } = this
    const { value } = grid.at(coordinates)
    return value
  }

  set(coordinates: Coordinates, element: ManifoldElement) {
    const { grid } = this
    grid.set(coordinates, element)
  }

  copy(): Manifold {
    const copy = new Manifold()
    copy.grid = this.grid.copy()
    return copy
  }

  process(): Manifold {
    const { startingPoints } = this

    let manifold = this.copy()
    for (const startingCoordinate of startingPoints) {
      try {
        const element = manifold.at(startingCoordinate)
        manifold = element.process(startingCoordinate, manifold)
      } catch (err) {
        if (err instanceof OutOfBoundsError) {
          continue
        }
        throw err
      }
    }

    return manifold
  }

  toString(): string {
    const { grid } = this
    return grid.toString()
  }

  *[Symbol.iterator]() {
    const { grid } = this
    for (const { value: element } of grid) {
      yield element
    }
  }
}

export default Manifold
