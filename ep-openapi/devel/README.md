# Development ep-openapi-typescript


## Download Solace Event Portal Open API Spec

```bash
cd resources
curl https://openapi-v2.solace.cloud/api-docs-v2.json --output ./sep-openapi-spec.{version}.json
ln -s sep-openapi-spec.{version}.json sep-openapi-spec.json
```

## Build

```bash
npm install
npm run build
```

## Run Tests

```bash
export EP_OPENAPI_TEST_SOLACE_CLOUD_TOKEN={token}
npm test
# or
./test/run.sh
# with output in ./test/logs
```

### Run a Single Test
````bash
# set the env
source ./test/source.env.sh
# run test
# for example:
npx mocha --config test/.mocharc.yml test/specs/applicationDomain/main.spec.ts
# unset the env
unset_source_env
````

## Link

```bash
cd release
./build.sh
cd ep-openapi-node
npm link
```

### Consuming Link
```bash
cd {consuming project}
npm link @solace-labs/ep-openapi-node
npm list
```

#### Unlink Consuming Link
```bash
cd {consuming project}
npm unlink --no-save @solace-labs/ep-openapi-node
# NOTE: now install the released package
npm install
npm list
```

---

The End.
