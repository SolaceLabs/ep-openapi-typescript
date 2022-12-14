import s from 'shelljs';
import path from 'path';
import fs from 'fs';

const scriptName: string = path.basename(__filename);
const scriptDir: string = path.dirname(__filename);

const CONSTANTS = {
  ApimDocsDir: `${scriptDir}/../apim-docs`,
  ApimWorkdingDocsDir: `${scriptDir}/apim_working_dir/docs`,
  ApimEpOpenApiDir: `${scriptDir}/../ep-apim-openapi`,
  ApimWorkingDir: `${scriptDir}/apim_working_dir`,
  ApimWorkingEpOpenApiDir: `${scriptDir}/apim_working_dir/ep-apim-openapi`,
  ApimReleaseDirBrowser: `${scriptDir}/ep-apim-openapi-browser`,
  ApimReleaseDirNode: `${scriptDir}/ep-apim-openapi-node`,
  Skipping: '+++ SKIPPING +++',
  InputApiSpecFile: '',
}
CONSTANTS.InputApiSpecFile = `${CONSTANTS.ApimWorkingEpOpenApiDir}/resources/ep-apim-openapi-spec.json`;

const prepare = () => {
  const funcName = 'prepare';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);
  if(s.rm('-rf', CONSTANTS.ApimWorkingDir).code !== 0) process.exit(1);
  if(s.mkdir('-p', CONSTANTS.ApimWorkingDir).code !== 0) process.exit(1);
  console.log(`${logName}: success.`);
}

const copySourcesToApimWorkingDir = () => {
  const funcName = 'copySourcesToApimWorkingDir';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);

  console.log(`${logName}: copying ep-apim-openapi sources to apim working dir ...`);
  if(s.cp('-rf', CONSTANTS.ApimEpOpenApiDir, CONSTANTS.ApimWorkingDir).code !== 0) process.exit(1);
  if(s.rm('-rf', `${CONSTANTS.ApimWorkingEpOpenApiDir}/dist`).code !== 0) process.exit(1);
  if(s.rm('-rf', `${CONSTANTS.ApimWorkingEpOpenApiDir}/node_modules`).code !== 0) process.exit(1);
  if(s.rm('-rf', `${CONSTANTS.ApimWorkingEpOpenApiDir}/src`).code !== 0) process.exit(1);
  console.log(`${logName}: success.`);
}

const copyApimDocsToApimWorkingDir = () => {
  const funcName = 'copyApimDocsToApimWorkingDir';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);

  console.log(`${logName}: copying apim docs to apim working dir ...`);
  if(s.cp('-rf', CONSTANTS.ApimDocsDir, CONSTANTS.ApimWorkingDir).code !== 0) process.exit(1);
  if(s.rm('-rf', `${CONSTANTS.ApimWorkdingDocsDir}/build`).code !== 0) process.exit(1);
  console.log(`${logName}: success.`);
}

const buildApimEpOpenApi = () => {
  const funcName = 'buildApimEpOpenApi';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);
  s.cd(`${CONSTANTS.ApimWorkingEpOpenApiDir}`);
  console.log(`${logName}: directory = ${s.exec(`pwd`)}`);
  if(s.exec('npm install').code !== 0) process.exit(1);
  if(s.exec('npm run build').code !== 0) process.exit(1);
  if(s.cd(`${scriptDir}`).code !== 0) process.exit(1);
  console.log(`${logName}: success.`);
}

const copyApimAssets = () => {
  const funcName = 'copyApimAssets';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;

  const copySrcs = (srcDir: string, outDir: string) => {
    console.log(`${logName}: copy ${srcDir}`);
    if(s.rm('-rf', `${outDir}`).code !== 0) process.exit(1);
    if(s.mkdir('-p', outDir).code !== 0) process.exit(1);
    if(s.cp('-r', `${srcDir}/*`, `${outDir}`).code !== 0) process.exit(1);  
  }

  const SrcDirBrowser: string = `${CONSTANTS.ApimWorkingEpOpenApiDir}/src/@solace-labs/ep-apim-openapi-browser`;
  const OutDirBrowser: string = `${CONSTANTS.ApimReleaseDirBrowser}/src`;
  const SrcDirNode: string = `${CONSTANTS.ApimWorkingEpOpenApiDir}/src/@solace-labs/ep-apim-openapi-node`;
  const OutDirNode: string = `${CONSTANTS.ApimReleaseDirNode}/src`;

  console.log(`${logName}: starting ...`);

  copySrcs(SrcDirBrowser, OutDirBrowser);
  copySrcs(SrcDirNode, OutDirNode);

  console.log(`${logName}: success.`);
}

const createApimPackageJsonVersion = () => {
  const funcName = 'createApimPackageJsonVersion';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;

  const apiSpec: any = require(CONSTANTS.InputApiSpecFile);

  const createVersion = (releaseDir: string) => {
    const funcName = 'createApimPackageJsonVersion.createVersion';
    const logName = `${scriptDir}/${scriptName}.${funcName}()`;
    console.log(`${logName}: starting ${releaseDir}...`);

    const PackageJsonFile = `${releaseDir}/package.json`;
    const PackageJson = require(`${PackageJsonFile}`);
    const apiSpecVersion = apiSpec.info.version;
    console.log(`${logName}: apiSpecVersion = ${apiSpecVersion}`);
    PackageJson.version = apiSpecVersion;
    const newPackageJsonString = JSON.stringify(PackageJson, null, 2);
    s.cp(`${PackageJsonFile}`, `${releaseDir}/.package.json`);
    fs.writeFileSync(PackageJsonFile, newPackageJsonString);  
    console.log(`${logName}: success.`);
  }
  // func main
  console.log(`${logName}: starting ...`);
  createVersion(CONSTANTS.ApimReleaseDirNode);
  createVersion(CONSTANTS.ApimReleaseDirBrowser);
  createVersion(CONSTANTS.ApimWorkingEpOpenApiDir);
  console.log(`${logName}: success.`);
}
const compileApimSrcs = () => {
  const funcName = 'compileApimSrcs';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;

  s.cd(`${CONSTANTS.ApimReleaseDirBrowser}`);
  if(s.rm('-rf', `./dist`).code !== 0) process.exit(1);
  if(s.exec('npx tsc').code !== 0) process.exit(1);

  s.cd(`${CONSTANTS.ApimReleaseDirNode}`);
  if(s.rm('-rf', `./dist`).code !== 0) process.exit(1);
  if(s.exec('npm install').code !== 0) process.exit(1);
  if(s.exec('npx tsc').code !== 0) process.exit(1);

  console.log(`${logName}: success.`);
}
const buildApimDocs = () => {
  const funcName = 'buildApimDocs';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);
  s.cd(`${CONSTANTS.ApimWorkdingDocsDir}`);
  console.log(`${logName}: directory = ${s.exec(`pwd`)}`);
  // if(s.chmod('u+x', 'make.sh').code !== 0) process.exit(1);
  if(s.exec('./make.sh').code !== 0) process.exit(1);
  if(s.cd(`${scriptDir}`).code !== 0) process.exit(1);
  console.log(`${logName}: success.`);
}


const main = () => {
  const funcName = 'main';
  const logName = `${scriptDir}/${scriptName}.${funcName}()`;
  console.log(`${logName}: starting ...`);
  
  prepare();
  copySourcesToApimWorkingDir();
  copyApimDocsToApimWorkingDir();
  buildApimEpOpenApi();
  copyApimAssets();
  createApimPackageJsonVersion();
  compileApimSrcs();
  // buildApimDocs();

  console.log(`${logName}: success.`);
}

main();
