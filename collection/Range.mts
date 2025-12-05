interface Range<T> extends Iterable<T> {
  readonly start: T
  readonly end: T
  readonly size: number

  contains(value: T): boolean

  intersects(other: Range<T>): boolean

  union(other: Range<T>): Range<T>

  toString(): string
}

export default Range
