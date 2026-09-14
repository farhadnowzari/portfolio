// link-registry.spec.ts — links.ts is the only allowed-URL registry (plot v4 §5: "Nothing else may
// appear on the site."). No raw `http`/`mailto:` string may live anywhere else under src/.
import { describe, expect, it } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const srcDir = resolve(process.cwd(), 'src')
const registryFile = join(srcDir, 'data', 'links.ts')

function walk(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) out.push(...walk(full))
    else if (/\.(ts|vue)$/.test(entry)) out.push(full)
  }
  return out
}

describe('link registry is the only URL source', () => {
  const offenders: { file: string; line: number; text: string }[] = []

  for (const file of walk(srcDir)) {
    if (file === registryFile) continue
    const lines = readFileSync(file, 'utf-8').split('\n')
    lines.forEach((line, i) => {
      if (/https?:\/\//.test(line) || /mailto:/.test(line)) {
        offenders.push({ file: relative(srcDir, file), line: i + 1, text: line.trim() })
      }
    })
  }

  it('has no raw http(s):// or mailto: strings outside data/links.ts', () => {
    expect(offenders).toEqual([])
  })
})
