class Coordinates {
  readonly col: number

  readonly row: number

  constructor(col: number, row: number) {
    this.col = col
    this.row = row
  }

  translate(deltaCol: number, deltaRow: number): Coordinates {
    return new Coordinates(this.col + deltaCol, this.row + deltaRow)
  }

  toString(): string {
    const { col, row } = this
    return `(${col}, ${row})`
  }
}

export default Coordinates
