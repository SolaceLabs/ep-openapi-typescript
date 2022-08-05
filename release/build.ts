import s from 'shelljs';
import path from 'path';
import { CONSTANTS } from './CONSTANTS';

const scriptName: string = path.basename(__filename);
const scriptDir: string = path.dirname(__filename);

const prepare = () => {
  const funcName = 'prepare';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);
  if(s.rm('-rf', CONSTANTS.WorkingDir).code !== 0) process.exit(1);
  if(s.mkdir('-p', CONSTANTS.WorkingDir).code !== 0) process.exit(1);
  console.log(`${logName}: success.`);
}

const copySourcesToWorkingDir = () => {
  const funcName = 'copySourcesToWorkingDir';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);

  console.log(`${logName}: copying ep-openapi sources to working dir ...`);
  if(s.cp('-rf', CONSTANTS.EpOpenApiDir, CONSTANTS.WorkingDir).code !== 0) process.exit(1);
  if(s.rm('-rf', `${CONSTANTS.WorkingEpOpenApiDir}/dist`).code !== 0) process.exit(1);
  if(s.rm('-rf', `${CONSTANTS.WorkingEpOpenApiDir}/node_modules`).code !== 0) process.exit(1);
  if(s.rm('-rf', `${CONSTANTS.WorkingEpOpenApiDir}/generated`).code !== 0) process.exit(1);
  console.log(`${logName}: success.`);
}

const buildEpOpenApi = () => {
  const funcName = 'buildEpOpenApi';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);
  s.cd(`${CONSTANTS.WorkingEpOpenApiDir}`);
  console.log(`${logName}: directory = ${s.exec(`pwd`)}`);
  if(s.exec('npm install').code !== 0) process.exit(1);
  if(s.exec('npm run build').code !== 0) process.exit(1);
  if(s.cd(`${scriptDir}`).code !== 0) process.exit(1);
  console.log(`${logName}: success.`);
}

const copyAssets = () => {
  const funcName = 'copyAssets';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;

  const copySrcs = (srcDir: string, outDir: string) => {
    console.log(`${logName}: copy ${srcDir}`);
    if(s.rm('-rf', `${outDir}`).code !== 0) process.exit(1);
    if(s.mkdir('-p', outDir).code !== 0) process.exit(1);
    if(s.cp('-r', `${srcDir}/*`, `${outDir}`).code !== 0) process.exit(1);  
  }

  const SrcDirBrowser: string = `${CONSTANTS.WorkingEpOpenApiDir}/generated/@solace-labs/ep-openapi-browser`;
  const OutDirBrowser: string = `${CONSTANTS.ReleaseDirBrowser}/src`;
  const SrcDirNode: string = `${CONSTANTS.WorkingEpOpenApiDir}/generated/@solace-labs/ep-openapi-node`;
  const OutDirNode: string = `${CONSTANTS.ReleaseDirNode}/src`;

  console.log(`${logName}: starting ...`);

  copySrcs(SrcDirBrowser, OutDirBrowser);
  copySrcs(SrcDirNode, OutDirNode);

  console.log(`${logName}: success.`);
}

const compileSrcs = () => {
  const funcName = 'compileSrcs';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;

  s.cd(`${CONSTANTS.ReleaseDirBrowser}`);
  if(s.rm('-rf', `./dist`).code !== 0) process.exit(1);
  if(s.exec('npx tsc').code !== 0) process.exit(1);

  s.cd(`${CONSTANTS.ReleaseDirNode}`);
  if(s.rm('-rf', `./dist`).code !== 0) process.exit(1);
  if(s.exec('npm install').code !== 0) process.exit(1);
  if(s.exec('npx tsc').code !== 0) process.exit(1);

  console.log(`${logName}: success.`);
}

const main = () => {
  const funcName = 'main';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);
  
  prepare();
  copySourcesToWorkingDir();
  buildEpOpenApi();
  copyAssets();
  compileSrcs();

  console.log(`${logName}: success.`);
}

main();
