import Manifold from '../tachyon/Manifold.mts'
import scanReadable from '../util/scanReadable.mts'
import ManifoldElementState, { fromValue } from '../tachyon/ManifoldElementState.mts'
import Beam from '../tachyon/Beam.mts'
import Space from '../tachyon/Space.mts'
import Start from '../tachyon/Start.mts'
import TwoWaySplitter from '../tachyon/TwoWaySplitter.mts'
import ManifoldElement from '../tachyon/ManifoldElement.mts'
import Coordinates from '../grid/Coordinates.mts'

const parseManifoldElement = (coordinates: Coordinates, value: string): ManifoldElement => {
  switch (fromValue(value)) {
    case ManifoldElementState.Beam:
      return new Beam(coordinates)
    case ManifoldElementState.Space:
      return new Space(coordinates)
    case ManifoldElementState.Start:
      return new Start(coordinates)
    case ManifoldElementState.TwoWaySplitter:
      return new TwoWaySplitter(coordinates)
    default:
      throw new Error(`unrecognized manifold element "${value}"`)
  }
}

try {
  const manifold = new Manifold()
  let row = 0
  for await (const line of scanReadable(process.stdin, '\n')) {
    const values = Array.from(line)
    manifold.numCols = values.length
    for (let col = 0; col < values.length; col++) {
      const coordinates = new Coordinates(col, row)
      manifold.add(parseManifoldElement(coordinates, values[col]))
    }
    row += 1
  }

  const result = manifold.process()
  const splitters = result.splitters()
  const usedSplitters = splitters.filter(({ used }) => used)

  console.log('Starting manifold:\n==================\n%s\n', manifold)
  console.log('Final manifold:\n===============\n%s\n', result)
  console.log('Used splitters: %d/%d', usedSplitters.length, splitters.length)
  console.log('Total possible timelines: %d', result.numTimelines())
} catch (err) {
  console.error(
    'Error processing: %s',
    err instanceof Error ? `${err.message}\n${err.stack}` : String(err),
  )
  process.exit(-1)
}
