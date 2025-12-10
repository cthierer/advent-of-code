import Coordinates from './Coordinates.mts'
import Element from './Element.mts'
import OutOfBoundsError from './OutOfBoundsError.mts'

class Grid<T> {
  private spacer: T

  private maxColumns: number = 0

  private rows: T[][] = []

  constructor(spacer: T) {
    this.spacer = spacer
  }

  get height(): number {
    const { rows } = this
    return rows.length
  }

  get width(): number {
    const { maxColumns } = this
    return maxColumns
  }

  at(coordinates: Coordinates): Element<T> {
    if (!this.within(coordinates)) {
      throw new OutOfBoundsError(this, coordinates)
    }

    const { rows, spacer } = this
    const { row, col } = coordinates
    const value = rows[row]?.[col] ?? spacer

    return new Element(coordinates, value)
  }

  get(find: T): Element<T> | null {
    for (const element of this) {
      const { value } = element
      if (value === find) {
        return element
      }
    }
    return null
  }

  addRow(row: T[]) {
    const { maxColumns, rows } = this
    if (maxColumns < row.length) {
      this.maxColumns = row.length
    }
    this.rows = [...rows, row]
  }

  col(col: number): Element<T>[] {
    const { width } = this
    if (col >= width) {
      throw new Error(`invalid column index, out of bounds: ${col}`)
    }

    const { height } = this
    let values: Element<T>[] = []
    for (let row = 0; row < height; row++) {
      values = values.concat(this.at(new Coordinates(col, row)))
    }

    return values
  }

  copy(): Grid<T> {
    const copy = new Grid(this.spacer)
    copy.maxColumns = this.maxColumns
    copy.rows = this.rows.map(row => [...row])
    return copy
  }

  getAdjacent({ col, row }: Element<T>): Element<T>[] {
    const { height, width } = this

    let adjacent: Element<T>[] = []
    for (let rowIdx = row - 1; rowIdx <= row + 1; rowIdx++) {
      if (rowIdx < 0) {
        continue
      }

      if (rowIdx > height) {
        continue
      }

      for (let colIdx = col - 1; colIdx <= col + 1; colIdx++) {
        if (colIdx < 0) {
          continue
        }

        if (colIdx > width) {
          continue
        }

        if (colIdx === col && rowIdx === row) {
          continue
        }

        adjacent = [...adjacent, this.at(new Coordinates(colIdx, rowIdx))]
      }
    }

    return adjacent
  }

  remove({ row, col }: Coordinates) {
    const { spacer } = this
    this.rows[row][col] = spacer
  }

  set(coordinates: Coordinates, element: T) {
    if (!this.within(coordinates)) {
      throw new OutOfBoundsError(this, coordinates)
    }

    const { col, row } = coordinates

    this.rows[row] = this.rows[row] ?? []
    this.rows[row][col] = element
  }

  toString(): string {
    const { rows } = this
    return rows.map(row => row.join(' ')).join('\n')
  }

  within({ col, row }: Coordinates): boolean {
    const { width, height } = this
    return col >= 0 && col < width && row >= 0 && row < height
  }

  *[Symbol.iterator]() {
    const { height, width, spacer } = this
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const element = this.at(new Coordinates(col, row))
        if (element.value === spacer) {
          continue
        }
        yield element
      }
    }
  }
}

export default Grid
