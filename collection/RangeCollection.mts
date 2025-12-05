import type Range from './Range.mts'

class RangeCollection<T, R extends Range<T> = Range<T>> {
  private ranges: R[] = []

  add(range: R) {
    const { ranges } = this
    this.ranges = [...ranges, range]
  }

  contains(value: T) {
    const { ranges } = this
    return ranges.some(range => range.contains(value))
  }
}

export default RangeCollection
