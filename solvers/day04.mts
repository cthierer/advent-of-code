import Element from '../grid/Element.mts'
import Grid from '../grid/Grid.mts'
import scanReadable from '../util/scanReadable.mts'

const SPACER = '.'
const ROLL = '@'

type GridElement = '.' | '@'

const gridElementFromString = (value: string): GridElement => {
  switch (value) {
    case SPACER:
    // fallthrough
    case ROLL:
      return value
    default:
      throw new Error(`unrecognized grid element: "${value}"`)
  }
}

const parseLine = (line: string): GridElement[] => Array.from(line).map(gridElementFromString)

try {
  const grid = new Grid<GridElement>(SPACER)
  for await (const line of scanReadable(process.stdin, '\n')) {
    grid.addRow(parseLine(line))
  }

  let totalRemoved = 0
  let numRemoved = 0
  do {
    let toRemove: Element<GridElement>[] = []

    for (const element of grid) {
      const adjacent = grid.getAdjacent(element)
      const numAdjacent = adjacent.filter(({ value }) => value === ROLL).length
      if (numAdjacent < 4) {
        toRemove = [...toRemove, element]
      }
    }

    for (const element of toRemove) {
      grid.remove(element)
    }

    numRemoved = toRemove.length
    totalRemoved += numRemoved

    console.log('Removing rolls: %d', numRemoved)
  } while (numRemoved > 0)

  console.log('Total rolls removed: %d', totalRemoved)
} catch (err) {
  console.error(
    'Error processing input: %s',
    err instanceof Error ? `${err.message}\n${err.stack}` : String(err),
  )
  process.exit(-1)
}
