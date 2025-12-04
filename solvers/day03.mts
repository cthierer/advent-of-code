import scanReadable from '../util/scanReadable.mts'
import Battery from '../power/Battery.mts'
import BatteryBank from '../power/BatteryBank.mts'

const parseLine = (line: string): Battery[] => Array.from(line).map((battery: string) => {
  const joltage = Number.parseInt(battery, 10)
  if (Number.isNaN(joltage)) {
    throw new Error(`invalid joltage: "${battery}"`)
  }
  return new Battery(joltage)
})

try {
  let nextId = 1
  let totalOutputJoltage = 0
  for await (const line of scanReadable(process.stdin, '\n')) {
    const batteryBank = new BatteryBank(nextId++, parseLine(line))
    const maxJoltage = batteryBank.maxJoltage(2)

    console.log('Max. joltage for battery bank %s = %d', batteryBank.id, maxJoltage)
    totalOutputJoltage += maxJoltage
  }

  console.log('Total output joltage = %d', totalOutputJoltage)
} catch (err) {
  console.error('Error processling input: %s', err instanceof Error ? err.message : String(err))
}
