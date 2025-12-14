import Coordinates from './Coordinates.mts'
import Element from './Element.mts'
import OutOfBoundsError from './OutOfBoundsError.mts'

class Grid<T> {
  private spacer: T

  private maxColumns: number = 0

  private rows: T[][] = []

  constructor(spacer: T, height: number = 0, width: number = 0) {
    this.spacer = spacer
    this.maxColumns = width

    for (let row = 0; row < height; row += 1) {
      for (let col = 0; col < width; col += 1) {
        this.rows[row] = this.rows[row] ?? []
        this.rows[row][col] = spacer
      }
    }
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

  col(idx: number): Element<T>[] {
    const { width } = this
    if (idx >= width) {
      throw new Error(`invalid column index, out of bounds: ${idx}`)
    }

    const { height } = this
    let values: Element<T>[] = []
    for (let row = 0; row < height; row++) {
      values = values.concat(this.at(new Coordinates(idx, row)))
    }

    return values
  }

  copy(): Grid<T> {
    const copy = new Grid(this.spacer)
    copy.maxColumns = this.maxColumns
    copy.rows = this.rows.map(row =>
      row.map(element => {
        if (
          typeof element === 'object' &&
          element !== null &&
          'copy' in element &&
          typeof element.copy === 'function'
        ) {
          return element.copy()
        }
        return element
      }),
    )
    return copy
  }

  adjacent({ col, row }: Coordinates): Element<T>[] {
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

  row(idx: number): Element<T>[] {
    const { height } = this
    if (idx >= height) {
      throw new Error(`invalid row index, out of bounds: ${idx}`)
    }

    const { rows } = this
    return rows[idx].map((value, col) => new Element(new Coordinates(col, idx), value))
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
    return rows
      .map(row =>
        row
          .map(value => {
            if (typeof value === 'number') {
              return value.toString(16)
            }
            return String(value)
          })
          .join(' '),
      )
      .join('\n')
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
