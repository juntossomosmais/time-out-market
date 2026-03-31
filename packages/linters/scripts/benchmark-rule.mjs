/* eslint-disable no-console */
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { argv, exit } from 'node:process'
import { fileURLToPath } from 'node:url'

import Benchmark from 'benchmark'
import picocolors from 'picocolors'
import stylelint from 'stylelint'

const { bold } = picocolors

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

const SUPPORTED_RULES = ['use-tokens', 'use-zindex-tokens']
const [, , ruleName] = argv

function printHelp() {
  console.log(`Usage: node scripts/benchmark-rule.mjs <ruleName>`)
  console.log(``)
  console.log(`Supported rules: ${SUPPORTED_RULES.join(', ')}`)
  console.log(``)
  console.log(`Examples:`)
  console.log(`  node scripts/benchmark-rule.mjs use-tokens`)
  console.log(`  node scripts/benchmark-rule.mjs use-zindex-tokens`)
}

if (!ruleName || !SUPPORTED_RULES.includes(ruleName)) {
  printHelp()
  exit(1)
}

const tokens = require('@juntossomosmais/atomium-tokens/tokens.json')

// Generate CSS that exercises the rule with many matching declarations.
// Duplicating N times gives a larger mean while reducing deviation.
const DUPLICATE_SOURCE_N_TIMES = 50

function generateUseTokensCSS() {
  const hexColorTokens = Object.entries(tokens)
    .filter(
      ([key]) => !['zindex', 'border-radius'].some((s) => key.includes(s))
    )
    .filter(([, value]) => value.startsWith('#'))

  const spacingTokens = Object.entries(tokens).filter(([key]) =>
    key.startsWith('spacing')
  )

  const lines = []

  // Invalid declarations that should be flagged
  for (const [tokenName, tokenValue] of hexColorTokens) {
    lines.push(`.rule-${tokenName} { color: ${tokenValue}; }`)
    lines.push(`.bg-${tokenName} { background-color: ${tokenValue}; }`)
    lines.push(`.border-${tokenName} { border: 1px solid ${tokenValue}; }`)
  }

  for (const [tokenName, tokenValue] of spacingTokens) {
    lines.push(`.spacing-${tokenName} { margin: ${tokenValue}; }`)
    lines.push(`.padding-${tokenName} { padding: ${tokenValue}; }`)
  }

  // Valid declarations (should pass without warnings)
  for (const [tokenName] of hexColorTokens) {
    lines.push(`.valid-${tokenName} { color: var(--${tokenName}); }`)
  }

  return lines.join('\n')
}

function generateUseZIndexCSS() {
  const zIndexTokens = Object.entries(tokens).filter(([key]) =>
    key.includes('zindex')
  )

  const lines = []

  // Invalid: use raw numbers that match tokens
  for (const [tokenName, tokenValue] of zIndexTokens) {
    lines.push(`.el-${tokenName} { z-index: ${tokenValue}; }`)
  }

  // Invalid: unknown static values (no matching token)
  for (let i = 0; i < 20; i++) {
    lines.push(`.unknown-${i} { z-index: ${50 + i * 3}; }`)
  }

  // Valid: already using var()
  for (const [tokenName] of zIndexTokens) {
    lines.push(`.valid-${tokenName} { z-index: var(--${tokenName}); }`)
  }

  return lines.join('\n')
}

const baseCSS =
  ruleName =
== 'use-tokens' ? generateUseTokensCSS() : generateUseZIndexCSS()

let css = ''
for (let i = 0; i < DUPLICATE_SOURCE_N_TIMES; i++) {
  css += `${baseCSS}\n\n`
}

const pluginPath = resolve(__dirname, `../src/stylelint/plugins/${ruleName}.js`)
const lintConfig = {
  plugins: [pluginPath],
  rules: { [`plugin/${ruleName}`]: true },
  cache: false,
  formatter: () => '',
}

const lint = (code) => stylelint.lint({ code, config: lintConfig })

console.log(
  bold(`Benchmarking rule: plugin/${ruleName}`),
  `(${css.split('\n').length} lines)`
)

let firstRun = true
let lazyResult

const bench = new Benchmark('rule test', {
  defer: true,
  setup: () => {
    lazyResult = lint(css)
  },
  onCycle: () => {
    lazyResult = lint(css)
  },
  fn: (deferred) => {
    lazyResult
      .then((result) => {
        if (firstRun) {
          firstRun = false
          result.results.forEach(
            ({ parseErrors, invalidOptionWarnings, warnings }) => {
              parseErrors.forEach(({ text }) =>
                console.error(bold(`>> Parse error: ${text}`))
              )
              invalidOptionWarnings.forEach(({ text }) =>
                console.warn(bold(`>> Invalid option: ${text}`))
              )
              console.log(`${bold('Warnings')}: ${warnings.length}`)
            }
          )
        }

        deferred.resolve()
      })
      .catch((err) => {
        console.error(err.stack)
        deferred.resolve()
      })
  },
})

bench.on('complete', () => {
  console.log(`${bold('Mean')}: ${(bench.stats.mean * 1000).toFixed(2)} ms`)
  console.log(
    `${bold('Deviation')}: ${(bench.stats.deviation * 1000).toFixed(2)} ms`
  )
  console.log(`${bold('Runs')}: ${bench.stats.sample.length}`)
})

bench.run()
