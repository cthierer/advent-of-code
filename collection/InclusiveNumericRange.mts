import InclusiveRange from './InclusiveRange.mts'

const compareNumbers = (valA: number, valB: number): number => valA - valB

const valuesInRange = function* (start: number, end: number) {
  for (let i = start; i <= end; i++) {
    yield i
  }
}

const diffNumbers = (valA: number, valB: number): number => Math.abs(valA - valB)

class InclusiveNumericRange extends InclusiveRange<number> {
  constructor(start: number, end: number) {
    super(start, end, compareNumbers, valuesInRange, diffNumbers)
  }
}

export default InclusiveNumericRange
