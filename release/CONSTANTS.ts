import s from 'shelljs';
import path from 'path';

const scriptDir: string = path.dirname(__filename);

export const CONSTANTS = {
  DocsDir: `${scriptDir}/../docs`,
  WorkdingDocsDir: `${scriptDir}/working_dir/docs`,
  EpOpenApiDir: `${scriptDir}/../ep-openapi`,
  WorkingDir: `${scriptDir}/working_dir`,
  WorkingEpOpenApiDir: `${scriptDir}/working_dir/ep-openapi`,
  ReleaseDirBrowser: `${scriptDir}/ep-openapi-browser`,
  ReleaseDirNode: `${scriptDir}/ep-openapi-node`,
  Skipping: '+++ SKIPPING +++'
}

