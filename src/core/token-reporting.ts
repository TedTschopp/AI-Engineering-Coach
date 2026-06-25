/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Runtime token/cost reporting preference.
 *
 * The compile-time constant remains the default. The persisted VS Code global
 * state value is the runtime source of truth, so the user's preference survives
 * reloads, rebuilds, and local extension reinstalls.
 */

import { FF_TOKEN_REPORTING_ENABLED } from './constants';

export const TOKEN_REPORTING_STATE_KEY = 'tokenReportingEnabled';

export interface TokenReportingStateStore {
  get<T>(key: string, defaultValue: T): T;
}

export function readTokenReportingEnabled(store?: TokenReportingStateStore): boolean {
  if (!store) return FF_TOKEN_REPORTING_ENABLED;
  const stored = store.get<boolean>(TOKEN_REPORTING_STATE_KEY, FF_TOKEN_REPORTING_ENABLED);
  return typeof stored === 'boolean' ? stored : FF_TOKEN_REPORTING_ENABLED;
}

