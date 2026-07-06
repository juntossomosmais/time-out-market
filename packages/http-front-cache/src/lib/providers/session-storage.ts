import { Provider } from '../types'

/**
 * sessionStorage only holds strings, and the cached payload is a compressed
 * Uint8Array. JSON.stringify would serialize it as `{"0":31,"1":139,...}`,
 * expanding it beyond the original JSON and losing the compression gain, so we
 * encode the raw bytes as base64 instead.
 */
const toBase64 = (bytes: Uint8Array): string => {
  let binary = ''

  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary)
}

const fromBase64 = (value: string): Uint8Array => {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

export const sessionStorageProvider: Provider = {
  getItem: (key) => {
    const stored = sessionStorage.getItem(key)

    return stored ? fromBase64(stored) : null
  },
  setItem: (key, value) => sessionStorage.setItem(key, toBase64(value)),
  removeItem: (key) => sessionStorage.removeItem(key),
}
