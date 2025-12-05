import InclusiveRange from './InclusiveRange.mts'

const compareNumbers = (valA: number, valB: number): number => valA - valB

class InclusiveNumericRange extends InclusiveRange<number> {
  constructor(start: number, end: number) {
    super(start, end, compareNumbers)
  }
}

export default InclusiveNumericRange
