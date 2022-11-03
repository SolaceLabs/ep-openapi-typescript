.. _usage-content-node:

OpenAPI NodeJS Client for Solace Event Portal
=============================================

Generated with `OpenAPI Typescript Codegen <https://github.com/ferdikoomen/openapi-typescript-codegen>`_.

Version: 0.19.0


Requirements
++++++++++++

* node 16.x

Install
+++++++

.. code-block:: bash

  npm install @solace-labs/ep-openapi-node

General
+++++++

Use of `fetch-with-proxy`
-------------------------

Node `fetch` replaced with `fetch-with-proxy`.

See `node-fetch-with-proxy <https://github.com/touv/node-fetch-with-proxy#readme>`_ for details.

OpenAPIConfig
-------------

.. code-block:: typescript

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

Usage
+++++

Configure OpenAPI Object:

.. code-block:: typescript

  import { OpenAPI } from "@solace-labs/ep-openapi-node";

  // to use a different base url than specified in the spec:
  OpenAPI.BASE = "{base-url}";
  OpenAPI.WITH_CREDENTIALS = true;
  OpenAPI.CREDENTIALS = "include";
  OpenAPI.TOKEN = "{token}";

Configure OpenAPI Object using a Resolver for the BASE Url:

.. code-block:: typescript

  const getBase = async(): Promise<string> => {
   // set your base ...
   const myBase = ..., or
   const myBase = await ...
   return myBase;
  }

  // make use of it
  OpenAPI.BASE = async() => { return await getBase(); }

Example: Create an Application Domain:

.. code-block:: typescript

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
