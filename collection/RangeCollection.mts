import type Range from './Range.mts'

class RangeCollection<T, R extends Range<T> = Range<T>> implements Iterable<R> {
  private ranges: R[] = []

  add(range: R) {
    const { ranges } = this
    let updatedRanges: (R | null)[] = [...ranges, range]

    let i = 0
    while (i < updatedRanges.length) {
      const currIdx = i++
      const existingRange = updatedRanges[currIdx]
      if (existingRange === null) {
        continue
      }

      for (let j = currIdx + 1; j < updatedRanges.length; j++) {
        const currRange = updatedRanges[j]
        if (currRange === null) {
          continue
        }

        if (existingRange.intersects(currRange) || currRange.intersects(existingRange)) {
          updatedRanges[currIdx] = existingRange.union(currRange) as R
          updatedRanges[j] = null
          i = 0
        }
      }
    }

    this.ranges = updatedRanges.filter(range => !!range)
  }

  contains(value: T) {
    const { ranges } = this
    return ranges.some(range => range.contains(value))
  }

  *[Symbol.iterator]() {
    const { ranges } = this
    for (const range of ranges) {
      yield range
    }
  }
}

export default RangeCollection
