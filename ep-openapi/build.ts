import s from 'shelljs';
import path from 'path';
import fs from 'fs';
import { HttpClient } from 'openapi-typescript-codegen';
const OpenAPI = require('openapi-typescript-codegen');

const scriptName: string = path.basename(__filename);
const scriptDir: string = path.dirname(__filename);
// files & dirs
const inputApiSpecFile = 'resources/ep-openapi-spec.json';
const outputOpenApiNodeClientDir = 'generated/@solace-labs/ep-openapi-node';
const outputOpenApiBrowserClientDir = 'generated/@solace-labs/ep-openapi-browser';

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

// const generateOpenApiNodeClient = () => {
//   const funcName = 'generateOpenApiNodeClient';
//   const logName = `${scriptDir}/${scriptName}.${funcName}()`;
//   console.log(`${logName}: generating Node OpenAPI Client ...`);

//   OpenAPI.generate({
//       input: inputApiSpecFile,
//       output: outputOpenApiNodeClientDir,
//       httpClient: HttpClient.NODE,
//       exportSchemas: true,
//       useOptions: true
//       // request: './custom/request.ts'      
//   })
//   .then(() => {
//     return;
//   })
//   .catch((error: any) => {
//     console.log(error);
//     process.exit(1);
//   });
//   console.log(`${logName}: dir: ${outputOpenApiNodeClientDir}`);
//   console.log(`${logName}: success.`);
// }

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

const postProcessOpenApiNodeClient = () => {
  const funcName = 'postProcessOpenApiNodeClient';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: post processing Node OpenAPI Client ...`);

  // request.ts
  const requestTsFile = `${outputOpenApiNodeClientDir}/core/request.ts`;
  const requestTsBackupFile = `${outputOpenApiNodeClientDir}/core/request.ts.backup`;
  console.log(`${logName}: create backup file: ${requestTsBackupFile}`);
  const code = s.cp(requestTsFile, requestTsBackupFile).code;
  if(code !== 0) throw new Error(`${logName}: code=${code}`);
  // load file to string
  const requestTsBuffer: Buffer = fs.readFileSync(requestTsFile);
  const requestTsString: string = requestTsBuffer.toString('utf-8');
  // *************************
  // fetch-with-proxy
  // *************************
  const search = "import fetch, { BodyInit, Headers, RequestInit, Response } from 'node-fetch';"
  const replace = `
import { BodyInit, Headers, RequestInit, Response } from 'node-fetch';
import fetch from 'fetch-with-proxy';
`;
  console.log(`${logName}: replace ${search} with ${replace}`);
  const newRequestTsString: string = requestTsString.replace(search, replace);
  fs.writeFileSync(requestTsFile, newRequestTsString);  
  // *************************


  
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
