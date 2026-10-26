import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

// Usage: node scripts/import-2026-photos.mjs "C:/path/to/originals"
// Originals, including the photographer's watermark, are never modified.
const root = fileURLToPath(new URL('../', import.meta.url))
const source = path.resolve(process.argv[2] || 'C:/Users/siebe/Downloads/HAWP 2026')
const output = path.join(root, 'public/hawp_2026_fotos')
const thumbs = path.join(output, 'thumbs')
const qa = path.join(root, '.qa')
const files = (await fs.readdir(source))
  .filter(file => /\.(jpe?g|png|webp)$/i.test(file))
  .map(file => {
    const match = file.match(/\((\d+) van \d+\)/)
    if (!match) throw new Error(`Cannot determine the photo number: ${file}`)
    return { file, number: Number(match[1]) }
  })
  .sort((a, b) => a.number - b.number)

if (!files.length) throw new Error(`No photos found in ${source}`)
if (new Set(files.map(file => file.number)).size !== files.length) {
  throw new Error('Duplicate photo numbers found; refusing to overwrite images.')
}
await Promise.all([fs.mkdir(thumbs, { recursive: true }), fs.mkdir(qa, { recursive: true }), fs.mkdir(path.join(root, 'src/data'), { recursive: true })])
sharp.concurrency(2)
const manifest = []
let sourceBytes = 0
let convertedBytes = 0
let thumbnailBytes = 0
for (const { file, number } of files) {
  const original = path.join(source, file)
  const imagePath = path.join(output, `${number}.webp`)
  const thumbPath = path.join(thumbs, `${number}.webp`)
  const full = await sharp(original).rotate().resize({ width: 1920, withoutEnlargement: true }).webp({ quality: 82, effort: 4 }).toFile(imagePath)
  const thumb = await sharp(imagePath).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 78, effort: 4 }).toFile(thumbPath)
  manifest.push({ number, src: `/hawp_2026_fotos/${number}.webp`, thumbnail: `/hawp_2026_fotos/thumbs/${number}.webp`, width: full.width, height: full.height })
  sourceBytes += (await fs.stat(original)).size
  convertedBytes += full.size
  thumbnailBytes += thumb.size
  if (number % 10 === 0 || number === files.at(-1).number) console.log(`Converted ${manifest.length}/${files.length} photos`)
}
await fs.writeFile(path.join(root, 'src/data/photos-2026.json'), `${JSON.stringify(manifest, null, 2)}\n`)

// Contact sheets are local QA artifacts, excluded from Git by .gitignore.
const perSheet = 30
for (let offset = 0; offset < manifest.length; offset += perSheet) {
  const group = manifest.slice(offset, offset + perSheet)
  const tiles = await Promise.all(group.map(async (photo, index) => ({
    input: await sharp(path.join(thumbs, `${photo.number}.webp`))
      .resize(240, 160, { fit: 'contain', background: '#171717' })
      .extend({ bottom: 28, background: '#ffffff' })
      .composite([{ input: Buffer.from(`<svg width="240" height="28"><text x="10" y="20" font-family="Arial" font-size="18">${photo.number}</text></svg>`), top: 160, left: 0 }])
      .jpeg({ quality: 85 }).toBuffer(),
    left: (index % 5) * 240,
    top: Math.floor(index / 5) * 188,
  })))
  const sheet = path.join(qa, `2026-contact-${Math.floor(offset / perSheet) + 1}.jpg`)
  await sharp({ create: { width: 1200, height: Math.ceil(group.length / 5) * 188, channels: 3, background: '#ddd' } }).composite(tiles).jpeg({ quality: 90 }).toFile(sheet)
  console.log(`Contact sheet: ${sheet}`)
}
console.log(JSON.stringify({ count: manifest.length, sourceBytes, convertedBytes, thumbnailBytes, reductionPercent: Number(((1 - (convertedBytes + thumbnailBytes) / sourceBytes) * 100).toFixed(2)) }, null, 2))
