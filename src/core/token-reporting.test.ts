/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { describe, expect, it } from 'vitest';
import { FF_TOKEN_REPORTING_ENABLED } from './constants';
import { readTokenReportingEnabled, TOKEN_REPORTING_STATE_KEY, TokenReportingStateStore } from './token-reporting';

function storeWithValue(value: unknown): TokenReportingStateStore {
  return {
    get<T>(_key: string, defaultValue: T): T {
      return (value === undefined ? defaultValue : value) as T;
    },
  };
}

describe('readTokenReportingEnabled', () => {
  it('uses the compile-time flag when no persisted store is available', () => {
    expect(readTokenReportingEnabled()).toBe(FF_TOKEN_REPORTING_ENABLED);
  });

  it('uses the persisted runtime preference when it is boolean', () => {
    expect(readTokenReportingEnabled(storeWithValue(false))).toBe(false);
    expect(readTokenReportingEnabled(storeWithValue(true))).toBe(true);
  });

  it('falls back to the compile-time flag for malformed persisted values', () => {
    expect(readTokenReportingEnabled(storeWithValue('false'))).toBe(FF_TOKEN_REPORTING_ENABLED);
  });

  it('keeps the stable VS Code globalState key', () => {
    expect(TOKEN_REPORTING_STATE_KEY).toBe('tokenReportingEnabled');
  });
});
