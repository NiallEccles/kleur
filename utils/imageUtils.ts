import type { ColorValue } from '../types/color'

/**
 * Sample pixels from ImageData, skipping transparent ones.
 * Returns up to maxSamples [r,g,b] triples.
 */
export function samplePixels(
  imageData: ImageData,
  maxSamples = 2000,
): [number, number, number][] {
  const { data, width, height } = imageData
  const total = width * height
  const stride = Math.max(1, Math.floor(total / maxSamples))
  const result: [number, number, number][] = []

  for (let i = 0; i < total; i += stride) {
    const offset = i * 4
    if (data[offset + 3] < 128) continue
    result.push([data[offset], data[offset + 1], data[offset + 2]])
  }

  return result
}

function distSq(
  a: [number, number, number],
  b: [number, number, number],
): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2
}

/**
 * K-means++ clustering on RGB pixels.
 * Returns k centroids sorted by cluster size (largest first).
 */
export function kmeans(
  pixels: [number, number, number][],
  k: number,
  maxIter = 20,
): [number, number, number][] {
  if (pixels.length === 0) return []
  k = Math.min(k, pixels.length)

  // k-means++ initialisation
  const centroids: [number, number, number][] = []
  centroids.push(pixels[Math.floor(Math.random() * pixels.length)])

  for (let c = 1; c < k; c++) {
    const dists = pixels.map(p => {
      let minD = Infinity
      for (const centroid of centroids) {
        const d = distSq(p, centroid)
        if (d < minD) minD = d
      }
      return minD
    })

    const total = dists.reduce((s, d) => s + d, 0)
    let rand = Math.random() * total
    let chosen = 0
    for (let i = 0; i < dists.length; i++) {
      rand -= dists[i]
      if (rand <= 0) {
        chosen = i
        break
      }
    }
    centroids.push([...pixels[chosen]] as [number, number, number])
  }

  // Iterate
  const assignments = new Int32Array(pixels.length)

  for (let iter = 0; iter < maxIter; iter++) {
    let changed = false
    for (let i = 0; i < pixels.length; i++) {
      let best = 0
      let bestD = Infinity
      for (let c = 0; c < centroids.length; c++) {
        const d = distSq(pixels[i], centroids[c])
        if (d < bestD) {
          bestD = d
          best = c
        }
      }
      if (assignments[i] !== best) {
        assignments[i] = best
        changed = true
      }
    }
    if (!changed) break

    // Recompute means
    const sums: [number, number, number, number][] = Array.from(
      { length: k },
      () => [0, 0, 0, 0],
    )
    for (let i = 0; i < pixels.length; i++) {
      const c = assignments[i]
      sums[c][0] += pixels[i][0]
      sums[c][1] += pixels[i][1]
      sums[c][2] += pixels[i][2]
      sums[c][3]++
    }
    for (let c = 0; c < k; c++) {
      const n = sums[c][3]
      if (n > 0) {
        centroids[c] = [sums[c][0] / n, sums[c][1] / n, sums[c][2] / n]
      }
    }
  }

  // Sort by cluster size (largest first)
  const sizes = new Array(k).fill(0)
  for (let i = 0; i < pixels.length; i++) sizes[assignments[i]]++
  const indexed = centroids.map((c, i) => ({ c, size: sizes[i] }))
  indexed.sort((a, b) => b.size - a.size)
  return indexed.map(x => x.c)
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)))
  return '#' + [clamp(r), clamp(g), clamp(b)]
    .map(v => v.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Extract k dominant colors from ImageData as hex ColorValues.
 */
export function extractDominantColors(
  imageData: ImageData,
  k: number,
): ColorValue[] {
  const pixels = samplePixels(imageData)
  const centroids = kmeans(pixels, k)
  return centroids.map(([r, g, b]) => ({
    space: 'hex' as const,
    value: rgbToHex(r, g, b),
  }))
}
