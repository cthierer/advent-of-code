type Numeric = number | bigint

export const sum = <T extends Numeric = number>(val1: T, val2: T): T => {
  if (typeof val1 === 'number' && typeof val2 === 'number') {
    return (val1 + val2) as T
  }

  if (typeof val1 === 'bigint' && typeof val2 === 'bigint') {
    return (val1 + val2) as T
  }

  throw new TypeError('both arguments must be the same type')
}

export const multiply = <T extends Numeric = number>(val1: T, val2: T): T => (val1 * val2) as T

export const concat = (val1: number, val2: number): number =>
  Number.parseInt(String(val1) + String(val2), 10)
