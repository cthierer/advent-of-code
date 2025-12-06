import { Readable } from 'node:stream'
import Grid from '../grid/Grid.mts'
import Element from '../grid/Element.mts'
import scanReadable from '../util/scanReadable.mts'
import { multiply, sum } from '../util/numbers.mts'

const INVALID_ENTRY = ''
const OPERATOR_ADD = '+'
const OPERATOR_MULTIPLY = '*'

const buildGrid = async (input: Readable): Promise<Grid<string>> => {
  const grid = new Grid(INVALID_ENTRY)
  for await (const line of scanReadable(input, '\n')) {
    grid.addRow(line.trim().split(/\s+/))
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
  return BigInt(value)
}

try {
  const grid = await buildGrid(process.stdin)
  let total = 0n
  for (let colIdx = 0; colIdx < grid.width; colIdx++) {
    const col = grid.col(colIdx)
    const [operator, ...operands] = col.reverse()
    const operation = getOperation(operator.value)
    const result = operands.map(toBigInt).reduceRight(operation)
    total += result
    console.log('Result for column %d (%s): %d', colIdx + 1, operator.value, result)
  }
  console.log('Total sum: %d', total)
} catch (err) {
  console.error(
    'Error processing: %s',
    err instanceof Error ? `${err.message}\n${err.stack}` : String(err),
  )
  process.exit(-1)
}
