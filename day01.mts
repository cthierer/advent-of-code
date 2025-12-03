import { Readable } from 'node:stream'
import Lock, { type Transform } from './safe/Lock.mts'
import rotateLeft from './safe/rotateLeft.mts'
import rotateRight from './safe/rotateRight.mts'
import scanLines from './util/scanLines.mts'
import type LockState from './safe/LockState.mts'

const parseLine = (line: string): Transform => {
  const distance = Number.parseInt(line.substring(1), 10)
  if (Number.isNaN(distance)) {
    throw new Error(`invalid distance: "${line.substring(1)}"`)
  }

  const direction = line.charAt(0)
  switch (direction) {
    case 'L':
      return rotateLeft(distance)
    case 'R':
      return rotateRight(distance)
    default:
      throw new Error(`unrecognized direction: "${direction}"`)
  }
}

const main = async (input: Readable) => {
  const lock = new Lock(99, 50)
  let numZeroes = 0

  lock.onRotate((transform: Transform, prevState: LockState, nextState: LockState) => {
    const { position } = nextState
    const numRotations = nextState.rotations - prevState.rotations
    console.log(
      'Start = %d; Action = %s; End = %d; Rotations = %d',
      prevState.position,
      transform.name,
      nextState.position,
      numRotations,
    )

    if (position === 0) {
      numZeroes += 1
    }
  })

  for await (const line of scanLines(input)) {
    const transform = parseLine(line)
    lock.rotate(transform)
  }

  console.log('Final value:', lock.position)
  console.log('Num. zeros:', numZeroes)
  console.log('Num. passes over zero:', lock.rotations)
}

main(process.stdin)
  .then(() => {
    console.log('Done!')
  })
  .catch(err => {
    console.log('Error: ', err.message)
  })
