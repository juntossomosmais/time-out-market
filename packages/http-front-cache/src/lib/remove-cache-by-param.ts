import hash from 'object-hash'

import { Provider, ServiceFunction } from './types'

/**
 * Delete cache by param (where param is the same param provided to the serviceFunction)
 * @param serviceFunctionName: a unique string to identify the cache origin (e.g., service name)
 * @param params: the parameters that will be used find the cache key (hash)
 * @param provider: the provider used to store the cache (such as in-memory, session storage, etc)
 */
export function removeCacheByParam(
  provider: Provider,
  serviceFunctionName: string,
  ...params: unknown[]
): void {
  const key = hash([serviceFunctionName, params])
  const cachedEntry = provider.getItem(key)

  if (!cachedEntry) {
    return
  }

  provider.removeItem(key)
}

/**
 * Creates a cache remover bound to a service function, using its name as cacheAssignment.
 * @param provider The cache provider (e.g., sessionStorageProvider)
 * @param serviceFunction The service function whose cache you want to remove
 */
export function removeCacheByParamFactory<TParams extends unknown[], TResult>(
  provider: Provider,
  serviceFunction: ServiceFunction<TParams, TResult>
) {
  return (...params: TParams) =>
    removeCacheByParam(provider, serviceFunction.name, ...params)
}
