import { Provider } from '../types'

/**
 * sessionStorage only holds strings, and the cached payload is a compressed
 * Uint8Array. JSON.stringify would serialize it as `{"0":31,"1":139,...}`,
 * expanding it beyond the original JSON and losing the compression gain, so we
 * encode the raw bytes as base64 instead.
 */
const toBase64 = (bytes: Uint8Array): string =>
  btoa(Array.from(bytes, (byte) => String.fromCodePoint(byte)).join(''))

const fromBase64 = (value: string): Uint8Array =>
  Uint8Array.from(atob(value), (char) => char.codePointAt(0) ?? 0)

export const sessionStorageProvider: Provider = {
  getItem: (key) => {
    const stored = sessionStorage.getItem(key)

    return stored ? fromBase64(stored) : null
  },
  setItem: (key, value) => sessionStorage.setItem(key, toBase64(value)),
  removeItem: (key) => sessionStorage.removeItem(key),
}
