import { sessionStorageProvider } from './session-storage'

describe('sessionStorageProvider', () => {
  beforeEach(() => {
    const mockSessionStorage = (() => {
      const store = {}

      return {
        getItem: jest.fn((key) => store[key] as string),
        setItem: jest.fn((key, value: string) => {
          store[key] = value
        }),
        removeItem: jest.fn((key) => {
          delete store[key]
        }),
      }
    })()

    Object.defineProperty(global, 'sessionStorage', {
      value: mockSessionStorage,
    })
  })

  it('should get item from sessionStorage', () => {
    const key = 'testKey'
    const value = new Uint8Array([1, 2, 3])

    sessionStorageProvider.setItem(key, value)

    const result = sessionStorageProvider.getItem(key)

    expect(sessionStorage.getItem).toHaveBeenCalledWith(key)
    expect(result).toEqual({
      '0': 1,
      '1': 2,
      '2': 3,
    })
  })

  it('should set item in sessionStorage', () => {
    const key = 'testKey'
    const value = new Uint8Array([1, 2, 3])

    sessionStorageProvider.setItem(key, value)

    expect(sessionStorage.setItem).toHaveBeenCalledWith(
      key,
      JSON.stringify(value)
    )
  })

  it('should remove item from sessionStorage', () => {
    const key = 'testKey'

    sessionStorageProvider.removeItem(key)

    expect(sessionStorage.removeItem).toHaveBeenCalledWith(key)
  })
})
