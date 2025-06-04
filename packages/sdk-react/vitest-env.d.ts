/// <reference types="vitest" />
/// <reference types="vitest/globals" />

import type { TestAPI, ExpectStatic, MockInstance, Vi } from 'vitest'

declare global {
  const describe: TestAPI['describe']
  const it: TestAPI['it']
  const test: TestAPI['test']
  const expect: ExpectStatic
  const vi: Vi
  const beforeAll: TestAPI['beforeAll']
  const afterAll: TestAPI['afterAll']
  const beforeEach: TestAPI['beforeEach']
  const afterEach: TestAPI['afterEach']
}
