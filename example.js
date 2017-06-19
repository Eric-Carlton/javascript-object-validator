const validate = require('./src/javascriptObjectValidator');
const toValidate = { name: 'John', age: 26, spouse: { name: 'Jane', age: NaN } };
const requiredProperties = [
    // toValidate.name is required to be defined and not null
    { required: 'name' },
    // toValidate.age is required to be defined and not null or NaN
    { required: 'age', invalidValues: [NaN] },
    // toValidate.spouse.name is required to be defined and not null or an empty string.
    // Use a custom error message if the property is invalid
    { required: 'spouse.name', invalidValues: [''], error: { message: 'spouse is required and must contain a name' } },
    // toValidate.spouse.age is required to be defined and not null or NaN.
    // Use a custom error message if the property is invalid.
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
