class Battery {
  joltage: number

  constructor(joltage: number) {
    this.joltage = joltage
  }

  static compare(batteryA: Battery, batteryB: Battery): number {
    return Battery.toJoltage(batteryA) - Battery.toJoltage(batteryB)
  }

  static toJoltage({ joltage }: Battery): number {
    return joltage
  }
}

export default Battery
