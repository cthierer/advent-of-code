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

  copy(): Manifold {
    const copy = new Manifold()
    copy.grid = this.grid.copy()
    return copy
  }

  process(): Manifold {
    const { startingPoints, grid: startingGrid } = this

    let grid = startingGrid.copy()
    for (const startingCoordinate of startingPoints) {
      try {
        const { value: element } = grid.at(startingCoordinate)
        grid = element.process(startingCoordinate, grid)
      } catch (err) {
        if (err instanceof OutOfBoundsError) {
          continue
        }
        throw err
      }
    }

    const manifold = this.copy()
    manifold.grid = grid

    return manifold
  }

  splitters(): ManifoldElement[] {
    return Array.from(this).filter(element => element.isSplitter())
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
