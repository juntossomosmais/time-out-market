import { sessionStorageProvider } from './providers/session-storage'
import { removeCacheByParam } from './remove-cache-by-param'

/**
 * Delete the cache on sessionStorage by param (where param is the same param provided to the serviceFunction)
 * @param params: the parameters that will be used find the cache key (hash)
 */
export const removeCacheByParamOnSessionStorage = (
  ...params: unknown[]
): void | null => {
  removeCacheByParam(sessionStorageProvider, ...params)
}
