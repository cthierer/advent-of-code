import Coordinates from '../grid/Coordinates.mts'
import Grid from '../grid/Grid.mts'
import ManifoldElement from './ManifoldElement.mts'

class Manifold {
  private startingPoints: Coordinates[] = []

  private grid: Grid<ManifoldElement | null>

  constructor(numCols: number = 0) {
    this.grid = new Grid<ManifoldElement | null>(null, 0, numCols)
  }

  get numCols(): number {
    const { grid } = this
    return grid.width
  }

  set numCols(newValue: number) {
    if (newValue < 0) {
      throw new Error(`column count must be greater non-negative, got "${newValue}"`)
    }

    const { numCols } = this
    if (newValue === numCols) {
      return
    }

    const { numRows, grid } = this
    const newGrid = new Grid<ManifoldElement | null>(null, numRows, newValue)
    for (const { coordinates, value } of grid) {
      if (coordinates.col >= newValue) {
        continue
      }
      newGrid.set(coordinates, value)
    }

    this.grid = newGrid
  }

  get numRows(): number {
    const { grid } = this
    return grid.height
  }

  private appendEmptyRow() {
    const { numCols, grid } = this
    const emptyRow = []
    for (let col = 0; col < numCols; col++) {
      emptyRow[col] = null
    }
    grid.addRow(emptyRow)
  }

  add(element: ManifoldElement) {
    const { grid, startingPoints } = this
    const { coordinates } = element

    if (coordinates.row >= grid.height) {
      this.appendEmptyRow()
    }

    grid.set(coordinates, element)

    if (element.isStartingPoint()) {
      this.startingPoints = startingPoints.concat(element.coordinates)
    }
  }

  copy(): Manifold {
    const { numCols } = this
    const copy = new Manifold(numCols)
    copy.grid = this.grid.copy()
    return copy
  }

  process(): Manifold {
    const { startingPoints, grid: startingGrid } = this

    let grid = startingGrid.copy()
    for (const startingCoordinate of startingPoints) {
      const { value: element } = grid.at(startingCoordinate)
      if (!element) {
        continue
      }

      grid = element.process(grid)
    }

    const manifold = this.copy()
    manifold.grid = grid

    return manifold
  }

  splitters(): ManifoldElement[] {
    return Array.from(this)
      .filter(element => !!element && element.isSplitter())
      .filter(value => !!value)
  }

  timelines(): Grid<number> {
    const { numRows, numCols, grid } = this
    const timelines = new Grid<number>(0, numRows, numCols)

    for (const { coordinates, value } of grid) {
      timelines.set(coordinates, value ? value.numTimelines(grid) : 0)
    }

    return timelines
  }

  numTimelines(): number {
    const { grid } = this
    const lastRow = grid.row(grid.height - 1).map(({ value }) => value)
    const beams = lastRow.filter(value => !!value && value.isBeam()).filter(value => !!value)
    return beams.reduce((sum, beam) => sum + beam.numTimelines(grid), 0)
  }

  toString(): string {
    const { grid } = this
    return grid.toString()
  }

  *[Symbol.iterator]() {
    const { grid } = this
    for (const { value: element } of grid) {
      if (!element) {
        continue
      }
      yield element
    }
  }
}

export default Manifold
