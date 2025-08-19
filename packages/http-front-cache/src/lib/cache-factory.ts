import hash from 'object-hash'
import { deflate, inflate } from 'pako'

import { CacheEntry, CacheFactory } from './types'

/**
 * BE CAREFUL ON USE IT!!! Use the following constraints to understand when to use it:
 * 1) The data to be cached is not too big;
 * 2) The data to be cached is not sensitive;
 * 3) The data to be cached does not change too often;
 * 4) The cache does not need to be updated depends on the user navigation (ex: caching truck/cart data is not recommended as user can add more products and the cache will not be updated)
 * 5) The service parameters do not change too often (if it change too ofter, the cache will not be used);
 *
 * @param params: the parameters that will be used to generate the cache key
 * @param expire: the time in milliseconds that the cache will be valid
 * @param serviceFunction: the service function that will be cached (it can't be anonymous)
 * @param provider: the provider that will store the cache (such as in-memory, session storage, etc)
 */
export const cacheFactory = async <TParams extends unknown[], TResult>(
  args: CacheFactory<TParams, TResult>
) => {
  const { params, expire, serviceFunction, provider } = args
  const assignment = serviceFunction.name

  if (!assignment) {
    /*
     * the service function name is required to generate the cache key and avoid caching conflicts.
     * if you have two service functions with the same parameters, they will conflict and the cache will not work as expected.
     * params = 'nice-param'
     * serviceFunction(params)
     * serviceFunction2(params) // same params
     *
     * They will generate different cache keys (once the service functions name are different) and the cache will work as expected.
     */
    throw new Error('Anonymous service functions are disallowed')
  }

  const key = hash([assignment, params])

  const now = Date.now()

  const cachedEntry = provider.getItem(key)

  if (cachedEntry) {
    const decompressedEntry = inflate(cachedEntry, {
      to: 'string',
    })
    const entry = JSON.parse(decompressedEntry) as CacheEntry<TResult>

    if (now - entry.timestamp < expire) {
      return entry.data
    }

    provider.removeItem(key)
  }

  const result = await serviceFunction(...params)
  const cacheEntry: CacheEntry<TResult> = { timestamp: now, data: result }
  const compressedEntry = deflate(JSON.stringify(cacheEntry))

  provider.setItem(key, compressedEntry)

  return result
}
