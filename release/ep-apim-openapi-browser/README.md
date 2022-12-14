# APIM OpenAPI Browser Client for Solace Event Portal

Generated Typescript APIM Open API Client for [Solace Event Portal](https://solace.com/products/portal/).

Based on [OpenAPI Typescript Codegen](https://github.com/ferdikoomen/openapi-typescript-codegen).

Version: `0.19.0`

## Install

```bash
npm install @solace-labs/ep-apim-openapi-browser
```

## Usage

Configure OpenAPI object:

```typescript
import { OpenAPI } from "@solace-labs/ep-apim-openapi-browser";

// to use a different base url than specified in the spec:
OpenAPI.BASE = "{base-url}";
OpenAPI.WITH_CREDENTIALS = true;
OpenAPI.CREDENTIALS = "include";
OpenAPI.TOKEN = "{token}";
```

<!-- Example: Create an Application Domain:

```typescript
import {
  ApplicationDomainResponse,
  ApplicationDomainsService,
} from "@solace-labs/ep-openapi-browser";

const applicationDomainResponse: ApplicationDomainResponse =
  await ApplicationDomainsService.createApplicationDomain({
    requestBody: {
      name: "my-application-domain",
    },
  });
``` -->

---
