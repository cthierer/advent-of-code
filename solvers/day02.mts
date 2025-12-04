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

const hasTwoRepeats = (value: number): boolean => {
  const asString = String(value)
  const numDigits = asString.length
  if (numDigits % 2 !== 0) {
    return false
  }

  const firstHalf = asString.substring(0, numDigits / 2)
  const secondHalf = asString.substring(numDigits / 2)

  return firstHalf === secondHalf
}

const hasNRepeats = (value: number): boolean => {
  const asString = String(value)
  const maxLength = Math.floor(asString.length / 2)

  for (let length = 1; length <= maxLength; length++) {
    const searchFor = asString.substring(0, length)
    let repeats = true
    for (let i = length; i < asString.length; i += length) {
      const matchAgainst = asString.substring(i, i + length)
      repeats = repeats && searchFor === matchAgainst
      if (!repeats) {
        break
      }
    }
    if (repeats) {
      return true
    }
  }

  return false
}

const sum = (val1: number, val2: number): number => val1 + val2

try {
  let totalMethod1 = 0
  let totalMethod2 = 0
  for await (const range of scanReadable(process.stdin, ',')) {
    const [start, end] = parseRange(range)

    const twoRepeats = filterRange(start, end, hasTwoRepeats)
    totalMethod1 = twoRepeats.reduce(sum, totalMethod1)

    const nRepeats = filterRange(start, end, hasNRepeats)
    totalMethod2 = nRepeats.reduce(sum, totalMethod2)
  }
  console.log('Sum of invalid IDs (method 1): %d', totalMethod1)
  console.log('Sum of invalid IDs (method 2): %d', totalMethod2)
} catch (err) {
  console.error('Error processing file: %s', err instanceof Error ? err.message : String(err))
  process.exit(-1)
}
