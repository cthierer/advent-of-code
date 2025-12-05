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

  let fewerThanFourAdjacent: Element<GridElement>[] = []
  for (const element of grid) {
    const adjacent = grid.getAdjacent(element)
    const numAdjacent = adjacent.filter(({ value }) => value === ROLL).length
    if (numAdjacent < 4) {
      fewerThanFourAdjacent = [...fewerThanFourAdjacent, element]
    }
  }

  console.log('Accessible rolls: %d', fewerThanFourAdjacent.length)
} catch (err) {
  console.error(
    'Error processing input: %s',
    err instanceof Error ? `${err.message}\n${err.stack}` : String(err),
  )
  process.exit(-1)
}
