import * as cacheFactory from './cache-factory'
import { cacheOnSessionStorage } from './cache-on-session-storage'
import { sessionStorageProvider } from './providers/session-storage'
import * as removeCacheByParamModule from './remove-cache-by-param'
jest.mock('./providers/session-storage', () => ({
  sessionStorageProvider: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
}))

const cacheFactoryMock = jest.spyOn(cacheFactory, 'cacheFactory')
const removeCacheByParamFactory = jest
  .spyOn(removeCacheByParamModule, 'removeCacheByParamFactory')
  .mockImplementation(jest.fn())
const params = ['test']

describe('cacheOnSessionStorage', () => {
  const serviceFunction = jest.fn()
  const expire = 1000

  it('should call cacheFactory with sessionStorageProvider', async () => {
    const { cachedFunction } = cacheOnSessionStorage(serviceFunction, expire)

    await cachedFunction(params)

    expect(cacheFactoryMock).toHaveBeenCalledWith({
      params: [params],
      expire,
      serviceFunction,
      provider: sessionStorageProvider,
    })
    expect(removeCacheByParamFactory).toHaveBeenCalledWith(
      sessionStorageProvider,
      serviceFunction
    )
  })
})
