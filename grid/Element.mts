class Element<T> {
  readonly col: number

  readonly row: number

  readonly value: T

  constructor(col: number, row: number, value: T) {
    this.col = col
    this.row = row
    this.value = value
  }
}

export default Element
