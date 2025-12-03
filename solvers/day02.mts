import scanReadable from '../util/scanReadable.mts'

for await (const range of scanReadable(process.stdin, ',')) {
  console.log(range)
}
