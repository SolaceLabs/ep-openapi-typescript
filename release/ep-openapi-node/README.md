# OpenAPI NodeJS Client for Solace Event Portal

Generated Typescript Open API Client for [Solace Event Portal](https://solace.com/products/portal/).

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
  // set your base ...
  const myBase = ..., or
  const myBase = await ...
  return myBase;
}

// make use of it
OpenAPI.BASE = async() => { return await getBase(); }

```

## Install

```bash
npm install @solace-labs/ep-openapi-node
```

## Usage

Configure OpenAPI object:

```typescript
import { OpenAPI } from "@solace-labs/ep-openapi-node";

// to use a different base url than specified in the spec:
OpenAPI.BASE = "{base-url}";
OpenAPI.WITH_CREDENTIALS = true;
OpenAPI.CREDENTIALS = "include";
OpenAPI.TOKEN = "{token}";
```

Example: Create an Application Domain:

```typescript
import {
  ApplicationDomainResponse,
  ApplicationDomainsService,
} from "@solace-labs/ep-openapi-node";

const applicationDomainResponse: ApplicationDomainResponse =
  await ApplicationDomainsService.createApplicationDomain({
    requestBody: {
      name: "my-application-domain",
    },
  });
```

---
