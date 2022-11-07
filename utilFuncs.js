'use strict';

export function VariableTypeChecker (value, type, length){
    let result;
    let minLength;
    result = !(typeof  value != type || value == null || value.length <= minLength)
    return result;
}