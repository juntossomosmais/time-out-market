export interface CacheEntry<TResult> {
  timestamp: number
  data: TResult
}

export type Provider = {
  getItem: (key: string) => Uint8Array
  setItem: (key: string, value: Uint8Array) => void
  removeItem: (key: string) => void
}

export type ServiceFunction<TParams extends unknown[], TResult> = (
  ...params: TParams
) => Promise<TResult>

export type CacheFactory<TParams extends unknown[], TResult> = {
  params: TParams
  expire: number
  serviceFunction: ServiceFunction<TParams, TResult>
  provider: Provider
}
