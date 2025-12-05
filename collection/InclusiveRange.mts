import type Range from './Range.mts'

type Comparator<T> = (valA: T, valB: T) => number

class InclusiveRange<T> implements Range<T> {
  readonly start: T

  readonly end: T

  private readonly comparator: Comparator<T>

  private readonly values: (startAt: T, endAt: T) => Generator<T>

  private readonly differ: (startAt: T, endAt: T) => number

  constructor(
    start: T,
    end: T,
    comparator: Comparator<T>,
    values: (startAt: T, endAt: T) => Generator<T>,
    differ: (startAt: T, endAt: T) => number,
  ) {
    this.start = start
    this.end = end
    this.comparator = comparator
    this.values = values
    this.differ = differ
  }

  get size(): number {
    const { differ, start, end } = this
    return differ(start, end) + 1
  }

  contains(value: T): boolean {
    const { start, end, comparator } = this
    return comparator(value, start) >= 0 && comparator(value, end) <= 0
  }

  intersects({ start: otherStart, end: otherEnd }: Range<T>): boolean {
    const { start, end, comparator } = this

    if (comparator(start, otherStart) >= 0 && comparator(start, otherEnd) <= 0) {
      return true
    }

    if (comparator(end, otherEnd) <= 0 && comparator(end, otherStart) >= 0) {
      return true
    }

    return false
  }

  union({ start: otherStart, end: otherEnd }: Range<T>): Range<T> {
    const { start: thisStart, end: thisEnd, comparator, values, differ } = this
    const start = thisStart < otherStart ? thisStart : otherStart
    const end = thisEnd > otherEnd ? thisEnd : otherEnd
    return new InclusiveRange(start, end, comparator, values, differ)
  }

  toString(): string {
    const { start, end, size } = this
    return `${String(start)}-${String(end)} (${size})`
  }

  [Symbol.iterator]() {
    const { start, end, values } = this
    return values(start, end)
  }
}

export default InclusiveRange
