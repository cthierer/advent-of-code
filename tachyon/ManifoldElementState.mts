const TYPE_START = 'S'
const TYPE_SPACE = '.'
const TYPE_TWO_WAY_SPLITTER = '^'
const TYPE_BEAM = '|'

const ManifoldElementState = {
  Start: TYPE_START,
  Space: TYPE_SPACE,
  TwoWaySplitter: TYPE_TWO_WAY_SPLITTER,
  Beam: TYPE_BEAM,
} as const

export type ManifoldElementState = (typeof ManifoldElementState)[keyof typeof ManifoldElementState]

export const fromValue = (value: string): ManifoldElementState => {
  switch (value) {
    case TYPE_START:
      return ManifoldElementState.Start
    case TYPE_SPACE:
      return ManifoldElementState.Space
    case TYPE_TWO_WAY_SPLITTER:
      return ManifoldElementState.TwoWaySplitter
    case TYPE_BEAM:
      return ManifoldElementState.Beam
    default:
      throw new Error(`unrecognized state value: "${value}"`)
  }
}

export const isBeam = (value: ManifoldElementState): boolean => value === ManifoldElementState.Beam

export const isStartingPoint = (value: ManifoldElementState): boolean =>
  value === ManifoldElementState.Start

export const isSplitter = (value: ManifoldElementState): boolean =>
  value === ManifoldElementState.TwoWaySplitter

export default ManifoldElementState
