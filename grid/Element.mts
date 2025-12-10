import Coordinates from './Coordinates.mts'

class Element<T> {
  readonly coordinates: Coordinates

  readonly value: T

  constructor(coordinates: Coordinates, value: T) {
    this.coordinates = coordinates
    this.value = value
  }

  get col(): number {
    const {
      coordinates: { col },
    } = this
    return col
  }

  get row(): number {
    const {
      coordinates: { row },
    } = this
    return row
  }
}

export default Element
