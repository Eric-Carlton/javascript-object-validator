'use strict';

const validate = require('../src/javascriptObjectValidator');

describe('jsonObjectValidator', () => {
  let obj;
  let propertyDescriptors;

  beforeEach(() => {
    obj = {
      a: {
        b: {
          c: 'Hello',
          d: 'World',
        },
        f: false,
        g: '',
        h: null,
      },
    };

    propertyDescriptors = [
      {
        required: 'a',
      },
      {
        required: 'a.b',
      },
      {
        required: 'a.b.c',
      },
      {
        required: 'a.b.d',
      },
      {
        required: 'a.f',
      },
    ];
  });

  it('should return valid: true if the object passes validation', () => {
    expect(validate(obj, propertyDescriptors).valid).toBe(true);
  });

  it(
    'should return valid: false if the object is missing a required' +
      ' parameter and return an error message for the invalid property',
    () => {
      propertyDescriptors.push({required: 'notThere'});

      const validationObject = validate(obj, propertyDescriptors);

      expect(validationObject.valid).toBe(false);
      expect(validationObject.errors).toEqual([
        {
          message: 'Object must contain a valid value for notThere',
        },
      ]);
    }
  );

  it(
    'should return valid: false if the object is missing a required' +
      ' parameter and return a custom error message for the invalid' +
      'property if one is provided',
    () => {
      propertyDescriptors.push({
        required: 'notThere',
        error: 'Missing notThere property',
      });

      const validationObject = validate(obj, propertyDescriptors);

      expect(validationObject.valid).toBe(false);
      expect(validationObject.errors).toEqual(['Missing notThere property']);
    }
  );

  it(
    'should return valid: false if the object has a required parameter,' +
      ' but its value is in the provided invalidValues array',
    () => {
      propertyDescriptors.push({required: 'a.g', invalidValues: ['']});

      expect(validate(obj, propertyDescriptors).valid).toBe(false);
    }
  );

  it(
    'should return valid: true if a propertyDescriptor provides an array' +
      ' for its required property and at least one of the' +
      'properties is valid',
    () => {
      propertyDescriptors.push({required: ['a', 'a.h']});

      expect(validate(obj, propertyDescriptors).valid).toBe(true);
    }
  );

  it(
    'should return valid: false and a message in the errors array if a' +
      ' propertyDescriptor provides an array for its required property' +
      'and none of the properties is valid',
    () => {
      propertyDescriptors.push({required: ['notThere', 'a.h']});

      const validationObject = validate(obj, propertyDescriptors);

      expect(validationObject.valid).toBe(false);
      expect(validationObject.errors).toEqual([
        {
          message: 'Object must contain a valid value for notThere or a.h',
        },
      ]);
    }
  );

  it(
    'should return valid: false and a correctly formatted message for' +
      ' more than two invalid properties',
    () => {
      propertyDescriptors.push({
        required: ['notThere', 'alsoNotThere', 'a.h'],
      });

      const validationObject = validate(obj, propertyDescriptors);

      expect(validationObject.valid).toBe(false);
      expect(validationObject.errors).toEqual([
        {
          message:
            'Object must contain a valid value for' +
            ' notThere, alsoNotThere, or a.h',
        },
      ]);
    }
  );

  it(
    'should stop after finding one invalid property if' +
      ' lazy is set to true',
    () => {
      propertyDescriptors.push({required: 'notThere'});
      propertyDescriptors.push({required: 'a.h'});

      const validationObject = validate(obj, propertyDescriptors, true);

      expect(validationObject.valid).toBe(false);
      expect(validationObject.errors).toEqual([
        {
          message: 'Object must contain a valid value for notThere',
        },
      ]);
    }
  );

  it(
    'should not stop after finding one invalid property if' +
      ' lazy is not true',
    () => {
      propertyDescriptors.push({required: 'notThere'});
      propertyDescriptors.push({required: 'a.h'});

      const validationObject = validate(obj, propertyDescriptors);

      expect(validationObject.valid).toBe(false);
      expect(validationObject.errors).toEqual([
        {message: 'Object must contain a valid value for notThere'},
        {message: 'Object must contain a valid value for a.h'},
      ]);
    }
  );
});
