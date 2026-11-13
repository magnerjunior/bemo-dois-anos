import { createHash } from 'node:crypto'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = new URL('../dist/', import.meta.url)
const worker = new URL('sw.js', dist)
const include = /^(assets|fotos|capa|icons|textures|illustrations|placeholders|audio)\//
const files = (await readdir(dist, { recursive:true, withFileTypes:true }))
  .filter(entry=>entry.isFile())
  .map(entry=>relative(fileURLToPath(dist),join(entry.parentPath || entry.path,entry.name)).replaceAll('\\','/'))
  .filter(file=>include.test(file) && !file.endsWith('.txt'))
  .sort()
const source = await readFile(worker,'utf8')
const hash = createHash('sha256').update(source)
for (const file of ['index.html','manifest.webmanifest',...files]) {
  hash.update(await readFile(new URL(file,dist)))
}
const urls = ['/', '/manifest.webmanifest', ...files.map(file=>'/'+file)]
await writeFile(worker, `const BUILD = ${JSON.stringify(hash.digest('hex').slice(0,16))};\nconst OFFLINE_FILES = ${JSON.stringify(urls)};\n${source}`)
console.log(`Álbum offline preparado com ${urls.length} arquivos.`)
