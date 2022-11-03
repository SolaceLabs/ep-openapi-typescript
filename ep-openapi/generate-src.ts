import s from 'shelljs';
import path from 'path';
import fs from 'fs';
import { HttpClient } from 'openapi-typescript-codegen';
const OpenAPI = require('openapi-typescript-codegen');

const scriptName: string = path.basename(__filename);
const scriptDir: string = path.dirname(__filename);
// files & dirs
const inputApiSpecFile = 'resources/ep-openapi-spec.json';
const outputOpenApiNodeClientDir = 'src/@solace-labs/ep-openapi-node';
const outputOpenApiBrowserClientDir = 'src/@solace-labs/ep-openapi-browser';

const prepare = () => {
  const funcName = 'prepare';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);
  if(s.rm('-rf', outputOpenApiNodeClientDir).code !== 0) process.exit(1);
  if(s.mkdir('-p', outputOpenApiNodeClientDir).code !== 0) process.exit(1);
  if(s.rm('-rf', outputOpenApiBrowserClientDir).code !== 0) process.exit(1);
  if(s.mkdir('-p', outputOpenApiBrowserClientDir).code !== 0) process.exit(1);
  console.log(`${logName}: success.`);
}

const generateOpenApiNodeClient = async() => {
  const funcName = 'generateOpenApiNodeClient';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: generating Node OpenAPI Client ...`);

  try {
    await OpenAPI.generate({
      input: inputApiSpecFile,
      output: outputOpenApiNodeClientDir,
      httpClient: HttpClient.NODE,
      exportSchemas: true,
      useOptions: true,
      // request: './custom/request.ts'      
    });
  } catch(e) {
    console.log(e);
    process.exit(1);
  }
 
  console.log(`${logName}: dir: ${outputOpenApiNodeClientDir}`);
  console.log(`${logName}: success.`);
}

const postProcessNodeClient_index_ts = () => {
  const funcName = 'postProcessNodeClient_index_ts';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);

  let code: number;
  const SourceFile = `${outputOpenApiNodeClientDir}/index.ts`;
  const BackupFile = `${outputOpenApiNodeClientDir}/index.ts.backup`;
  console.log(`${logName}: create backup file: ${BackupFile}`);
  code = s.cp(SourceFile, BackupFile).code;
  if(code !== 0) throw new Error(`${logName}: code=${code}`);
  // load File file to string
  const SourceFileBuffer: Buffer = fs.readFileSync(SourceFile);
  const SourceFileString: string = SourceFileBuffer.toString('utf-8');

  let newSourceFileString: string = SourceFileString;
  {
    // exports from core/OpenAPI
    const search = "export type { OpenAPIConfig } from './core/OpenAPI';";
    const replace = "export type { OpenAPIConfig, Resolver, Headers } from './core/OpenAPI';";
    console.log(`${logName}: index.ts: replace ${search} with ${replace}`);
    newSourceFileString = newSourceFileString.replace(search, replace);
  }  
  {
    // exports from core/OpenAPI
    const search = "export { CancelablePromise, CancelError } from './core/CancelablePromise';";
    const replace = "export { CancelablePromise, CancelError, OnCancel } from './core/CancelablePromise';";
    console.log(`${logName}: index.ts: replace ${search} with ${replace}`);
    newSourceFileString = newSourceFileString.replace(search, replace);
  }  
  {
    // add exports
    const search_last_export = "export type { OpenAPIConfig, Resolver, Headers } from './core/OpenAPI';";
    const replace_last_export = `
${search_last_export}
export type { ApiResult } from './core/ApiResult';    
export type { ApiRequestOptions } from './core/ApiRequestOptions';
    `;
    console.log(`${logName}: index.ts: replace ${search_last_export} with ${replace_last_export}`);
    newSourceFileString = newSourceFileString.replace(search_last_export, replace_last_export);
  }
  // write file
  fs.writeFileSync(SourceFile, newSourceFileString);
  console.log(`${logName}: success.`);
}

const postProcessNodeClient_core_OpenAPI_ts = () => {
  const funcName = 'postProcessNodeClient_core_OpenAPI_ts';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);

  let code: number;
  const OpenApiTsFile = `${outputOpenApiNodeClientDir}/core/OpenAPI.ts`;
  const OpenApiTsBackupFile = `${outputOpenApiNodeClientDir}/core/OpenAPI.ts.backup`;
  console.log(`${logName}: create backup file: ${OpenApiTsBackupFile}`);
  code = s.cp(OpenApiTsFile, OpenApiTsBackupFile).code;
  if(code !== 0) throw new Error(`${logName}: code=${code}`);
  // load OpenAPI.ts file to string
  const OpenApiTsBuffer: Buffer = fs.readFileSync(OpenApiTsFile);
  const OpenApiTsString: string = OpenApiTsBuffer.toString('utf-8');

  let newOpenApiTsString: string = OpenApiTsString;
  {
    // export Resolver
    const search_type_Resolver = "type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;";
    const replace_type_Resolver = "export type Resolver<T> = (options: ApiRequestOptions) => Promise<T>;";
    console.log(`${logName}: OpenAPI.ts: replace ${search_type_Resolver} with ${replace_type_Resolver}`);
    newOpenApiTsString = newOpenApiTsString.replace(search_type_Resolver, replace_type_Resolver);
  }  
  {
    // export Headers
    const search_type_Headers = "type Headers = Record<string, string>;";
    const replace_type_Headers = "export type Headers = Record<string, string>;";
    console.log(`${logName}: OpenAPI.ts: replace ${search_type_Headers} with ${replace_type_Headers}`);
    newOpenApiTsString = newOpenApiTsString.replace(search_type_Headers, replace_type_Headers);
  }
  {
    // add resolver to base 
    const search_OpenAPI_BASE = "BASE: string";
    const replace_OpenAPI_BASE = "BASE: string | Resolver<string>";
    console.log(`${logName}: OpenAPI.BASE: replace ${search_OpenAPI_BASE} with ${replace_OpenAPI_BASE}`);
    newOpenApiTsString = newOpenApiTsString.replace(search_OpenAPI_BASE, replace_OpenAPI_BASE);
  }
  // write file
  fs.writeFileSync(OpenApiTsFile, newOpenApiTsString);
  console.log(`${logName}: success.`);
}
const postProcessNodeClient_core_request_ts = () => {
  const funcName = 'postProcessNodeClient_core_request_ts';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);

  let code: number;
  const requestTsFile = `${outputOpenApiNodeClientDir}/core/request.ts`;
  const requestTsBackupFile = `${outputOpenApiNodeClientDir}/core/request.ts.backup`;
  console.log(`${logName}: create backup file: ${requestTsBackupFile}`);
  code = s.cp(requestTsFile, requestTsBackupFile).code;
  if(code !== 0) throw new Error(`${logName}: code=${code}`);
  // load requests.ts file to string
  const requestTsBuffer: Buffer = fs.readFileSync(requestTsFile);
  const requestTsString: string = requestTsBuffer.toString('utf-8');
  // *************************
  // fetch-with-proxy
  // *************************
  const searchFetchWithProxy = "import fetch, { BodyInit, Headers, RequestInit, Response } from 'node-fetch';"
  const replaceFetchWithProxy = `
import { BodyInit, Headers, RequestInit, Response } from 'node-fetch';
import fetch from 'fetch-with-proxy';
`;
  console.log(`${logName}: fetch-with-proxy: replace ${searchFetchWithProxy} with ${replaceFetchWithProxy}`);
  const newRequestTsString: string = requestTsString.replace(searchFetchWithProxy, replaceFetchWithProxy);
  fs.writeFileSync(requestTsFile, newRequestTsString);  
  // *************************
  // *************************
  // OpenApi.BASE
  // *************************
  // const getUrl = (config: OpenAPIConfig, options: ApiRequestOptions): string => {
  // const getUrl = async (config: OpenAPIConfig, options: ApiRequestOptions): Promise<string> => {
  const search_getUrl = "const getUrl = (config: OpenAPIConfig, options: ApiRequestOptions): string => {";
  const replace_getUrl = "const getUrl = async (config: OpenAPIConfig, options: ApiRequestOptions): Promise<string> => {";
  console.log(`${logName}: getUrl: replace ${search_getUrl} with ${replace_getUrl}`);
  const newRequestTsString2: string = newRequestTsString.replace(search_getUrl, replace_getUrl);
  fs.writeFileSync(requestTsFile, newRequestTsString2);  
  // const url = `${config.BASE}${path}`;
  // const url = `${await resolve(options, config.BASE)}${path}`;
  const search_url = "const url = `${config.BASE}${path}`";
  const replace_url = "const url = `${await resolve(options, config.BASE)}${path}`";
  console.log(`${logName}: getUrl().url: replace ${search_url} with ${replace_url}`);
  const newRequestTsString3: string = newRequestTsString2.replace(search_url, replace_url);
  fs.writeFileSync(requestTsFile, newRequestTsString3);  
  // const url = getUrl(config, options);
  // const url = await getUrl(config, options);
  const search_request_url = "const url = getUrl(config, options)";
  const replace_request_url = "const url = await getUrl(config, options)";
  console.log(`${logName}: request().url: replace ${search_request_url} with ${replace_request_url}`);
  const newRequestTsString4: string = newRequestTsString3.replace(search_request_url, replace_request_url);
  fs.writeFileSync(requestTsFile, newRequestTsString4);  
  console.log(`${logName}: success.`);
}
const postProcessOpenApiNodeClient = () => {
  const funcName = 'postProcessOpenApiNodeClient';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: post processing Node OpenAPI Client ...`);

  postProcessNodeClient_core_request_ts();
  postProcessNodeClient_core_OpenAPI_ts();
  postProcessNodeClient_index_ts();

  console.log(`${logName}: success.`);
}

const generateOpenApiBrowserClient = () => {
  const funcName = 'generateOpenApiBrowserClient';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: generating Browser OpenAPI Client ...`);
  OpenAPI.generate({
      input: inputApiSpecFile,
      output: outputOpenApiBrowserClientDir,
      exportSchemas: true,
      useOptions: true
  })
  .then(() => {
    return;
  })
  .catch((error: any) => {
    console.log(error);
    process.exit(1);
  });
  console.log(`${logName}: dir: ${outputOpenApiBrowserClientDir}`);
  console.log(`${logName}: success.`);
}

const main = async() => {
  const funcName = 'main';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);
  prepare();
  await generateOpenApiNodeClient();
  postProcessOpenApiNodeClient();
  generateOpenApiBrowserClient();
  console.log(`${logName}: success.`);
}

main();
