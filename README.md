# Javascript Object Validator

# Installation

You can install json-object-validator through npm: 
`$ npm install javascript-object-validator`

# Changelog

## 1.0.1

* fixed "main" in package.json

## 1.0.2

* added keywords to package.json

## 1.0.3

* Added Prettier
* Added pre-commit script to lint, prettify, and run unit tests
* Corrected incorrect usages of Array.some and Array.every

# Example Usage

```
const validate = require('javascript-object-validator'),
    toValidate = { name: 'John', age: 26, spouse: { name: 'Jane', age: NaN } },
    requiredProperties = [
    // toValidate.name is required to be defined and not null
    { required: 'name' },
    // toValidate.age is required to be defined and not null or NaN
    { required: 'age', invalidValues: [NaN] },
    // toValidate.spouse.name is required to be defined and not null or an empty string.
    // Use a custom error message if the property is invalid
    { required: 'spouse.name', invalidValues: [''], error: { message: 'spouse is required and must contain a name' } },
    // toValidate.spouse.age is required to be defined and not null or NaN.
    // Use a custom error message if the property is invalid
    { required: 'spouse.age', invalidValues: [NaN], error: { message: 'spouse is required and must contain an age' } },
    // one of toValidate.notThere or toValidate.alsoNotThere is required to be defined and not null
    { required: ['notThere', 'alsoNotThere'] }
];

// validate the object
console.log(validate(toValidate, requiredProperties));
/* 
    {  
        "valid":false,
        "errors":[  
            {  
                "message":"spouse is required and must contain an age"
            },
            {  
                "message":"Object must contain a valid value for notThere or alsoNotThere"
            }
        ]
    }
*/

// validate the object, but stop at the first error
console.log(validate(toValidate, requiredProperties, true));
/* 
    {  
        "valid":false,
        "errors":[  
            {  
                "message":"spouse is required and must contain an age"
            }
        ]
    }
*/

// validate the object ( with properties that will validate )
console.log(validate(toValidate, [
    { required: 'name' },
    { required: 'age' },
    { required: 'spouse' }
]));
/*
    {
        "valid":true,
        "errors":[]
    }
*/

```