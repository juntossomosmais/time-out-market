import { cacheFactory } from './cache-factory'
import { sessionStorageProvider } from './providers/session-storage'
import { removeCacheByParamFactory } from './remove-cache-by-param'
import { ServiceFunction } from './types'

/**
 * BE CAREFUL ON USE IT!!! Use the following constraints to understand when to use it:
 * 1) The data to be cached is not too big;
 * 2) The data to be cached is not sensitive;
 * 3) The data to be cached does not change too often;
 * 4) The cache does not need to be updated depends on the user navigation (ex: caching truck/cart data is not recommended as user can add more products and the cache will not be updated)
 * 5) The service parameters do not change too often (if it change too ofter, the cache will not be used);
 *
 * @param serviceFunction: the service function that will be cached
 * @param expire: the time in milliseconds that the cache will be valid
 */

export function cacheOnSessionStorage<TParams extends unknown[], TResult>(
  serviceFunction: ServiceFunction<TParams, TResult>,
  expire: number
) {
  const cachedFunction = async (...params: TParams): Promise<TResult> => {
    return cacheFactory<TParams, TResult>({
      params,
      expire,
      serviceFunction,
      provider: sessionStorageProvider,
    })
  }

  const removeCacheByParamOnSessionStorage = removeCacheByParamFactory(
    sessionStorageProvider,
    serviceFunction
  )

  return { cachedFunction, removeCacheByParamOnSessionStorage }
}
