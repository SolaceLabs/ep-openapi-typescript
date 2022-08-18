import 'mocha';
import { expect } from 'chai';
import path from 'path';
import { TestLogger } from '../../lib/TestLogger';
import { TestContext } from '../../lib/TestContext';
import TestConfig from '../../lib/TestConfig';
import { TestUtils } from '../../lib/TestUtils';
import { 
  ApiError, 
  ApplicationDomainResponse, 
  ApplicationDomainsService, 
  EnumResponse, 
  EnumsService, 
  EnumValue, 
  EnumVersionResponse
} from '../../../generated/@solace-labs/ep-openapi-node';

const scriptName: string = path.basename(__filename);
TestLogger.logMessage(scriptName, ">>> starting ...");


const ApplicationDomainName = `${TestConfig.getAppId()}/ep-openapi/${TestUtils.getUUID()}`;
let ApplicationDomainId: string;
const EnumName = `${TestConfig.getAppId()}/ep-openapi/${TestUtils.getUUID()}`;
let EnumId: string;
const EnumVersionName = `${TestUtils.getUUID()}`;
let EnumVersionId: string;
const EnumValues: Array<EnumValue> = [
  { label: 'one', value: 'one' },
  { label: 'two', value: 'two' }
];

describe(`${scriptName}`, () => {
    
    beforeEach(() => {
      TestContext.newItId();
    });

    after(async() => {
      try {
        const xvoid: void = await ApplicationDomainsService.deleteApplicationDomain({
          id: ApplicationDomainId
        });
      } catch(e) {
        expect(e instanceof ApiError, TestLogger.createNotApiErrorMesssage(e.message)).to.be.true;
        expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
      }
    });

    it(`${scriptName}: should create application domain`, async () => {
      try {
        const applicationDomainResponse: ApplicationDomainResponse = await ApplicationDomainsService.createApplicationDomain({
          requestBody: {
            name: ApplicationDomainName,
          }
        });
        expect(applicationDomainResponse.data.id, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        ApplicationDomainId = applicationDomainResponse.data.id;
      } catch(e) {
        expect(e instanceof ApiError, TestLogger.createNotApiErrorMesssage(e.message)).to.be.true;
        expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
      }
    });

    it(`${scriptName}: should create enum`, async () => {
      try {
        const enumResponse: EnumResponse = await EnumsService.createEnum({
          requestBody: {
            applicationDomainId: ApplicationDomainId,
            name: EnumName
          }
        });
        expect(enumResponse.data.id, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        EnumId = enumResponse.data.id;
      } catch(e) {
        expect(e instanceof ApiError, TestLogger.createNotApiErrorMesssage(e.message)).to.be.true;
        expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
      }
    });

    it(`${scriptName}: should create enum version`, async () => {
      try {
        const enumVersionResponse: EnumVersionResponse = await EnumsService.createEnumVersionForEnum({
          enumId: EnumId,
          requestBody: {
            enumId: EnumId,
            displayName: EnumVersionName,
            version: '1.0.0',
            values: EnumValues
          }
        });
        expect(enumVersionResponse.data.id, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        EnumVersionId = enumVersionResponse.data.id;
      } catch(e) {
        expect(e instanceof ApiError, TestLogger.createNotApiErrorMesssage(e.message)).to.be.true;
        expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
      }
    });

});

