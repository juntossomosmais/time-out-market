import { TextDecoder, TextEncoder } from 'util'

// jsdom does not expose TextEncoder/TextDecoder globally, but pako v3 relies on
// the native Web APIs (always available in real browsers). Polyfill them here.
Object.assign(globalThis, { TextEncoder, TextDecoder })
