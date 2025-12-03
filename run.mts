import { resolve } from 'node:path'
import { readdir } from 'node:fs/promises'
import { fork } from 'node:child_process'

const MAX_TIMEOUT_MS = 60 * 1000

const solverPath = resolve(process.cwd(), './solvers/')
const solverScripts = (await readdir(solverPath)).map(file => file.split('.', 1)[0]).filter(Boolean)

const [, , solver, ...args] = process.argv
if (!solver) {
  console.error('Missing argument: solver\nPlease specify the solver you would like to run.\nAvailable solvers: %s', solverScripts.join(', '))
  process.exit(-1)
}

if (!solverScripts.includes(solver)) {
  console.error('Invalid solver: "%s"\nAvailable solvers: %s', solver, solverScripts.join(', '))
  process.exit(-1)
}

const modulePath = resolve(solverPath, `${solver}.mts`)
const controller = new AbortController()
const child = fork(modulePath, args, { signal: controller.signal, silent: false })
const timeout = setTimeout(() => {
  console.error('Timeout exceeded, aborting...')
  controller.abort()
}, MAX_TIMEOUT_MS)

child.on('error', err => {
  clearTimeout(timeout)
  console.error('Error processing solver: %s', err.message)
  process.exit(-1)
})

child.on('exit', code => {
  clearTimeout(timeout)
  if (code === null) {
    return
  }

  if (code < 0) {
    console.error('Solver failed (code %s).', code)
    process.exit(code)
  }

  console.log('Done!')
})


