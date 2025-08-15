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

---

> **Are you using version 1.1.0 or above?**
> [Go to the old documentation here.](https://github.com/juntossomosmais/time-out-market/blob/899eca4aa6f5dcd6c653b1987c31dd16a046d61a/packages/http-front-cache/README.md#time-out-market---http-front-cache)

---

## Summary

- [Introduction](#introduction)
- [Installing utility packages](#installing-utility-packages)
- [How to Use](#how-to-use)
  - [Example (simplest usage)](#example-simplest-usage)
  - [It accepts multiParams as well](#it-accepts-multiparams-as-well)
  - [You might need to remove cache](#you-might-need-to-remove-cache)
- [Using another Storage as Provider](#using-another-storage-as-provider)
- [List of params to create the Custom Cache Function](#list-of-params-to-create-the-custom-cache-function)
- [Do and Don't](#do-and-dont)

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

### Example (simplest usage)

You can use the `cacheOnSessionStorage` function to cache the results of your service functions.

```typescript
import { cacheOnSessionStorage } from '@juntossomosmais/http-front-cache';

const fetchData = async (param: string): Promise<Result> => {
  const response = await fetch(`https://api.example.com/data?param=${param}`);
  return response.json();
};

const { cachedFunction, removeCacheByParamOnSessionStorage } = cacheOnSessionStorage(fetchData, 5 * 60 * 1000); // Cache for 5 minutes

// Usage
cachedFunction('exampleParam').then((result) => {
  console.log(result);
  // second call might hit the cache
});
```

OBS: `cachedFunction` and `fetchData` have the same typing, don't worry about it.

### It accepts multiParams as well

```typescript
const fetchData = async (param: string, another:number): Promise<Result> => {
  const response = await fetch(`https://api.example.com/data`, {
    method: 'POST',
    body: JSON.stringify({ param, another }),
  });
  return response.json();
};

const { cachedFunction } = cacheOnSessionStorage(fetchData, 5 * 60 * 1000);
```

### You might need to remove cache

In some cases, you may need to manually remove cached data. For example, if the underlying data changes and you want to ensure that the cache is updated, you can use the `removeCacheByParamOnSessionStorage` function.
```typescript
const fetchData = async (param: string, another:number): Promise<Result> => {
  const response = await fetch(`https://api.example.com/data`, {
    method: 'POST',
    body: JSON.stringify({ param, another }),
  });
  return response.json();
};

const { cachedFunction, removeCacheByParamOnSessionStorage} = cacheOnSessionStorage(fetchData, 5 * 60 * 1000);

removeCacheByParamOnSessionStorage('exampleParam'); // it is also available for custom providers
```

## Using another Storage as Provider

Currently, the `cacheOnSessionStorage` uses [session storage as provider](https://github.com/open-ish/utility/blob/c6d98898bbc6119cd482b736f57ec897443e71de/packages/http-front-cache/src/lib/providers/session-storage.ts#L1-L8). However, it can be easily extended to support other storage mechanisms such as local storage, indexedDB, or even in-memory by using the `cacheFactory` function.

```typescript
import { cacheFactory, ServiceFunction } from '@juntossomosmais/http-front-cache';


interface CustomProvider {
  getItem: (key: string) => Uint8Array;
  setItem: (key: string, value: Uint8Array) => void;
  removeItem: (key: string) => void;
};

// example using memory:
const memoryStore = new Map<string, Uint8Array>()

const inMemoryProvider = {
  getItem: (key: string): Uint8Array => memoryStore.get(key) as Uint8Array,
  setItem: (key: string, value: Uint8Array) => memoryStore.set(key, value),
  removeItem: (key: string) => memoryStore.delete(key),
}


export const cacheOnMyCustomProvider = <TParams extends unknown[], TResult>(
  serviceFunction: ServiceFunction<TParams, TResult>,
  expire: number
} => {
   const cachedFunction = async (...params: TParams): Promise<TResult> => {
    return cacheFactory<TParams, TResult>({
      params,
      expire,
      serviceFunction,
      provider: inMemoryProvider,
    })
  }

  const removeCacheByParamOnCustomProvider = removeCacheByParamFactory(
    inMemoryProvider,
    serviceFunction
  )

  return { cachedFunction, removeCacheByParamOnCustomProvider };
};

// usage
const { cachedFunction, removeCacheByParamOnCustomProvider } = cacheOnMyCustomProvider(fetchData, 5 * 60 * 1000); // Cache for 5 minutes

cachedFunction('exampleParam').then((result) => {
  console.log(result);
  // second call might hit the cache
});

// To remove the cache for a specific param:
removeCacheByParamOnCustomProvider('exampleParam');
```


## List of params to create the Custom Cache Function

| Parameter         | Type                                      | Description                                                                 | Example                                  |
|-------------------|-------------------------------------------|-----------------------------------------------------------------------------|------------------------------------------|
| serviceFunction   | `ServiceFunction<TParams, TResult>`        | The function whose result you want to cache.                                | `fetchData`                              |
| expire            | `number`                                  | Time in milliseconds for cache expiration.                                  | `5 * 60 * 1000`                          |
| provider          | `{ getItem, setItem, removeItem }`         | The storage provider implementing the required interface.                    | `customProvider`                         |
| params            | `TParams`          | The parameters to be passed to the service function and used as cache key.   | `['exampleParam']` or `{name: 123}`        |
| removeCacheByParam| `(...params: TParams) => void`             | Function to remove cache for specific params (created by factory helper).    | `removeCacheByParamOnCustomProvider`     |

> **Note:**
> - The `provider` must implement the methods: `getItem(key: string)`, `setItem(key: string, value: Uint8Array)`, and `removeItem(key: string)`.
> - The `removeCacheByParamFactory` helper is recommended to generate the cache removal function for your provider and service function.


## Do and Don't

The cache key is automatically assigned using the name of the service function (ex: `fetchData`) you provide and the given params. This ensures that different service functions with the same parameters do not collide in the cache.

**Important:**
- The service function **must be a named function** (not anonymous or arrow function without a name), because the cache key uses `serviceFunction.name`.
- **Anonymous functions are not supported**. If you use an anonymous function, the cache key will be incorrect and cache collisions may occur.

**Example of valid usage:**

```typescript
function fetchData(param: string) { /* ... */ }
const { cachedFunction } = cacheOnSessionStorage(fetchData, 5000);
```

**Example of invalid usage (do not do this):**

```typescript
const { cachedFunction } = cacheOnSessionStorage((param) => { /* ... */ }, 5000); // ❌ Anonymous function
```

Always declare your service function with a name to ensure correct cache assignment.
