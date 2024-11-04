import * as cacheFactory from './cache-factory'
import { cacheOnSessionStorage } from './cache-on-session-storage'
import { sessionStorageProvider } from './providers/session-storage'

jest.mock('./providers/session-storage.ts', () => ({
  sessionStorageProvider: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
}))

const cacheFactoryMock = jest.spyOn(cacheFactory, 'cacheFactory')

describe('cacheOnSessionStorage', () => {
  it('should call cacheFactory with sessionStorageProvider', async () => {
    const serviceFunction = jest.fn()
    const expire = 1000
    const cachedServiceFunction = cacheOnSessionStorage(serviceFunction, expire)

    await cachedServiceFunction()

    expect(cacheFactoryMock).toHaveBeenCalledWith({
      params: [],
      expire,
      serviceFunction,
      provider: sessionStorageProvider,
    })
  })
})
