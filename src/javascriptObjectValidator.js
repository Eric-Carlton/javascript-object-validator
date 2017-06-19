'use strict';

/**
 * Validates the object passed in agains the propertyDescriptors array. Returns
 * a validationObject that indicates whether the object passed validation. And
 * an array of error message(s) if the object did not pass.
 *
 * @param {Object} object the object to be validated
 * @param {Object[]} propertyDescriptors array of propertyDescriptor objects
 * each propertyDescriptor should be formatted as follows:
 *  {
 *      required {String | String[]} parameter name as a string - 'a', 'a.b',
 *      'a.b.c', etc. - if an array is passed, the existence
 *      (not undefined or null) of any parameter in the array will cause the
 *      propertyDescriptor to be considered valid
 *
 *      invalidValues {Array} (optional) if provided, contains values of
 *      property/properties - other than undefined or null - that will cause
 *      the propertyDescriptor to be considered invalid
 *
 *      error: {Any} (optional) if provided, the error that will be added to
 *      the returned objects "errors" array if this propertyDescriptor is
 *      considered invalid. If not provided, a default error will be created.
 *  }
 * @param {boolean} lazy true if evaluation should stop on first invalid
 * propertyDescriptor, false otherwise
 *
 * @return {Object} formatted as follows:
 *  {
 *      valid {boolean} true if all propertyDescriptors are valid,
 *      false otherwise
 *
 *      errors {Array} contains errors for any invalid propertyDescriptors
 *  }
 */
module.exports = (object, propertyDescriptors, lazy) => {
    let result = {
        valid: true,
        errors: [],
    };

    propertyDescriptors.some((propertyDescriptor) => {
        // doesObjectHaveAny expects propertyDescriptor.required to be an array.
        // If it's not, wrap it in an array
        if (!Array.isArray(propertyDescriptor.required)) {
            propertyDescriptor.required = [propertyDescriptor.required];
        }

        // object has none of the required properties, so valid should be set to
        // false and we need to push an error message
        if (!doesObjectHaveAny(object, propertyDescriptor)) {
            result.valid = false;

            if (propertyDescriptor.error) {
                result.errors.push(propertyDescriptor.error);
            } else {
                // default error message format is: 'Object must contain a
                // valid value for x, y, or z'
                let errorMessage = 'Object must contain a valid value for ';

                propertyDescriptor.required.forEach(
                    (requiredProperty, idx, arr) => {
                        if (arr.length > 1 && idx === arr.length - 1) {
                            errorMessage += 'or ';
                        }

                        errorMessage += requiredProperty;

                        if (arr.length > 2 && idx !== arr.length - 1) {
                            errorMessage += ', ';
                        } else if (arr.length >= 2) {
                            errorMessage += ' ';
                        }
                    });

                result.errors.push({message: errorMessage.trim()});
            }

            // if we're using lazy evaluation, execution can stop now -
            // we know that the object is invalid
            if (lazy) return true;
        }
    });

    return result;
};

/**
 * Returns true if curVal contains the property defined by propertyString, and
 * the value of that property does not exist in invalidValues.
 *
 * @param {Object} curVal the object to be validated
 * @param {String} propertyString string describing the property to check. If
 * the property does not exist as a direct child of curVal, the string should be
 * dot delimited to describe the location of the property. I.e. - 'a.b.c'
 * @param {*[]} invalidValues array of values that would make this property
 * invalid. null and undefined are included as default.
 *
 * @return {boolean} true if property described is valid, false otherwise.
 */
function doesObjectHaveProperty(curVal, propertyString, invalidValues) {
    // given that property is a.b, we need to first check object for a, then
    // object.a for b. split on "." so that we have each property on its own
    const splitProperties = propertyString.split('.');

    let containsProperty = true;

    // object['a'] will return object.a. However, object['a.b'] will not return
    // object.a.b in order to get object.a.b, the correct syntax is
    // object['a']['b']. To accomplish this, we check that the object in
    // context has the property and its value is not undefined or null
    splitProperties.every((property) => {
        curVal = curVal[property];

        containsProperty = curVal !== undefined && curVal !== null;
        return containsProperty;
    });

    // if containsProperty is true then we know curVal is not undefined or null.
    // additionally, if invalidValues is provided, then we need to make sure
    // that the value isn't otherwise invalid.
    containsProperty = containsProperty &&
        (!invalidValues || !invalidValues.includes(curVal));

    return containsProperty;
}

/**
 * Returns true if the object contains any of the properties in
 * requiredPropertyDescriptor.required. False otherwise.
 *
 * @param {Object} object the object to be validated
 * @param {Object} requiredPropertyDescriptor formatted as follows:
 *  {
 *      required {String | String[]} parameter name as a string - 'a', 'a.b',
 *      'a.b.c', etc. - if an array is passed, the existence
 *      (not undefined or null) of any parameter in the array will cause the
 *      propertyDescriptor to be considered valid
 *
 *      invalidValues {Array} (optional) if provided, contains values of
 *      property/properties - other than undefined or null - that will cause
 *      the propertyDescriptor to be considered invalid
 *
 *      error: {Any} (optional) if provided, the error that will be added to
 *      the returned objects "errors" array if this propertyDescriptor is
 *      considered invalid. If not provided, a default error will be created.
 *  }
 *
 * @return {boolean} true if object has any of the properties in
 * requirePropertyDescriptor.required
 */
function doesObjectHaveAny(object, requiredPropertyDescriptor) {
    let result = null;

    requiredPropertyDescriptor.required.some((requiredProperty) => {
        // if any of the required properties exist, we don't need
        // to continue checking
        result = doesObjectHaveProperty(object, requiredProperty,
            requiredPropertyDescriptor.invalidValues);

        return result;
    });

    return result;
}
