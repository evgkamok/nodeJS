"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateUser = validateCreateUser;
exports.validateUpdateUser = validateUpdateUser;
function validateCreateUser(data) {
    if (!data || typeof data !== 'object') {
        return { valid: false, error: 'Body is required' };
    }
    if (!data.username || typeof data.username !== 'string') {
        return { valid: false, error: 'username is required and must be a string' };
    }
    if (data.age === undefined || typeof data.age !== 'number' || data.age < 0) {
        return {
            valid: false,
            error: 'age is required and must be a positive number',
        };
    }
    if (!Array.isArray(data.hobbies) ||
        !data.hobbies.every((h) => typeof h === 'string')) {
        return {
            valid: false,
            error: 'hobbies is required and must be an array of strings',
        };
    }
    return { valid: true };
}
function validateUpdateUser(data) {
    if (!data || typeof data !== 'object') {
        return { valid: false, error: 'Body is required' };
    }
    if (data.username !== undefined && typeof data.username !== 'string') {
        return { valid: false, error: 'username must be a string' };
    }
    if (data.age !== undefined &&
        (typeof data.age !== 'number' || data.age < 0)) {
        return { valid: false, error: 'age must be a positive number' };
    }
    if (data.hobbies !== undefined &&
        (!Array.isArray(data.hobbies) ||
            !data.hobbies.every((h) => typeof h === 'string'))) {
        return { valid: false, error: 'hobbies must be an array of strings' };
    }
    return { valid: true };
}
