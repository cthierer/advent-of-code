import Battery from './Battery.mts'
import { concat } from '../util/numbers.mts'

class BatteryBank {
  readonly id: number

  readonly batteries: Battery[]

  constructor(id: number, batteries: Battery[]) {
    this.id = id
    this.batteries = batteries
  }

  maxJoltage(numBatteries: number): number {
    const { batteries: allBatteries } = this
    let availableBatteries = [...allBatteries]
    let selected: Battery[] = []

    for (let i = 0; i < numBatteries; i++) {
      const offset = availableBatteries.length - numBatteries + i + 1
      const maxJoltage = availableBatteries.slice(0, offset).sort(Battery.compare).reverse().at(0)
      if (!maxJoltage) {
        throw new Error('no joltage found')
      }

      const idx = availableBatteries.findIndex(
        ({ joltage }: Battery): boolean => joltage === maxJoltage.joltage,
      )
      if (idx < 0) {
        throw new Error('joltage does not exist in bank')
      }

      availableBatteries = availableBatteries.slice(idx + 1)
      selected = [...selected, maxJoltage]
    }

    return selected.map(Battery.toJoltage).reduce(concat)
  }
}

export default BatteryBank
