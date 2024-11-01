import { cacheFactory } from './cache-factory';
import { ServiceFunction } from './types';
import { sessionStorageProvider } from './providers/session-storage';

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
export const cacheOnSessionStorage = <TParams extends unknown[], TResult>(
  serviceFunction: ServiceFunction<TParams, TResult>,
  expire: number
): ServiceFunction<TParams, TResult> => {
  return async (...params: TParams): Promise<TResult> => {
    return cacheFactory<TParams, TResult>({
      params,
      expire,
      serviceFunction,
      provider: sessionStorageProvider,
    });
  };
};
