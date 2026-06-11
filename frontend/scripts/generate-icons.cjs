/**
 * Generates PNG icons for PWA using pure Node.js (no external deps).
 * Creates solid purple squares with a white "T" letter.
 * Run: node scripts/generate-icons.js
 */
const fs = require('fs')
const zlib = require('zlib')
const path = require('path')

const PURPLE = [124, 58, 237]
const WHITE = [255, 255, 255]

function createPNG(width, height, pixels) {
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR chunk
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(width, 0)
  ihdrData.writeUInt32BE(height, 4)
  ihdrData[8] = 8  // bit depth
  ihdrData[9] = 2  // color type: RGB
  ihdrData[10] = 0 // compression
  ihdrData[11] = 0 // filter
  ihdrData[12] = 0 // interlace
  const ihdr = createChunk('IHDR', ihdrData)

  // Raw pixel data with filter byte (0 = None) per row
  const raw = Buffer.alloc(height * (1 + width * 3))
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 3)
    raw[rowOffset] = 0 // filter byte
    for (let x = 0; x < width; x++) {
      const idx = rowOffset + 1 + x * 3
      const pi = (y * width + x) * 3
      raw[idx] = pixels[pi]
      raw[idx + 1] = pixels[pi + 1]
      raw[idx + 2] = pixels[pi + 2]
    }
  }

  const compressed = zlib.deflateSync(raw)
  const idat = createChunk('IDAT', compressed)

  // IEND chunk
  const iend = createChunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, ihdr, idat, iend])
}

function createChunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeB = Buffer.from(type, 'ascii')
  const crcData = Buffer.concat([typeB, data])
  const crc = crc32(crcData)
  const crcB = Buffer.alloc(4)
  crcB.writeUInt32BE(crc, 0)
  return Buffer.concat([len, typeB, data, crcB])
}

function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i]
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0)
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

function generateIcon(size) {
  const pixels = new Uint8Array(size * size * 3)

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 3

      // Background: purple with rounded corners (alpha approximated via hard edge)
      const cx = size / 2, cy = size / 2, r = size / 2
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      if (dist > r) {
        pixels[idx] = 0; pixels[idx + 1] = 0; pixels[idx + 2] = 0
        continue
      }

      pixels[idx] = PURPLE[0]
      pixels[idx + 1] = PURPLE[1]
      pixels[idx + 2] = PURPLE[2]

      // Draw a simple "T" letter in white
      const margin = size * 0.25
      const barThick = size * 0.13
      const stemThick = size * 0.13
      const centerX = size / 2

      // Horizontal bar of T
      if (y >= margin && y <= margin + barThick && x >= margin && x <= size - margin) {
        pixels[idx] = WHITE[0]
        pixels[idx + 1] = WHITE[1]
        pixels[idx + 2] = WHITE[2]
      }

      // Vertical stem of T
      if (x >= centerX - stemThick / 2 && x <= centerX + stemThick / 2 && y >= margin && y <= size - margin) {
        pixels[idx] = WHITE[0]
        pixels[idx + 1] = WHITE[1]
        pixels[idx + 2] = WHITE[2]
      }
    }
  }

  return createPNG(size, size, pixels)
}

// Generate
const publicDir = path.join(__dirname, '..', 'public')

console.log('Generating PWA icons...')

const icon192 = generateIcon(192)
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192)
console.log('  ✓ icon-192.png (192x192)')

const icon512 = generateIcon(512)
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512)
console.log('  ✓ icon-512.png (512x512)')

console.log('Done!')
