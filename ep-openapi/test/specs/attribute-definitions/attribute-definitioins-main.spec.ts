import 'mocha';
import { expect } from 'chai';
import path from 'path';
import { TestLogger } from '../../lib/TestLogger';
import { TestContext } from '../../lib/TestContext';
import TestConfig from '../../lib/TestConfig';
import { TestUtils } from '../../lib/TestUtils';
import { 
  ApiError, 
  CustomAttributeDefinitionsService,
  CustomAttributeDefinitionResponse,
  CustomAttributeDefinition
} from '../../../generated/@solace-labs/ep-openapi-node';

const scriptName: string = path.basename(__filename);
TestLogger.logMessage(scriptName, ">>> starting ...");

const CustomAttribtuteDefinitionName = `attr-${TestUtils.getUUID()}`;
let CustomAttribtuteDefinitionId: string;

describe(`${scriptName}`, () => {
    
    beforeEach(() => {
      TestContext.newItId();
    });

    after(async() => {
      try {
        const xvoid: void = await CustomAttributeDefinitionsService.deleteCustomAttributeDefinition({
          id: CustomAttribtuteDefinitionId
        });
      } catch(e) {
        expect(e instanceof ApiError, TestLogger.createNotApiErrorMesssage(e.message)).to.be.true;
        expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
      }
    });

    it(`${scriptName}: should create attribute definition`, async () => {
      try {
        const customAttributeDefinitionResponse: CustomAttributeDefinitionResponse = await CustomAttributeDefinitionsService.createCustomAttributeDefinition({
          requestBody: {
            name: CustomAttribtuteDefinitionName,
            valueType: CustomAttributeDefinition.valueType.STRING,
            associatedEntityTypes: ['event', 'eventVersion']
          }
        });
        const data: CustomAttributeDefinition | undefined = customAttributeDefinitionResponse.data;
        expect(data, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        expect(data.id, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        CustomAttribtuteDefinitionId = data.id;
      } catch(e) {
        expect(e instanceof ApiError, TestLogger.createNotApiErrorMesssage(e.message)).to.be.true;
        expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
      }
    });

});

