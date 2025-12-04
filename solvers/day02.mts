import scanReadable from '../util/scanReadable.mts'

const parseRange = (from: string): [number, number] => {
  const [startStr,endStr] = from.split('-',2)
  const start = Number.parseInt(startStr, 10)
  if (Number.isNaN(start)) {
    throw new Error(`invalid start value: "${startStr}"`)
  }
  const end = Number.parseInt(endStr, 10)
  if (Number.isNaN(end)) {
    throw new Error(`invalid end value: "${endStr}"`)
  }
  return [start, end]
}

const filterRange = (start: number, end: number, predicate: ((value: number) => boolean)): number[] => {
  let matching: number[] = []

  for(let i = start; i <= end; i++) {
    if (predicate(i)) {
      matching = [...matching, i]
    }
  }

  return matching
}

const isInvalidId = (value: number): boolean => {
  const asString = String(value)
  const numDigits = asString.length
  if (numDigits % 2 !== 0) {
    return false
  }

  const firstHalf = asString.substring(0, numDigits / 2)
  const secondHalf = asString.substring(numDigits / 2)

  return firstHalf === secondHalf
}

const sum = (val1: number, val2: number): number => val1 + val2

try {
  let total = 0
  for await (const range of scanReadable(process.stdin, ',')) {
    const [start, end] = parseRange(range)
    const invalidIds = filterRange(start, end, isInvalidId)
    total = invalidIds.reduce(sum, total)
  }
  console.log("Sum of invalid IDs: %d", total)
} catch (err) {
  console.error('Error processing file: %s', err instanceof Error ? err.message : String(err))
  process.exit(-1)
}
