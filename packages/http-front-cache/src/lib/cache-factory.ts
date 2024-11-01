import pako from 'pako';
import hash from 'object-hash';
import { CacheEntry, CacheFactory } from './types';
export const cacheFactory = async <TParams extends unknown[], TResult>({
  params,
  expire,
  serviceFunction,
  provider,
}: CacheFactory<TParams, TResult>) => {
  const key = hash(params);
  const now = Date.now();

  const cachedEntry = provider.getItem(key);

  if (cachedEntry) {
    const decompressedEntry = pako.inflate(cachedEntry, {
      to: 'string',
    });
    const entry = JSON.parse(decompressedEntry) as CacheEntry<TResult>;

    if (now - entry.timestamp < expire) {
      return entry.data;
    }

    provider.removeItem(key);
  }

  const result = await serviceFunction(...params);
  const cacheEntry: CacheEntry<TResult> = { timestamp: now, data: result };
  const compressedEntry = pako.deflate(JSON.stringify(cacheEntry));

  provider.setItem(key, compressedEntry);

  return result;
};
