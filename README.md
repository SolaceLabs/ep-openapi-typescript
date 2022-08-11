[![api-test](https://github.com/SolaceLabs/ep-openapi-typescript/actions/workflows/api-test.yml/badge.svg)](https://github.com/SolaceLabs/ep-openapi-typescript/actions/workflows/api-test.yml)

# Solace Event Portal Open Api Generator

[Issues & Feature Requests](https://github.com/SolaceLabs/ep-openapi-typescript/issues)

Generate Browser & Node Open Api Packages.

Based on [OpenAPI Typescript Codegen](https://github.com/ferdikoomen/openapi-typescript-codegen).

Version: `0.19.0`

The following modifications are made:


## Use of `fetch-with-proxy`

Node fetch replaced with fetch-with-proxy.

See [node-fetch-with-proxy](https://github.com/touv/node-fetch-with-proxy#readme) for details on usage.


## Added `async resolver` to BASE url

```typescript
export type OpenAPIConfig = {
    BASE: string | Resolver<string>; // new
    VERSION: string;
    WITH_CREDENTIALS: boolean;
    CREDENTIALS: 'include' | 'omit' | 'same-origin';
    TOKEN?: string | Resolver<string>;
    USERNAME?: string | Resolver<string>;
    PASSWORD?: string | Resolver<string>;
    HEADERS?: Headers | Resolver<Headers>;
    ENCODE_PATH?: (path: string) => string;
};
```
### Use of a resolver

```typescript

const getBase = async(): Promise<string> => {
  // decide you base ...
  const myBase = ..., or
  const myBase = await ...
  return myBase;
}

// make use of it
OpenAPI.BASE = async() => { return await getBase(); }



```


---
