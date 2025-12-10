import { format } from 'node:util'
import Coordinates from './Coordinates.mts'
import Grid from './Grid.mts'

class OutOfBoundsError extends Error {
  readonly grid: Grid<unknown>

  readonly coordinates: Coordinates

  constructor(grid: Grid<unknown>, coordinates: Coordinates) {
    super(
      format(
        'coordinates %s out of bounds for grid with width %d and height %d',
        coordinates.toString(),
        grid.width,
        grid.height,
      ),
    )
    this.grid = grid
    this.coordinates = coordinates
  }
}

export default OutOfBoundsError
