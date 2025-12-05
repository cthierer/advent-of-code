interface Range<T> {
  readonly start: T
  readonly end: T

  contains(value: T): boolean
}

export default Range
