import hash from 'object-hash'
import pako from 'pako'

import { cacheFactory } from './cache-factory'
import { removeCacheByParamFactory } from './remove-cache-by-param'
import { Provider } from './types'

const defaultParams = { param: 'test' }
const defaultAssignment = 'mockConstructor'
const defaultHashedParams = hash([defaultAssignment, [defaultParams]])
const biggerParams = { param: 'test', param2: 'test', param3: 'test' }
const biggerHashedParams = hash([defaultAssignment, [biggerParams]])
const defaultResponse = {
  login: 'tassioFront',
  avatar_url: 'https://avatars.githubusercontent.com/u/47509510?v=4',
  gravatar_id: '',
  url: 'https://api.github.com/users/tassioFront',
  html_url: 'https://github.com/tassioFront',
  followers_url: 'https://api.github.com/users/tassioFront/followers',
  following_url:
    'https://api.github.com/users/tassioFront/following{/other_user}',
  gists_url: 'https://api.github.com/users/tassioFront/gists{/gist_id}',
  starred_url:
    'https://api.github.com/users/tassioFront/starred{/owner}{/repo}',
  subscriptions_url: 'https://api.github.com/users/tassioFront/subscriptions',
  organizations_url: 'https://api.github.com/users/tassioFront/orgs',
  repos_url: 'https://api.github.com/users/tassioFront/repos',
  events_url: 'https://api.github.com/users/tassioFront/events{/privacy}',
  received_events_url:
    'https://api.github.com/users/tassioFront/received_events',
  type: 'User',
  site_admin: false,
  name: 'Tássio',
  company: '@juntossomosmais',
  blog: 'https://frontend-pattern.vercel.app/about',
  location: 'Brazil',
  bio: "I'm FrontEnd Developer that love wine and coffee. ☕️🍷👨🏻‍💻",
  twitter_username: null,
  public_repos: 53,
  public_gists: 0,
  followers: 106,
  following: 77,
  created_at: '2019-02-10T23:25:10Z',
  updated_at: '2024-10-01T12:19:58Z',
}

const defaultResponse2 = {
  ...defaultResponse,
  login: 'anotherOne',
}

async function mockServiceFunction(...params) {
  return defaultResponse
}

const mockServiceFunctionSpy = jest.fn(mockServiceFunction)

const expireTime = 5 * 60 * 1000

const provider: Record<string, string> = {}

const mockProvider: Provider = {
  getItem: (key) => provider[key] as unknown as Uint8Array,
  setItem: (key, value) => {
    // @ts-ignore
    provider[key] = value
  },
  removeItem: (key) => {
    delete provider[key]
  },
  //@ts-ignore
  clear: () => {
    Object.keys(provider).forEach((key) => {
      delete provider[key]
    })
  },
}

function cachedServiceFunction<TParams extends unknown[], TResult>() {
  const cachedFunction = async (...params: TParams): Promise<TResult> => {
    return cacheFactory<TParams, TResult>({
      params,
      expire: expireTime,
      //@ts-ignore
      serviceFunction: mockServiceFunctionSpy,
      provider: mockProvider,
    })
  }

  const removeCacheByParam = removeCacheByParamFactory(
    mockProvider,
    mockServiceFunctionSpy
  )

  return { cachedFunction, removeCacheByParam }
}

describe('cacheFactory', () => {
  beforeEach(() => {
    // @ts-expect-error
    mockProvider.clear()
    jest.clearAllMocks()
    mockServiceFunctionSpy.mockClear()
  })

  it('should call the service function and cache the result', async () => {
    const result = await cachedServiceFunction().cachedFunction(defaultParams)

    expect(result).toEqual(defaultResponse)
    expect(mockServiceFunctionSpy).toHaveBeenCalledTimes(1)

    const cachedEntry = mockProvider.getItem(defaultHashedParams)

    expect(cachedEntry).not.toBeNull()

    const decompressedEntry = pako.inflate(cachedEntry, {
      to: 'string',
    })
    const entry = JSON.parse(decompressedEntry)

    expect(entry.data).toEqual(defaultResponse)
  })

  test.each([
    [defaultParams, defaultHashedParams],
    [biggerParams, biggerHashedParams],
  ])(
    'should call the service function again if the cache has expired and remove the data from the storage',
    async (params, hashedParams) => {
      await cachedServiceFunction().cachedFunction(params)

      const cachedEntry = mockProvider.getItem(hashedParams)
      const decompressedEntry = pako.inflate(cachedEntry, {
        to: 'string',
      })
      const entry = JSON.parse(decompressedEntry)

      // forcing the cache to expire
      entry.timestamp -= expireTime + 1
      const expiredCompressedEntry = pako.deflate(JSON.stringify(entry))

      mockProvider.setItem(hashedParams, expiredCompressedEntry)

      const result = await cachedServiceFunction().cachedFunction(params)

      expect(result).toEqual(defaultResponse)
      expect(mockServiceFunctionSpy).toHaveBeenCalledTimes(2)
      expect(mockProvider.getItem(hashedParams)).not.toBeNull()
    }
  )

  it('Should not call the service function again if cache is available', async () => {
    await cachedServiceFunction().cachedFunction(defaultParams)
    expect(mockServiceFunctionSpy).toHaveBeenCalledTimes(1)
    await cachedServiceFunction().cachedFunction(defaultParams)
    expect(mockServiceFunctionSpy).toHaveBeenCalledTimes(1)
  })

  it('Should remove the cache when removeCacheByParam is called and call the service function again', async () => {
    const { removeCacheByParam, cachedFunction } = cachedServiceFunction()

    expect(removeCacheByParam(defaultParams)).toBeNull()

    await cachedFunction(defaultParams)
    let cachedEntry = mockProvider.getItem(defaultHashedParams)

    expect(mockServiceFunctionSpy).toHaveBeenCalledTimes(1)
    expect(cachedEntry).not.toBeNull()
    expect(cachedEntry).not.toBeUndefined()

    removeCacheByParam(defaultParams)
    cachedEntry = mockProvider.getItem(defaultHashedParams)
    await cachedFunction(defaultParams)
    expect(mockServiceFunctionSpy).toHaveBeenCalledTimes(2)
    expect(cachedEntry).toBeUndefined()
  })

  it('should not set data in the cache if the service function throws an error', async () => {
    mockServiceFunctionSpy.mockImplementationOnce(async () => {
      throw new Error('Error')
    })
    let errorMessage = ''

    try {
      await cachedServiceFunction().cachedFunction(defaultParams)
    } catch (e) {
      errorMessage = (e as Error).message
    }

    expect(mockServiceFunctionSpy).toHaveBeenCalledTimes(1)
    expect(errorMessage).toBe('Error')
    expect(mockProvider.getItem(defaultHashedParams)).toBeUndefined()
  })
})

describe('cacheFactory with multiple params', () => {
  const multiHashedParams1 = hash([defaultAssignment, ['a', 1, { foo: 'bar' }]])
  const multiHashedParams2 = hash([defaultAssignment, ['b', 2, { foo: 'baz' }]])

  beforeEach(() => {
    // @ts-expect-error
    mockProvider.clear()
    jest.clearAllMocks()
    mockServiceFunctionSpy.mockClear()
  })

  it('should cache and retrieve with multiple params', async () => {
    const { cachedFunction } = cachedServiceFunction()
    const result = await cachedFunction('a', 1, { foo: 'bar' })

    expect(result).toEqual(defaultResponse)
    expect(mockServiceFunctionSpy).toHaveBeenCalledTimes(1)

    const cachedEntry = mockProvider.getItem(multiHashedParams1)

    expect(cachedEntry).not.toBeNull()
    const decompressedEntry = pako.inflate(cachedEntry, { to: 'string' })
    const entry = JSON.parse(decompressedEntry)

    expect(entry.data).toEqual(defaultResponse)
  })

  it('should use different cache keys for different param sets', async () => {
    const { cachedFunction } = cachedServiceFunction()

    await cachedFunction('a', 1, { foo: 'bar' })
    mockServiceFunctionSpy.mockResolvedValueOnce(defaultResponse2)
    await cachedFunction('b', 2, { foo: 'baz' })
    const cachedEntry1 = mockProvider.getItem(multiHashedParams1)
    const cachedEntry2 = mockProvider.getItem(multiHashedParams2)

    expect(cachedEntry1).not.toBeNull()
    expect(cachedEntry2).not.toBeNull()
    expect(multiHashedParams1).not.toEqual(multiHashedParams2)
    expect(cachedEntry2).not.toEqual(cachedEntry1)
  })

  it('should remove only the targeted cache entry for multiparams', async () => {
    const { cachedFunction, removeCacheByParam } = cachedServiceFunction()

    await cachedFunction('a', 1, { foo: 'bar' })
    await cachedFunction('b', 2, { foo: 'baz' })
    expect(mockProvider.getItem(multiHashedParams1)).not.toBeNull()
    expect(mockProvider.getItem(multiHashedParams2)).not.toBeNull()
    removeCacheByParam('a', 1, { foo: 'bar' })
    expect(mockProvider.getItem(multiHashedParams1)).toBeUndefined()
    expect(mockProvider.getItem(multiHashedParams2)).not.toBeNull()
  })
})

describe('cacheFactory respecting function name as namespace', () => {
  beforeEach(() => {
    // @ts-expect-error
    mockProvider.clear()
    jest.clearAllMocks()
    mockServiceFunctionSpy.mockClear()
  })

  const anotherMockFunction = () => {
    return Promise.resolve(defaultResponse2)
  }

  function anotherCachedServiceFunction<TParams extends unknown[], TResult>() {
    const cachedFunction = async (...params: TParams): Promise<TResult> => {
      return cacheFactory<TParams, TResult>({
        params,
        expire: expireTime,
        //@ts-ignore
        serviceFunction: anotherMockFunction,
        provider: mockProvider,
      })
    }

    const removeCacheByParam = removeCacheByParamFactory(
      mockProvider,
      anotherMockFunction
    )

    return { cachedFunction, removeCacheByParam }
  }

  const cacheGroup1 = cachedServiceFunction()
  const cacheGroup2 = anotherCachedServiceFunction()

  it('should cache and retrieve with function name as namespace', async () => {
    const anotherAssignment = 'anotherMockFunction'
    const anotherHashedParams = hash([anotherAssignment, [defaultParams]])
    const result = await cacheGroup1.cachedFunction(defaultParams)
    const result2 = await cacheGroup2.cachedFunction(defaultParams)

    const cachedEntry1 = mockProvider.getItem(defaultHashedParams)
    const cachedEntry2 = mockProvider.getItem(anotherHashedParams)

    expect(mockServiceFunctionSpy).toHaveBeenCalledTimes(1)

    expect(cachedEntry1).not.toBeNull()
    expect(cachedEntry2).not.toBeNull()
    const decompressedEntry1 = pako.inflate(cachedEntry1, { to: 'string' })
    const decompressedEntry2 = pako.inflate(cachedEntry2, { to: 'string' })
    const entry1 = JSON.parse(decompressedEntry1)
    const entry2 = JSON.parse(decompressedEntry2)

    expect(entry1.data).toEqual(defaultResponse)
    expect(entry2.data).toEqual(defaultResponse2)
    expect(result).not.toEqual(result2)

    expect(mockServiceFunctionSpy).toHaveBeenCalledTimes(1)
  })
})
