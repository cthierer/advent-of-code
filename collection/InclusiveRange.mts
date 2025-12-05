import type Range from './Range.mts'

export type Comparator<T> = (valA: T, valB: T) => number

class InclusiveRange<T> implements Range<T> {
  readonly start: T

  readonly end: T

  private readonly comparator: Comparator<T>

  constructor(start: T, end: T, comparator: Comparator<T>) {
    this.start = start
    this.end = end
    this.comparator = comparator
  }

  contains(value: T): boolean {
    const { start, end, comparator } = this
    return comparator(value, start) >= 0 && comparator(value, end) <= 0
  }
}

export default InclusiveRange
