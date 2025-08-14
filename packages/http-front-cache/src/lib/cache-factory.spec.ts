import hash from 'object-hash'
import pako from 'pako'

import { cacheFactory } from './cache-factory'
import { removeCacheByParam } from './remove-cache-by-param'
import { Provider } from './types'

const defaultParams = { param: 'test' }
const defaultHashedParams = hash([defaultParams])
const biggerParams = { param: 'test', param2: 'test', param3: 'test' }
const biggerHashedParams = hash([biggerParams])
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
const mockServiceFunction = jest.fn(async (param: any) => {
  return defaultResponse
})

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

const cachedServiceFunction = (params: any) => {
  return cacheFactory({
    params: [params],
    expire: expireTime,
    serviceFunction: mockServiceFunction,
    provider: mockProvider,
  })
}

describe('cacheFactory', () => {
  beforeEach(() => {
    // @ts-ignore
    mockProvider.clear()
    jest.clearAllMocks()
  })

  it('should call the service function and cache the result', async () => {
    const result = await cachedServiceFunction(defaultParams)

    expect(result).toEqual(defaultResponse)
    expect(mockServiceFunction).toHaveBeenCalledTimes(1)

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
      await cachedServiceFunction(params)

      const cachedEntry = mockProvider.getItem(hashedParams)
      const decompressedEntry = pako.inflate(cachedEntry, {
        to: 'string',
      })
      const entry = JSON.parse(decompressedEntry)

      // forcing the cache to expire
      entry.timestamp -= expireTime + 1
      const expiredCompressedEntry = pako.deflate(JSON.stringify(entry))

      mockProvider.setItem(hashedParams, expiredCompressedEntry)

      const result = await cachedServiceFunction(params)

      expect(result).toEqual(defaultResponse)
      expect(mockServiceFunction).toHaveBeenCalledTimes(2)
      expect(mockProvider.getItem(hashedParams)).not.toBeNull()
    }
  )

  it('Should not call the service function again if cache is available', async () => {
    await cachedServiceFunction(defaultParams)
    expect(mockServiceFunction).toHaveBeenCalledTimes(1)
    await cachedServiceFunction(defaultParams)
    expect(mockServiceFunction).toHaveBeenCalledTimes(1)
  })

  it('Should remove the cache when removeCacheByParam is called and call the service function again', async () => {
    await cachedServiceFunction(defaultParams)
    let cachedEntry = mockProvider.getItem(defaultHashedParams)

    expect(mockServiceFunction).toHaveBeenCalledTimes(1)
    expect(cachedEntry).not.toBeNull()
    expect(cachedEntry).not.toBeUndefined()

    removeCacheByParam(mockProvider, defaultParams)
    cachedEntry = mockProvider.getItem(defaultHashedParams)
    await cachedServiceFunction(defaultParams)
    expect(mockServiceFunction).toHaveBeenCalledTimes(2)
    expect(cachedEntry).toBeUndefined()
  })

  it('should not set data in the cache if the service function throws an error', async () => {
    mockServiceFunction.mockImplementationOnce(async () => {
      throw new Error('Error')
    })
    let errorMessage = ''

    try {
      await cachedServiceFunction(defaultParams)
    } catch (e) {
      errorMessage = (e as Error).message
    }

    expect(mockServiceFunction).toHaveBeenCalledTimes(1)
    expect(errorMessage).toBe('Error')
    expect(mockProvider.getItem(defaultHashedParams)).toBeUndefined()
  })
})
