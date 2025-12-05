import scanReadable from '../util/scanReadable.mts'
import type Range from '../collection/Range.mts'
import InclusiveNumericRange from '../collection/InclusiveNumericRange.mts'
import RangeCollection from '../collection/RangeCollection.mts'

const MODE_RANGE = 0
const MODE_ID = 1

const isRange = (line: string): boolean => /\d+-\d+/i.test(line)

const parseRange = (line: string): Range<number> => {
  const [startStr, endStr] = line.split('-', 2)
  const start = Number.parseInt(startStr, 10)
  if (Number.isNaN(start)) {
    throw new Error(`invalid range start: ${startStr}`)
  }

  const end = Number.parseInt(endStr, 10)
  if (Number.isNaN(end)) {
    throw new Error(`invalid range end: ${endStr}`)
  }

  if (end < start) {
    throw new Error(`invalid range, end must be after start: [${start}, ${end}]`)
  }

  return new InclusiveNumericRange(start, end)
}

const parseId = (line: string): number => {
  const id = Number.parseInt(line, 10)
  if (Number.isNaN(id)) {
    throw new Error(`invalid ID: ${line}`)
  }

  return id
}

try {
  let mode = MODE_RANGE
  const freshIngredientRanges = new RangeCollection<number>()
  const freshIngredients = new Set<number>()
  for await (const line of scanReadable(process.stdin, '\n')) {
    switch (mode) {
      case MODE_RANGE: {
        if (isRange(line)) {
          freshIngredientRanges.add(parseRange(line))
          break
        }
        mode = MODE_ID
        // fallthrough
      }
      case MODE_ID: {
        const id = parseId(line)
        if (freshIngredientRanges.contains(id)) {
          freshIngredients.add(id)
        }
        break
      }
      default:
        throw new Error(`unexpected mode: ${mode}`)
    }
  }

  console.log('Num. fresh ingredients: %d', freshIngredients.size)
} catch (err) {
  console.error(
    'Error processing: %s',
    err instanceof Error ? `${err.message}\n${err.stack}` : String(err),
  )
  process.exit(-1)
}
