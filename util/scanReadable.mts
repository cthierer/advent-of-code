import { Readable } from 'node:stream'

const scanReadable = async function* (input: Readable, delineator: string | RegExp = '\n') {
  for await (const chunk of input) {
    const units: string[] = chunk.toString('utf8').split(delineator)
    for (const unit of units) {
      if (unit.length > 0) {
        yield unit
      }
    }
  }
}

export default scanReadable
