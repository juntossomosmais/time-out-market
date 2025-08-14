import hash from 'object-hash'

import { Provider } from './types'

/**
 * Delete cache by param (where param is the same param provided to the serviceFunction)
 * @param params: the parameters that will be used find the cache key (hash)
 * @param provider: the provider used to store the cache (such as in-memory, session storage, etc)
 */
export const removeCacheByParam = (
  provider: Provider,
  ...params: unknown[]
): void | null => {
  const key = hash(params)
  const cachedEntry = provider.getItem(key)

  if (!cachedEntry) {
    return null
  }

  provider.removeItem(key)
}
