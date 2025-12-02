import { Readable } from 'node:stream'

const scanLines = async function* (input: Readable) {
  for await (const chunk of input) {
    const lines: string[] = chunk.toString('utf8').trim().split('\n')
    for (const line of lines) {
      if (line.length > 0) {
        yield line
      }
    }
  }
}

export default scanLines
