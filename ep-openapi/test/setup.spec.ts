import "mocha";
import path from 'path';
import { expect } from 'chai';
import { TestLogger } from "./lib/TestLogger";
import TestConfig from "./lib/TestConfig";
import { TestContext } from "./lib/TestContext";
import { OpenAPI } from '../generated/@solace-iot-team/ep-openapi-node';

// load test stub
const x = require('./lib/TestStub');

// ensure any unhandled exception cause exit = 1
function onUncaught(err: any){
  console.log(err);
  process.exit(1);
}
process.on('unhandledRejection', onUncaught);

const scriptName: string = path.basename(__filename);
const scriptDir: string = path.dirname(__filename);

TestLogger.setLogging(true);
TestLogger.logMessage(scriptName, ">>> initializing ...");

before(async() => {
  TestContext.newItId();
});

after(async() => {
  TestContext.newItId();
  // put general cleanup code here if required
});

describe(`${scriptName}`, () => {
  context(`${scriptName}`, () => {

    beforeEach(() => {
      TestContext.newItId();
    });

    it(`${scriptName}: should initialize test config & logger`, async () => {
      try {
        TestConfig.initialize();
      } catch (e) {
        expect(false, TestLogger.createTestFailMessageForError('intitializing test config failed', e)).to.be.true;
      }
    });

    it(`${scriptName}: should initialize OpenAPI client`, async () => {
      try {
        const base: URL = new URL(TestConfig.getConfig().epBaseUrl);
        OpenAPI.BASE = TestConfig.getConfig().epBaseUrl;
        OpenAPI.WITH_CREDENTIALS = true;
        OpenAPI.CREDENTIALS = "include";
        OpenAPI.TOKEN = TestConfig.getSolaceCloudToken();
    
        const _log = {
          ...OpenAPI,
          TOKEN: "***"
        };

        console.log(TestLogger.createLogMessage('OpenApi Config', _log));
    
      } catch (e) {
        expect(false, TestLogger.createTestFailMessageForError('initializing ep client', e)).to.be.true;
      }
    });

  });
});

