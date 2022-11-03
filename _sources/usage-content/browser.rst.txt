.. _usage-content-browser:

OpenAPI Browser Client for Solace Event Portal
==============================================

Generated with `OpenAPI Typescript Codegen <https://github.com/ferdikoomen/openapi-typescript-codegen>`_.

Version: 0.19.0


Requirements
++++++++++++

* node 16.x

Install
+++++++

.. code-block:: bash

  npm install @solace-labs/ep-openapi-browser

Usage
+++++

Configure OpenAPI Object:

.. code-block:: typescript

  import { OpenAPI } from "@solace-labs/ep-openapi-browser";

  // to use a different base url than specified in the spec:
  OpenAPI.BASE = "{base-url}";
  OpenAPI.WITH_CREDENTIALS = true;
  OpenAPI.CREDENTIALS = "include";
  OpenAPI.TOKEN = "{token}";

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
