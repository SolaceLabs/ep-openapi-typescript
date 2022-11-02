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
  EventResponse, 
  EventsService, 
  Event as EpEvent,
  EventVersion,
  EventVersionResponse,
  CustomAttribute,
  CustomAttributeDefinitionsService,
  CustomAttributeDefinitionResponse,
  CustomAttributeDefinition
} from '../../../generated/@solace-labs/ep-openapi-node';

const scriptName: string = path.basename(__filename);
TestLogger.logMessage(scriptName, ">>> starting ...");


const ApplicationDomainName = `${TestConfig.getAppId()}/ep-openapi/${TestUtils.getUUID()}`;
let ApplicationDomainId: string;

const EventName = `event-${TestUtils.getUUID()}`;
let EventId: string;
const EventVersionName = `${TestUtils.getUUID()}`;
let EventVersionId: string;

const CustomAttribtuteDefinitionName = `attr-${TestUtils.getUUID()}`;
let CustomAttribtuteDefinitionId: string;
const EventNameAttributes = 'attributes' + EventName;
let EventIdAttributes: string;
let EventVersionIdAttributes: string;

describe(`${scriptName}`, () => {
    
    beforeEach(() => {
      TestContext.newItId();
    });

    after(async() => {
      try {
        let xvoid: void = await ApplicationDomainsService.deleteApplicationDomain({
          id: ApplicationDomainId
        });
        xvoid = await CustomAttributeDefinitionsService.deleteCustomAttributeDefinition({
          id: CustomAttribtuteDefinitionId
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

    it(`${scriptName}: should create event`, async () => {
      try {

        const eventResponse: EventResponse = await EventsService.createEvent({
          requestBody: {
            applicationDomainId: ApplicationDomainId,
            name: EventName,
          }
        });
        const data: EpEvent | undefined = eventResponse.data;
        expect(data, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        expect(data.id, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        EventId = data.id;
      } catch(e) {
        expect(e instanceof ApiError, TestLogger.createNotApiErrorMesssage(e.message)).to.be.true;
        expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
      }
    });

    it(`${scriptName}: should create event version (deprecated)`, async () => {
      try {
        const requestBody: EventVersion = {
          eventId: EventId,
          version: '1.0.0',
        };
        const eventVersionResponse: EventVersionResponse = await EventsService.createEventVersionForEvent({
          eventId: EventId,
          requestBody: requestBody
        });
        const data: EventVersion | undefined = eventVersionResponse.data;
        expect(data, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        expect(data.id, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        EventVersionId = data.id;
      } catch(e) {
        expect(e instanceof ApiError, TestLogger.createNotApiErrorMesssage(e.message)).to.be.true;
        expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
      }
    });

    it(`${scriptName}: should create event version`, async () => {
      try {
        const requestBody: EventVersion = {
          eventId: EventId,
          version: '1.1.0',
        };
        const eventVersionResponse: EventVersionResponse = await EventsService.createEventVersion({
          requestBody: requestBody
        });
        const data: EventVersion | undefined = eventVersionResponse.data;
        expect(data, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        expect(data.id, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        EventVersionId = data.id;
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

    it(`${scriptName}: should create event with attributes`, async () => {
      try {
        const customAttribute: CustomAttribute = {
          // customAttributeDefinitionName: CustomAttribtuteDefinitionName,
          value: 'attribute_1-value',
          customAttributeDefinitionId: CustomAttribtuteDefinitionId
        };
        const eventResponse: EventResponse = await EventsService.createEvent({
          requestBody: {
            applicationDomainId: ApplicationDomainId,
            name: EventNameAttributes,
            customAttributes: [ customAttribute ]
          }
        });
        const data: EpEvent | undefined = eventResponse.data;
        expect(data, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        expect(data.id, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        EventIdAttributes = data.id;
      } catch(e) {
        expect(e instanceof ApiError, TestLogger.createNotApiErrorMesssage(e.message)).to.be.true;
        expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
      }
    });

    it(`${scriptName}: should create event version with attributes`, async () => {
      try {
        const requestBody: EventVersion = {
          eventId: EventIdAttributes,
          version: '1.0.0',
        };        
        const eventVersionResponse: EventVersionResponse = await EventsService.createEventVersionForEvent({
          eventId: EventIdAttributes,
          requestBody: requestBody
        });
        const data: EventVersion | undefined = eventVersionResponse.data;
        expect(data, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        expect(data.id, TestLogger.createApiTestFailMessage('failed')).to.not.be.undefined;
        EventVersionIdAttributes = data.id;
      } catch(e) {
        expect(e instanceof ApiError, TestLogger.createNotApiErrorMesssage(e.message)).to.be.true;
        expect(false, TestLogger.createApiTestFailMessage('failed')).to.be.true;
      }
    });

});

