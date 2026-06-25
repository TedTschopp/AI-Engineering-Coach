/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/* Webview-side runtime token/cost reporting state. */

import { FF_TOKEN_REPORTING_ENABLED } from '../core/constants';
import { rpc, vscode } from './shared';

type TokenReportingListener = (enabled: boolean) => void;

interface WebviewState {
  tokenReportingEnabled?: boolean;
  [key: string]: unknown;
}

const listeners = new Set<TokenReportingListener>();

function readLocalState(): WebviewState {
  const state = vscode.getState();
  return state && typeof state === 'object' ? state as WebviewState : {};
}

let tokenReportingEnabled = typeof readLocalState().tokenReportingEnabled === 'boolean'
  ? Boolean(readLocalState().tokenReportingEnabled)
  : FF_TOKEN_REPORTING_ENABLED;

function persistLocalState(enabled: boolean): void {
  const state = readLocalState();
  vscode.setState({ ...state, tokenReportingEnabled: enabled });
}

function updateTokenReportingState(enabled: boolean): void {
  if (tokenReportingEnabled === enabled) return;
  tokenReportingEnabled = enabled;
  persistLocalState(enabled);
  for (const listener of listeners) listener(enabled);
}

export function isTokenReportingEnabled(): boolean {
  return tokenReportingEnabled;
}

export function onTokenReportingChanged(listener: TokenReportingListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function loadTokenReportingSetting(): Promise<boolean> {
  const result = await rpc<{ enabled: boolean }>('loadTokenReportingSetting', {});
  updateTokenReportingState(result.enabled);
  return tokenReportingEnabled;
}

export async function saveTokenReportingSetting(enabled: boolean): Promise<boolean> {
  const previous = tokenReportingEnabled;
  updateTokenReportingState(enabled);
  try {
    const result = await rpc<{ enabled: boolean }>('saveTokenReportingSetting', { enabled });
    updateTokenReportingState(result.enabled);
    return tokenReportingEnabled;
  } catch (error) {
    updateTokenReportingState(previous);
    throw error;
  }
}
