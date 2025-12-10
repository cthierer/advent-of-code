import { Readable } from 'node:stream'
import Manifold from '../tachyon/Manifold.mts'
import scanReadable from '../util/scanReadable.mts'
import Coordinates from '../grid/Coordinates.mts'
import ManifoldElementState, { fromValue } from '../tachyon/ManifoldElementState.mts'
import Beam from '../tachyon/Beam.mts'
import Space from '../tachyon/Space.mts'
import Start from '../tachyon/Start.mts'
import TwoWaySplitter from '../tachyon/TwoWaySplitter.mts'
import ManifoldElement from '../tachyon/ManifoldElement.mts'

const getManifoldElement = (value: string): ManifoldElement => {
  switch (fromValue(value)) {
    case ManifoldElementState.Beam:
      return new Beam()
    case ManifoldElementState.Space:
      return new Space()
    case ManifoldElementState.Start:
      return new Start()
    case ManifoldElementState.TwoWaySplitter:
      return new TwoWaySplitter()
    default:
      throw new Error(`unrecognized manifold element "${value}"`)
  }
}

try {
  const manifold = new Manifold()
  for await (const line of scanReadable(process.stdin, '\n')) {
    manifold.add(Array.from(line).map(getManifoldElement))
  }

  const result = manifold.process()
  const splitters = result.splitters()
  const usedSplitters = splitters.filter(({ used }) => used)

  console.log('Starting manifold:\n==================\n%s\n', manifold)
  console.log('Final manifold:\n===============\n%s\n', result)

  console.log('Used splitters: %d/%d', usedSplitters.length, splitters.length)
} catch (err) {
  console.error(
    'Error processing: %s',
    err instanceof Error ? `${err.message}\n${err.stack}` : String(err),
  )
  process.exit(-1)
}
