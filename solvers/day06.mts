import { Readable } from 'node:stream'
import Grid from '../grid/Grid.mts'
import Element from '../grid/Element.mts'
import scanReadable from '../util/scanReadable.mts'
import { multiply, sum } from '../util/numbers.mts'

const INVALID_ENTRY = ''
const OPERATOR_ADD = '+'
const OPERATOR_MULTIPLY = '*'

const buildGrid = async (input: Readable): Promise<Grid<string>> => {
  let lines: string[] = []
  for await (const line of scanReadable(input, '\n')) {
    lines = lines.concat(line)
  }

  const lastLine = lines[lines.length - 1]
  const widths = lastLine.split(/(?<!^\s*)\s(?=\S)/).map(part => part.length)
  const splitPattern = `^${widths.map((width: number) => `([\\d ]{${width}}|[*+])`).join('\\s+')}\\s*$`
  const grid = new Grid(INVALID_ENTRY)

  for (const line of lines) {
    const pattern = new RegExp(splitPattern)
    const [, ...parts] = pattern.exec(line) || []
    grid.addRow(parts)
  }

  return grid
}

type Operation = (val1: bigint, val2: bigint) => bigint

const getOperation = (operator: string): Operation => {
  switch (operator) {
    case OPERATOR_ADD:
      return sum
    case OPERATOR_MULTIPLY:
      return multiply
    default:
      throw new Error(`unrecognized operator: "${operator}"`)
  }
}

const toBigInt = ({ value, row, col }: Element<string>): bigint => {
  if (value === INVALID_ENTRY) {
    throw new Error(`invalid entry at row=${row}, col=${col}`)
  }
  return BigInt(value.trim())
}

const toDigits = ({ value, row, col }: Element<string>): string[] => {
  if (value === INVALID_ENTRY) {
    throw new Error(`invalid entry at row=${row}, col=${col}`)
  }
  return Array.from(value).map(valueStr => valueStr.trim())
}

const rotate = (last: string[][], values: string[], row: number, arr: string[][]): string[][] => {
  for (let col = 0; col < values.length; col++) {
    const value = values[values.length - col - 1]

    let digits = last[col]
    if (!digits) {
      digits = []
    }
    digits.push(value)
    last[col] = digits
  }
  return last
}

const buildNumber = (digits: string[]): bigint =>
  BigInt(digits.filter(val => !!val).reduce((last, curr) => last + curr))

try {
  const grid = await buildGrid(process.stdin)
  let total = 0n
  let total2 = 0n
  for (let colIdx = 0; colIdx < grid.width; colIdx++) {
    const col = grid.col(colIdx)
    const [operator, ...operands] = col.reverse()
    const operation = getOperation(operator.value)
    const result = operands.map(toBigInt).reduceRight(operation)
    const result2 = operands
      .map(toDigits)
      .reduceRight(rotate, [])
      .map(buildNumber)
      .reduce(operation)
    total += result
    total2 += result2
    console.log('Result for column %d (%s): %d', colIdx + 1, operator.value, result)
    console.log(
      'Result for column %d using cephalopods notation (%s): %d',
      colIdx + 1,
      operator.value,
      result2,
    )
  }
  console.log('Total sum: %d', total)
  console.log('Total sum for cephalopods notation: %d', total2)
} catch (err) {
  console.error(
    'Error processing: %s',
    err instanceof Error ? `${err.message}\n${err.stack}` : String(err),
  )
  process.exit(-1)
}
