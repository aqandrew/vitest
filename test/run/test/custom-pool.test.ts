import { expect, test } from 'vitest'
import { runVitestCli } from '../../test-utils'

test('can run custom pools with Vitest', async () => {
  const vitest = await runVitestCli('--run', '--root', 'pool-custom-fixtures')

  expect(vitest.stderr).toMatchInlineSnapshot(`
    "[pool] printing: options are respected
    [pool] running tests for custom-pool-test in /pool-custom-fixtures/tests/custom-not-run.spec.ts
    [pool] custom pool is closed!
    "
  `)

  expect(vitest.stdout).toContain('✓ |custom-pool-test| tests/custom-not-run.spec.ts')
  expect(vitest.stdout).toContain('✓ |custom-pool-test| tests/custom-run.threads.spec.ts')
  expect(vitest.stdout).toContain('Test Files  2 passed')
  expect(vitest.stdout).toContain('Tests  2 passed')
})
