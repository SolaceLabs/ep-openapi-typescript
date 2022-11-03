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
  EnumsService,
  TopicAddressEnum,
  TopicAddressEnumResponse,
  TopicAddressEnumValue,
  TopicAddressEnumVersion,
  TopicAddressEnumVersionResponse, 
} from '../../../src/@solace-labs/ep-openapi-node';

const scriptName: string = path.basename(__filename);
TestLogger.logMessage(scriptName, ">>> starting ...");


const ApplicationDomainName = `${TestConfig.getAppId()}/ep-openapi/${TestUtils.getUUID()}`;
let ApplicationDomainId: string;
const EnumName = `enum-${TestUtils.getUUID()}`;
let EnumId: string;
const EnumVersionName = `${TestUtils.getUUID()}`;
let EnumVersionId: string;

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

        const topicAddressEnumResponse: TopicAddressEnumResponse = await EnumsService.createEnum({
            requestBody: {
              applicationDomainId: ApplicationDomainId,
              name: EnumName,
              shared: false
            }
        });
        const data: TopicAddressEnum | undefined = topicAddressEnumResponse.data;
        expect(data, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        expect(data.id, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        EnumId = data.id;
      } catch(e) {
        expect(e instanceof ApiError, TestLogger.createNotApiErrorMesssage(e.message)).to.be.true;
        expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
      }
    });

    it(`${scriptName}: should create enum version`, async () => {
      try {
        const values: Array<TopicAddressEnumValue> = [
          { label: 'one', value: 'one' },
          { label: 'two', value: 'two' }
        ];
        const requestBody: TopicAddressEnumVersion = {
          enumId: EnumId,
          version: '1.0.0',
          displayName: 'displayName',
          values: values
        };
        const topicAddressEnumVersionResponse: TopicAddressEnumVersionResponse = await EnumsService.createEnumVersionForEnum({
          enumId: EnumId,
          requestBody: requestBody,
        });
        const data: TopicAddressEnumVersion | undefined = topicAddressEnumVersionResponse.data;
        expect(data, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        expect(data.id, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        EnumVersionId = data.id;
      } catch(e) {
        expect(e instanceof ApiError, TestLogger.createNotApiErrorMesssage(e.message)).to.be.true;
        expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
      }
    });

});

