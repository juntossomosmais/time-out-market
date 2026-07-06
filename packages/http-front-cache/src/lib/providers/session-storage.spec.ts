import { sessionStorageProvider } from './session-storage'

describe('sessionStorageProvider', () => {
  beforeEach(() => {
    const mockSessionStorage = (() => {
      const store: Record<string, string> = {}

      return {
        getItem: jest.fn((key: string) => store[key] ?? null),
        setItem: jest.fn((key: string, value: string) => {
          store[key] = value
        }),
        removeItem: jest.fn((key: string) => {
          delete store[key]
        }),
      }
    })()

    Object.defineProperty(global, 'sessionStorage', {
      value: mockSessionStorage,
      configurable: true,
    })
  })

  it('should round-trip the exact bytes through sessionStorage', () => {
    const key = 'testKey'
    const value = new Uint8Array([31, 139, 8, 0, 255])

    sessionStorageProvider.setItem(key, value)
    const result = sessionStorageProvider.getItem(key)

    expect(result).toBeInstanceOf(Uint8Array)
    expect(result).toEqual(value)
  })

  it('should store the value as a base64 string, not a JSON object', () => {
    const key = 'testKey'
    const value = new Uint8Array([1, 2, 3])

    sessionStorageProvider.setItem(key, value)

    const stored = (sessionStorage.setItem as jest.Mock).mock.calls[0][1]

    expect(typeof stored).toBe('string')
    expect(stored).not.toContain('{')
  })

  it('should return null when the key is not present', () => {
    expect(sessionStorageProvider.getItem('missingKey')).toBeNull()
  })

  it('should remove item from sessionStorage', () => {
    const key = 'testKey'

    sessionStorageProvider.removeItem(key)

    expect(sessionStorage.removeItem).toHaveBeenCalledWith(key)
  })
})
