import 'mocha';
import { expect } from 'chai';
import path from 'path';
import { TestLogger } from '../../lib/TestLogger';
import { TestContext } from '../../lib/TestContext';
import TestConfig from '../../lib/TestConfig';
import { TestUtils } from '../../lib/TestUtils';
import { TestEpApiHelpers, T_EpMeta } from '../../lib/TestEpApiHelpers';
import { 
  ApiError, 
  ApplicationDomainResponse, 
  ApplicationDomainsService, 
  EnumResponse, 
  EnumsService, 
  EnumValue, 
  EnumVersion, 
  EnumVersionResponse,
  EnumVersionsResponse
} from '../../../generated/@solace-labs/ep-openapi-node';

const scriptName: string = path.basename(__filename);
TestLogger.logMessage(scriptName, ">>> starting ...");


const ApplicationDomainName = `${TestConfig.getAppId()}/ep-openapi/${TestUtils.getUUID()}`;
let ApplicationDomainId: string;
const EnumName = `${TestConfig.getAppId()}/ep-openapi/${TestUtils.getUUID()}`;
let EnumId: string;

const EnumVersionNameBase = TestUtils.getUUID();
const EnumValues: Array<EnumValue> = [
  { label: 'one', value: 'one' },
  { label: 'two', value: 'two' }
];
const EnumVersionStringBase = '1.0.0';
const EnumVersionQuantity = 10;
const generateEnumVersionName = (i: number): string => {
  const iStr: string = String(i).padStart(3, '0');
  const enumVersionName = `${EnumVersionNameBase}-${iStr}`;
  return enumVersionName;
}
const generateEnumVersionString = (i: number): string => {
  const enumVersionString: string = `1.0.${i}`;
  return enumVersionString;
}

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

    it(`${scriptName}: should create enum versions`, async () => {
      try {
        for(let i=0; i<EnumVersionQuantity; i++) {
          const enumVersionName = generateEnumVersionName(i);
          const enumVersionString = generateEnumVersionString(i);
          const enumVersionResponse: EnumVersionResponse = await EnumsService.createEnumVersionForEnum({
            enumId: EnumId,
            requestBody: {
              enumId: EnumId,
              displayName: enumVersionName,
              version: enumVersionString,
              values: EnumValues
            }
          });
          expect(enumVersionResponse.data.id, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
          expect(enumVersionResponse.data.version, TestLogger.createApiTestFailMessage('failed')).to.eq(enumVersionString);
          // EnumVersionId = enumVersionResponse.data.id;    
        }
      } catch(e) {
        expect(e instanceof ApiError, TestLogger.createNotApiErrorMesssage(e.message)).to.be.true;
        expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
      }
    });

    it(`${scriptName}: should get all enum versions with paging`, async () => {
      const PageSize = 2;
      try {
        const enumVersionList: Array<EnumVersion> = [];
        let nextPage: number | null = 1;
        while(nextPage !== null) {

          const enumVersionsResponse: EnumVersionsResponse = await EnumsService.getEnumVersionsForEnum({
            enumId: EnumId,
            pageSize: PageSize,
            pageNumber: nextPage
          });
          if(enumVersionsResponse.data === undefined) throw new Error('enumVersionsResponse.data === undefined');
          enumVersionList.push(...enumVersionsResponse.data);
          if(PageSize <= EnumVersionQuantity) expect(enumVersionsResponse.data.length, TestLogger.createApiTestFailMessage('failed')).to.eq(PageSize);
          else expect(enumVersionsResponse.data.length, TestLogger.createApiTestFailMessage('failed')).to.eq(EnumVersionQuantity);
          if(enumVersionsResponse.meta === undefined) throw new Error('enumVersionsResponse.meta === undefined');
          const meta: T_EpMeta = enumVersionsResponse.meta as T_EpMeta;
          console.log(`meta=${JSON.stringify(meta, null, 2)}`);
          TestEpApiHelpers.validateMeta(meta);
          expect(meta.pagination.count, TestLogger.createApiTestFailMessage('failed')).to.eq(EnumVersionQuantity);
          
          nextPage = meta.pagination.nextPage;
        }

        expect(enumVersionList.length, 'failed').to.eq(EnumVersionQuantity);
        
        // DEBUG
        // expect(false, 'check meta response').to.be.true;

      } catch(e) {
        expect(e instanceof ApiError, TestLogger.createNotApiErrorMesssage(e.message)).to.be.true;
        expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
      }
    });

});

