<div align="center">
  <h1>Time Out Market - http-front-cache</h1>
  <p>
    <a href="https://github.com/juntossomosmais/time-out-market/releases">
      <img src="https://img.shields.io/github/package-json/v/juntossomosmais/time-out-market?filename=packages%2Fhttp-front-cache%2Fpackage.json" alt="version">
    </a>
    <img
      alt="Quality Gate"
      src="https://sonarcloud.io/api/project_badges/measure?project=juntossomosmais_time-out-market-http-front-cache&metric=alert_status&token=c9d6442485c01c9643b62d84f45a1491dd0d21b1"
    />
    <img
      alt="Coverage"
      src="https://sonarcloud.io/api/project_badges/measure?project=juntossomosmais_time-out-market-http-front-cache&metric=coverage&token=c9d6442485c01c9643b62d84f45a1491dd0d21b1"
    />
  </p>
  <br />
</div>

The `http-front-cache` utility was created to provide a simple and efficient way to cache the results of service functions in the browser's session storage (it is extensible to other storages, see more on [Using another Storage as Provider](#using-another-storage-as-provider)). This can significantly improve the performance of applications by reducing the number of redundant network requests and computations. However, it is important to use this utility with caution and adhere to the following constraints:

1. The data to be cached is not too big.
2. The data to be cached is not sensitive.
3. The data to be cached does not change too often.
4. The cache does not need to be updated based on user navigation (e.g., caching cart data is not recommended as the user can add more products and the cache will not be updated).
5. The service parameters do not change too often (if they change too often, the cache will not be used).

## Installing utility packages

- create the GITHUB_TOKEN in [personal-access-tokens-classic](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#personal-access-tokens-classic)
- create a `.npmrc` file in the root of the project with the following content:
```
//npm.pkg.github.com/:_authToken=GITHUB_TOKEN
@juntossomosmais:registry=https://npm.pkg.github.com
```

```bash
npm i @juntossomosmais/http-front-cache
```

## How to Use

### Example

```typescript
import { cacheOnSessionStorage } from '@juntossomosmais/http-front-cache';

type Params = [string];
type Result = { data: string[] };

const fetchData = async (param) => {
  const response = await fetch(`https://api.example.com/data?param=${param}`);
  return response.json();
};

const cachedFetchData = cacheOnSessionStorage(fetchData, 5 * 60 * 1000); // Cache for 5 minutes

// Usage
cachedFetchData('exampleParam').then((result) => {
  console.log(result);
});
```

## Using another Storage as Provider

Currently, the `cacheOnSessionStorage` uses [session storage as provider](https://github.com/open-ish/utility/blob/c6d98898bbc6119cd482b736f57ec897443e71de/packages/http-front-cache/src/lib/providers/session-storage.ts#L1-L8). However, it can be easily extended to support other storage mechanisms such as local storage or indexedDB or even In-Memory by using the `cacheFactory` function.

```typescript
import { cacheFactory, ServiceFunction } from '@juntossomosmais/http-front-cache';';

const customProvider = {
  getItem: (key: string) => Uint8Array; // cacheFactory converts the result from serviceFunction on UInt8Array, so you can assumes that the data returned on getItem is always a UInt8Array. Example of provider here https://github.com/open-ish/utility/blob/c6d98898bbc6119cd482b736f57ec897443e71de/packages/http-front-cache/src/lib/providers/session-storage.ts#L1-L8
  setItem: (key: string, value: Uint8Array) => void;
  removeItem: (key: string) => void;
};

export const cacheOnMyCustomProvider = <TParams extends unknown[], TResult>(
  serviceFunction: ServiceFunction<TParams, TResult>,
  expire: number
): ServiceFunction<TParams, TResult> => {
  return async (...params: TParams): Promise<TResult> => {
    return cacheFactory<TParams, TResult>({
      params,
      expire,
      serviceFunction,
      provider: customProvider,
    });
  };
};

// usage
const cachedFetchData = cacheOnMyCustomProvider(fetchData, 5 * 60 * 1000); // Cache for 5 minutes

cachedFetchData('exampleParam').then((result) => {
  console.log(result);
});
```
