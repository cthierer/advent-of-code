import Element from './Element.mts'

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

  at(row: number, col: number): Element<T> {
    const { rows, spacer } = this
    const value = rows[row]?.[col] ?? spacer
    return new Element(col, row, value)
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
      values = values.concat(this.at(row, col))
    }

    return values
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

        adjacent = [...adjacent, this.at(rowIdx, colIdx)]
      }
    }

    return adjacent
  }

  remove({ row, col }: Element<T>) {
    const { spacer } = this
    this.rows[row][col] = spacer
  }

  toString(): string {
    const { rows } = this
    return rows.map(row => row.join(' ')).join('\n')
  }

  *[Symbol.iterator]() {
    const { height, width, spacer } = this
    for (let row = 0; row < height; row++) {
      for (let col = 0; col < width; col++) {
        const element = this.at(row, col)
        if (element.value === spacer) {
          continue
        }
        yield element
      }
    }
  }
}

export default Grid
